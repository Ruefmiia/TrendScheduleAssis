function normalizeUsername(value) {
  const input = String(value || "").trim();
  const urlMatch = input.match(/(?:x|twitter)\.com\/([A-Za-z0-9_]{1,15})/i);
  return (urlMatch?.[1] || input.replace(/^@/, "")).match(/^[A-Za-z0-9_]{1,15}$/)?.[0] || null;
}

function enableActionSidePanel() {
  if (!chrome.sidePanel?.setPanelBehavior) return;
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
}

chrome.runtime.onInstalled.addListener(enableActionSidePanel);
chrome.runtime.onStartup.addListener(enableActionSidePanel);
enableActionSidePanel();

const START_ALARM_PREFIX = "trend-start:";

async function scheduleTasks(tasks = []) {
  const existing = await chrome.alarms.getAll();
  await Promise.all(existing
    .filter((alarm) => alarm.name.startsWith(START_ALARM_PREFIX))
    .map((alarm) => chrome.alarms.clear(alarm.name)));

  const now = Date.now();
  for (const task of tasks) {
    const startAt = Date.parse(task.chinaTrendStart || "");
    if (!task.id || !Number.isFinite(startAt) || startAt <= now) continue;
    chrome.alarms.create(`${START_ALARM_PREFIX}${task.id}`, { when: startAt });
  }
}

chrome.runtime.onStartup.addListener(async () => {
  const { savedTasks = [] } = await chrome.storage.local.get("savedTasks");
  await scheduleTasks(savedTasks);
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (!alarm.name.startsWith(START_ALARM_PREFIX)) return;
  const taskId = alarm.name.slice(START_ALARM_PREFIX.length);
  const { savedTasks = [] } = await chrome.storage.local.get("savedTasks");
  const task = savedTasks.find((item) => item.id === taskId);
  if (!task) return;
  chrome.notifications.create(`trend-notice:${taskId}`, {
    type: "basic",
    iconUrl: chrome.runtime.getURL("icon.svg"),
    title: "趋势任务已开始",
    message: [task.keyword, ...(task.hashtags || [])].filter(Boolean).join("  "),
    priority: 2
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "SCHEDULE_TASKS") return;
  scheduleTasks(message.tasks)
    .then(() => sendResponse({ ok: true }))
    .catch((error) => sendResponse({ ok: false, error: error.message }));
  return true;
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function setProgress(stage, message, extra = {}) {
  const progress = { stage, message, updatedAt: new Date().toISOString(), ...extra };
  await chrome.storage.local.set({ autoReadProgress: progress });
  return progress;
}

function waitForTab(tabId, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (error, tab) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      chrome.tabs.onUpdated.removeListener(listener);
      error ? reject(error) : resolve(tab);
    };
    const listener = async (updatedId, info, tab) => {
      if (updatedId === tabId && info.status === "complete") finish(null, tab);
    };
    const timer = setTimeout(() => finish(new Error("X 页面加载超过 30 秒")), timeoutMs);
    chrome.tabs.onUpdated.addListener(listener);
    // 监听器注册后立即检查状态，避免 complete 事件已经发生的竞态。
    chrome.tabs.get(tabId).then((tab) => {
      if (tab.status === "complete") finish(null, tab);
    }).catch((error) => finish(error));
  });
}

function navigateTabAndWait(tabId, url, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const statusId = url.match(/\/status\/(\d+)/)?.[1];
    const finish = (error, tab) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      chrome.tabs.onUpdated.removeListener(listener);
      error ? reject(error) : resolve(tab);
    };
    const listener = (updatedId, info, tab) => {
      if (updatedId !== tabId || info.status !== "complete") return;
      if (statusId && !(tab.url || "").includes(`/status/${statusId}`)) return;
      finish(null, tab);
    };
    const timer = setTimeout(() => finish(new Error("X 帖子详情加载超过 30 秒")), timeoutMs);
    chrome.tabs.onUpdated.addListener(listener);
    chrome.tabs.update(tabId, { url }).catch((error) => finish(error));
  });
}

async function sendMessageWithRetry(tabId, message, options = {}) {
  const attempts = options.attempts || 8;
  const intervalMs = options.intervalMs || 800;
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await chrome.tabs.sendMessage(tabId, message);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await delay(intervalMs);
    }
  }
  throw new Error(`无法连接 X 页面读取脚本：${lastError?.message || "未知错误"}`);
}

function assertReadableXPage(tab) {
  const url = tab?.url || "";
  if (/\/login|\/i\/flow\/login|onboarding\/web/i.test(url)) throw new Error("X 尚未登录");
  if (!/^https:\/\/(x|twitter)\.com\//.test(url)) throw new Error("X 页面发生了异常跳转");
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "FIND_LATEST_TREND") return;

  (async () => {
    const username = normalizeUsername(message.username);
    if (!username) throw new Error("请输入有效的 X 用户名，例如 @TrendAccount");

    const startedAt = new Date().toISOString();
    const debug = { version: "0.8.0", username, startedAt, stage: "starting" };
    await chrome.storage.local.set({ trendAccount: username, lastReadDebug: debug });
    await setProgress("search-loading", "正在加载 X 搜索页…");

    const query = encodeURIComponent(`from:${username} \"TREND SCHEDULE\"`);
    const searchUrl = `https://x.com/search?q=${query}&src=typed_query&f=live`;
    debug.searchUrl = searchUrl;
    const tab = await chrome.tabs.create({ url: searchUrl, active: false });

    try {
      const searchTab = await waitForTab(tab.id);
      assertReadableXPage(searchTab);
      await setProgress("searching", "正在定位最近的趋势帖子（最多 3 条）…");
      const result = await sendMessageWithRetry(tab.id, {
        type: "FIND_RECENT_TRENDS_ON_PAGE",
        username,
        limit: 3
      });
      const searchPosts = (result?.posts?.length ? result.posts : [result?.post].filter(Boolean)).slice(0, 3);
      if (!searchPosts.length) throw new Error(result?.error || "没有找到包含 TREND SCHEDULE 的帖子");

      debug.searchPosts = searchPosts.map((post) => ({ url: post.url, textLength: post.text?.length || 0 }));
      const completePosts = [];
      const detailErrors = [];
      for (let index = 0; index < searchPosts.length; index += 1) {
        const searchPost = searchPosts[index];
        await setProgress("detail-loading", `正在读取帖子详情（${index + 1}/${searchPosts.length}）…`, { postUrl: searchPost.url });
        const statusId = searchPost.url.match(/\/status\/(\d+)/)?.[1];
        let completePost = searchPost;
        let readMethod = "search-result";
        if (statusId) {
          try {
            const detailTab = await navigateTabAndWait(tab.id, searchPost.url);
            assertReadableXPage(detailTab);
            const detail = await sendMessageWithRetry(tab.id, {
              type: "EXTRACT_POST_BY_STATUS",
              statusId
            });
            if (detail?.post?.text) {
              completePost = detail.post;
              readMethod = "status-detail";
            }
          } catch (error) {
            detailErrors.push(`${searchPost.url}: ${error.message}`);
          }
        }
        completePosts.push({ ...completePost, readMethod });
      }

      debug.stage = "complete";
      debug.posts = completePosts.map((post) => ({
        url: post.url,
        publishedAt: post.publishedAt,
        readMethod: post.readMethod,
        textLength: post.text?.length || 0,
        possiblyIncomplete: Boolean(post.possiblyIncomplete)
      }));
      debug.detailErrors = detailErrors;
      debug.postUrl = completePosts[0].url;
      debug.publishedAt = completePosts[0].publishedAt;
      debug.readMethod = completePosts[0].readMethod;
      debug.textLength = completePosts[0].text?.length || 0;
      debug.possiblyIncomplete = Boolean(completePosts[0].possiblyIncomplete);
      debug.completedAt = new Date().toISOString();
      const savedPosts = completePosts.map((post) => ({ ...post, username, foundAt: debug.completedAt }));
      await chrome.storage.local.set({ latestTrendPosts: savedPosts, latestTrendPost: savedPosts[0], lastReadDebug: debug });
      await setProgress("complete", `已读取 ${completePosts.length} 条近期帖子`, { postUrl: completePosts[0].url });
      sendResponse({ ok: true, posts: completePosts, post: completePosts[0], debug });
    } catch (error) {
      debug.stage = "error";
      debug.error = error.message || "自动查找失败";
      debug.failedAt = new Date().toISOString();
      await chrome.storage.local.set({ lastReadDebug: debug });
      await setProgress("error", debug.error);
      throw error;
    } finally {
      if (tab?.id) await chrome.tabs.remove(tab.id).catch(() => {});
    }
  })().catch((error) => sendResponse({ ok: false, error: error.message || "自动查找失败" }));

  return true;
});
