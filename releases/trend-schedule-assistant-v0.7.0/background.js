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
    const debug = { version: "0.7.0", username, startedAt, stage: "starting" };
    await chrome.storage.local.set({ trendAccount: username, lastReadDebug: debug });
    await setProgress("search-loading", "正在加载 X 搜索页…");

    const query = encodeURIComponent(`from:${username} \"TREND SCHEDULE\"`);
    const searchUrl = `https://x.com/search?q=${query}&src=typed_query&f=live`;
    debug.searchUrl = searchUrl;
    const tab = await chrome.tabs.create({ url: searchUrl, active: false });

    try {
      const searchTab = await waitForTab(tab.id);
      assertReadableXPage(searchTab);
      await setProgress("searching", "正在定位最近的趋势帖子…");
      const result = await sendMessageWithRetry(tab.id, {
        type: "FIND_LATEST_TREND_ON_PAGE",
        username
      });
      if (!result?.post) throw new Error(result?.error || "没有找到包含 TREND SCHEDULE 的帖子");

      debug.searchPostUrl = result.post.url;
      debug.searchTextLength = result.post.text?.length || 0;
      await setProgress("detail-loading", "已定位帖子，正在读取完整正文…", { postUrl: result.post.url });

      const statusId = result.post.url.match(/\/status\/(\d+)/)?.[1];
      let completePost = result.post;
      let readMethod = "search-result";
      if (statusId) {
        const detailLoaded = waitForTab(tab.id);
        await chrome.tabs.update(tab.id, { url: result.post.url });
        const detailTab = await detailLoaded;
        assertReadableXPage(detailTab);
        const detail = await sendMessageWithRetry(tab.id, {
          type: "EXTRACT_POST_BY_STATUS",
          statusId
        });
        if (detail?.post?.text) {
          completePost = detail.post;
          readMethod = "status-detail";
        }
      }

      debug.stage = "complete";
      debug.postUrl = completePost.url;
      debug.publishedAt = completePost.publishedAt;
      debug.readMethod = readMethod;
      debug.textLength = completePost.text?.length || 0;
      debug.completedAt = new Date().toISOString();
      const savedPost = { ...completePost, username, foundAt: debug.completedAt };
      await chrome.storage.local.set({ latestTrendPost: savedPost, lastReadDebug: debug });
      await setProgress("complete", "读取并解析完成", { postUrl: completePost.url });
      sendResponse({ ok: true, post: completePost, debug });
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
