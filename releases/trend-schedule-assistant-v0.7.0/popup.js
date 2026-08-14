import { parseTrendTask, validateTrendCopy } from "./parser.js";
import { taskStart, taskEnd, formatDuration, choosePriorityTask } from "./task-state.js";
import { taskDedupKey, mergeTaskRecord, consolidateTaskRecords } from "./task-store.js";
import { generateDrafts, getDraftMode, detectActivityType } from "./draft-generator.js";

const $ = (id) => document.getElementById(id);
let accounts = [];
let savedTasks = [];
let currentTask = null;
let currentValidation = null;
let countdownTimer = null;
let drafts = [];

const normalizeAccount = (value) => {
  const input = String(value || "").trim();
  const urlMatch = input.match(/(?:x|twitter)\.com\/([A-Za-z0-9_]{1,15})/i);
  return (urlMatch?.[1] || input.replace(/^@/, "")).match(/^[A-Za-z0-9_]{1,15}$/)?.[0] || null;
};

function setToast(message) {
  $("toast").textContent = message;
  setTimeout(() => { if ($("toast").textContent === message) $("toast").textContent = ""; }, 2200);
}

function setStatus(stage, message) {
  $("statusText").textContent = message;
  $("statusDot").className = `status-dot ${stage === "complete" ? "success" : stage === "error" ? "error" : stage === "idle" ? "idle" : "working"}`;
}

function taskAccountLabel(task) {
  const names = task?.usernames?.length ? task.usernames : [task?.username].filter(Boolean);
  if (names.length === 0) return "手动任务";
  if (names.length === 1) return `@${names[0]}`;
  return `${names.length} 个来源账号`;
}

function updateFlow() {
  const hasAccounts = accounts.some((account) => account.enabled);
  const hasTasks = savedTasks.length > 0;
  const steps = {
    accounts: !hasAccounts ? "current" : "done",
    recognize: !hasAccounts ? "pending" : hasTasks ? "done" : "current",
    copy: hasTasks ? "current" : "pending"
  };
  document.querySelectorAll(".flow-step").forEach((step) => {
    step.className = `flow-step ${steps[step.dataset.step]}`;
  });
  $("refreshAll").disabled = !hasAccounts;
}

function formatDateTime(iso) {
  const match = iso?.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  return match ? `${Number(match[2])}/${Number(match[3])} ${match[4]}:${match[5]}` : "未知时间";
}

function updateCountdown() {
  if (!currentTask) {
    $("countdown").textContent = "--:--:--";
    $("countdownLabel").textContent = "距离趋势开始";
    $("taskPhase").textContent = "等待刷新";
    $("taskPhase").className = "phase";
    return;
  }
  const now = Date.now();
  const start = taskStart(currentTask);
  const end = taskEnd(currentTask);
  $("taskCard").classList.remove("active-task", "ended");
  if (start == null) {
    $("countdown").textContent = "时间未知";
    $("countdownLabel").textContent = "请核对趋势开始时间";
    $("taskPhase").textContent = "缺少时间";
    $("taskPhase").className = "phase";
  } else if (now < start) {
    $("countdown").textContent = formatDuration(start - now);
    $("countdownLabel").textContent = "距离趋势开始";
    $("taskPhase").textContent = "尚未开始";
    $("taskPhase").className = "phase upcoming";
  } else if (now < end) {
    $("taskCard").classList.add("active-task");
    $("countdown").textContent = formatDuration(end - now);
    $("countdownLabel").textContent = "趋势进行中 · 距离 24h 结束";
    $("taskPhase").textContent = "可以刷推";
    $("taskPhase").className = "phase running";
  } else {
    $("taskCard").classList.add("ended");
    $("countdown").textContent = "已结束";
    $("countdownLabel").textContent = "趋势开始已超过 24 小时";
    $("taskPhase").textContent = "已结束";
    $("taskPhase").className = "phase";
  }
}

function validateCurrent() {
  if (!currentTask) return null;
  currentTask.keyword = $("keyword").value;
  currentTask.hashtags = $("hashtags").value.split(/[\s,，]+/).filter(Boolean);
  currentValidation = validateTrendCopy(currentTask);
  currentTask.keyword = currentValidation.keyword;
  currentTask.hashtags = currentValidation.hashtags;
  const issues = [...currentValidation.errors, ...currentValidation.warnings];
  $("warning").classList.toggle("hidden", issues.length === 0);
  $("warning").classList.toggle("error", currentValidation.errors.length > 0);
  $("warning").textContent = issues.join("；");
  return currentValidation;
}

function showTask(task) {
  currentTask = task || null;
  $("taskCard").classList.toggle("empty", !task);
  $("keyword").value = task?.keyword || "";
  $("hashtags").value = task?.hashtags?.join(" ") || "";
  $("taskAccount").textContent = task ? taskAccountLabel(task) : "暂无任务";
  $("timeSummary").textContent = task?.chinaTrendStart ? `北京时间 ${formatDateTime(task.chinaTrendStart)}` : "尚无时间信息";
  $("sourceLink").classList.toggle("hidden", !task?.sourceUrl);
  if (task?.sourceUrl) $("sourceLink").href = task.sourceUrl;
  $("warning").classList.add("hidden");
  if (task) validateCurrent();
  drafts = [];
  renderDraftPane();
  updateCountdown();
  updateFlow();
}

function currentDraftTask() {
  if (!currentTask) return null;
  const validation = validateCurrent();
  return { ...currentTask, keyword: validation?.keyword || "", hashtags: validation?.hashtags || [] };
}

function renderDraftPane() {
  const mode = getDraftMode(currentTask);
  const selectedType = $("activityType").value;
  const resolvedType = selectedType === "auto" ? detectActivityType(currentTask) : selectedType;
  const typeLabel = resolvedType === "celebration" ? "生日／纪念" : "通用活动";
  $("draftMode").textContent = currentTask ? `${mode.reason} · ${typeLabel}` : "请先识别或选择任务";
  $("generateDrafts").disabled = mode.mode === "unavailable";
  $("generateDrafts").textContent = drafts.length ? "换一批文案" : "生成本地文案";
  $("draftEmpty").classList.toggle("hidden", drafts.length > 0);
  $("draftList").replaceChildren();
  drafts.forEach((draft) => {
    const card = document.createElement("div");
    card.className = `draft-card${draft.used ? " used" : ""}`;
    const editor = document.createElement("textarea");
    editor.value = draft.text;
    editor.setAttribute("aria-label", "可编辑辅助文案");
    const footer = document.createElement("div");
    footer.className = "draft-footer";
    const count = document.createElement("span");
    count.className = "char-count";
    const updateCount = () => {
      draft.text = editor.value;
      draft.charCount = [...draft.text].length;
      count.textContent = `${draft.charCount}/280`;
      count.classList.toggle("over", draft.charCount > 280);
    };
    editor.addEventListener("input", updateCount);
    updateCount();
    const actions = document.createElement("div");
    actions.className = "draft-actions";
    const copy = createButton("复制", "ghost", "复制这一条文案");
    copy.addEventListener("click", async () => {
      if ([...editor.value].length > 280) return setToast("文案超过 280 字符，请先精简");
      await navigator.clipboard.writeText(editor.value);
      setToast("文案已复制");
    });
    const used = createButton(draft.used ? "取消已用" : "标记已用", "text-button", "记录使用状态");
    used.addEventListener("click", () => { draft.used = !draft.used; renderDraftPane(); });
    actions.append(copy, used);
    footer.append(count, actions);
    card.append(editor, footer);
    $("draftList").append(card);
  });
}

async function persistTasks() {
  await chrome.storage.local.set({ savedTasks });
  await chrome.runtime.sendMessage({ type: "SCHEDULE_TASKS", tasks: savedTasks });
  $("taskCount").textContent = String(savedTasks.length);
  renderTaskList();
}

async function upsertParsedTask(parsed, username, options = {}) {
  const validation = validateTrendCopy(parsed);
  const task = {
    ...parsed,
    keyword: validation.keyword,
    hashtags: validation.hashtags,
    username: username || "manual",
    savedAt: new Date().toISOString()
  };
  const identity = taskDedupKey(task);
  const existingIndex = savedTasks.findIndex((item) => taskDedupKey(item) === identity);
  task.id = existingIndex >= 0 ? savedTasks[existingIndex].id : crypto.randomUUID();
  task.identity = identity;
  task.usernames = [task.username];
  if (existingIndex >= 0) savedTasks.splice(existingIndex, 1, mergeTaskRecord(savedTasks[existingIndex], task));
  else savedTasks.push(task);
  await persistTasks();
  if (options.select !== false) showTask(task);
  return task;
}

function switchPane(name) {
  document.querySelectorAll(".tab").forEach((button) => button.classList.toggle("active", button.dataset.tab === name));
  document.querySelectorAll(".pane").forEach((pane) => pane.classList.toggle("active", pane.id === `pane-${name}`));
}

function createButton(label, className, title) {
  const button = document.createElement("button");
  button.textContent = label;
  button.className = className;
  if (title) button.title = title;
  return button;
}

function renderTaskList() {
  $("taskList").replaceChildren();
  $("taskEmpty").classList.toggle("hidden", savedTasks.length > 0);
  const sorted = [...savedTasks].sort((a, b) => (taskStart(a) || Infinity) - (taskStart(b) || Infinity));
  for (const task of sorted) {
    const item = document.createElement("div");
    item.className = "list-item";
    const main = document.createElement("div");
    main.className = "list-main";
    const title = document.createElement("div");
    title.className = "list-title";
    title.textContent = task.keyword || "未识别 Keyword";
    const sub = document.createElement("div");
    sub.className = "list-sub";
    sub.textContent = `${taskAccountLabel(task)} · ${formatDateTime(task.chinaTrendStart)}`;
    main.append(title, sub);
    main.addEventListener("click", () => { showTask(task); switchPane("current"); });
    const actions = document.createElement("div");
    actions.className = "list-actions";
    const copy = createButton("复制", "icon-button", "复制任务");
    copy.addEventListener("click", async () => {
      const validation = validateTrendCopy(task);
      if (!validation.valid) return setToast("任务内容需要修正");
      await navigator.clipboard.writeText([validation.keyword, ...validation.hashtags].join("\n"));
      setToast("已复制");
    });
    const remove = createButton("×", "icon-button", "删除任务");
    remove.addEventListener("click", async () => {
      savedTasks = savedTasks.filter((itemTask) => itemTask.id !== task.id);
      await persistTasks();
      if (currentTask?.id === task.id) showTask(choosePriorityTask(savedTasks));
    });
    actions.append(copy, remove);
    item.append(main, actions);
    $("taskList").append(item);
  }
}

async function persistAccounts() {
  await chrome.storage.local.set({ trendAccounts: accounts });
  $("accountCount").textContent = String(accounts.filter((account) => account.enabled).length);
  renderAccountList();
  updateFlow();
}

function renderAccountList() {
  $("accountList").replaceChildren();
  $("accountEmpty").classList.toggle("hidden", accounts.length > 0);
  for (const account of accounts) {
    const item = document.createElement("div");
    item.className = "list-item";
    const main = document.createElement("label");
    main.className = "switch-label";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = account.enabled;
    checkbox.addEventListener("change", async () => { account.enabled = checkbox.checked; await persistAccounts(); });
    const name = document.createElement("span");
    name.textContent = `@${account.username}`;
    main.append(checkbox, name);
    const actions = document.createElement("div");
    actions.className = "list-actions";
    const copy = createButton("复制", "ghost", "复制用户名");
    copy.addEventListener("click", async () => {
      await navigator.clipboard.writeText(`@${account.username}`);
      setToast("用户名已复制");
    });
    const remove = createButton("×", "icon-button", "删除账号");
    remove.addEventListener("click", async () => {
      accounts = accounts.filter((itemAccount) => itemAccount.username.toLowerCase() !== account.username.toLowerCase());
      await persistAccounts();
    });
    actions.append(copy, remove);
    item.append(main, actions);
    $("accountList").append(item);
  }
}

async function refreshAllAccounts() {
  const enabled = accounts.filter((account) => account.enabled);
  if (enabled.length === 0) {
    setStatus("error", "请先在账号页添加并启用趋势账号");
    switchPane("accounts");
    return;
  }
  $("refreshAll").disabled = true;
  $("refreshAll").textContent = "识别中…";
  let success = 0;
  const errors = [];
  for (let index = 0; index < enabled.length; index += 1) {
    const account = enabled[index];
    setStatus("working", `正在刷新 @${account.username}（${index + 1}/${enabled.length}）`);
    try {
      const response = await chrome.runtime.sendMessage({ type: "FIND_LATEST_TREND", username: account.username });
      if (!response?.ok) throw new Error(response?.error || "读取失败");
      const parsed = parseTrendTask(response.post.text, response.post.url);
      await upsertParsedTask(parsed, account.username, { select: false });
      success += 1;
    } catch (error) {
      errors.push(`@${account.username}: ${error.message}`);
    }
  }
  showTask(choosePriorityTask(savedTasks));
  switchPane("current");
  setStatus(errors.length ? "error" : "complete", errors.length ? `成功 ${success} 个；${errors.join("；")}` : `已刷新 ${success} 个账号`);
  $("refreshAll").disabled = false;
  $("refreshAll").textContent = "识别最新任务";
}

async function initialize() {
  const stored = await chrome.storage.local.get(["trendAccounts", "trendAccount", "savedTasks", "latestTrendPost"]);
  accounts = Array.isArray(stored.trendAccounts) ? stored.trendAccounts : [];
  if (accounts.length === 0 && stored.trendAccount) accounts = [{ username: stored.trendAccount, enabled: true }];
  savedTasks = consolidateTaskRecords(Array.isArray(stored.savedTasks) ? stored.savedTasks : []);
  if (savedTasks.length === 0 && stored.latestTrendPost?.text) {
    const parsed = parseTrendTask(stored.latestTrendPost.text, stored.latestTrendPost.url);
    await upsertParsedTask(parsed, stored.latestTrendPost.username || stored.trendAccount || "manual", { select: false });
  }
  await persistAccounts();
  await persistTasks();
  showTask(choosePriorityTask(savedTasks));
  if (accounts.length === 0) {
    switchPane("accounts");
    setStatus("idle", "第 1 步：请先添加趋势账号");
  } else if (savedTasks.length === 0) {
    setStatus("idle", "第 2 步：点击“识别最新任务”开始读取");
  } else {
    setStatus("complete", "任务已就绪，可直接复制使用");
  }
  countdownTimer = setInterval(updateCountdown, 1000);
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.autoReadProgress?.newValue) return;
  const progress = changes.autoReadProgress.newValue;
  setStatus(progress.stage, progress.message);
});

document.querySelectorAll(".tab").forEach((button) => button.addEventListener("click", () => switchPane(button.dataset.tab)));
document.querySelectorAll(".flow-step").forEach((button) => button.addEventListener("click", () => {
  if (button.dataset.step === "recognize") refreshAllAccounts();
  else if (button.dataset.tabTarget) switchPane(button.dataset.tabTarget);
}));
$("refreshAll").addEventListener("click", refreshAllAccounts);
$("addAccount").addEventListener("click", async () => {
  const username = normalizeAccount($("newAccount").value);
  if (!username) return setStatus("error", "账号格式无效");
  if (!accounts.some((account) => account.username.toLowerCase() === username.toLowerCase())) {
    accounts.push({ username, enabled: true });
    await persistAccounts();
  }
  $("newAccount").value = "";
  setStatus("complete", `已添加 @${username}，点击顶部“识别最新任务”`);
});
$("newAccount").addEventListener("keydown", (event) => { if (event.key === "Enter") $("addAccount").click(); });

["keyword", "hashtags"].forEach((id) => $(id).addEventListener("input", () => { validateCurrent(); renderDraftPane(); }));
$("copyOutput").addEventListener("click", async () => {
  const validation = validateCurrent();
  if (!validation?.valid) return setToast("请先修正标红内容");
  $("keyword").value = validation.keyword;
  $("hashtags").value = validation.hashtags.join(" ");
  await navigator.clipboard.writeText([validation.keyword, ...validation.hashtags].join("\n"));
  setToast("已复制");
});

$("generateDrafts").addEventListener("click", () => {
  try {
    drafts = generateDrafts(currentDraftTask(), {
      language: $("draftLanguage").value,
      count: Number($("draftCount").value),
      activityType: $("activityType").value
    });
    renderDraftPane();
    setToast(`已生成 ${drafts.length} 条文案`);
  } catch (error) {
    setToast(error.message);
  }
});
$("activityType").addEventListener("change", renderDraftPane);

$("readPost").addEventListener("click", async () => {
  $("readHint").textContent = "正在读取……";
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !/^https:\/\/(x|twitter)\.com\//.test(tab.url || "")) throw new Error("当前页面不是 X");
    const response = await chrome.tabs.sendMessage(tab.id, { type: "EXTRACT_X_POST" });
    if (!response?.text) throw new Error("未找到帖子正文");
    $("sourceText").value = response.text;
    $("sourceText").dataset.url = response.url || tab.url || "";
    $("readHint").textContent = "已读取当前帖子";
  } catch (error) {
    $("readHint").textContent = `${error.message}，可直接粘贴正文。`;
  }
});

$("parseTask").addEventListener("click", async () => {
  const text = $("sourceText").value.trim();
  if (!text) return setToast("请先读取或粘贴正文");
  const parsed = parseTrendTask(text, $("sourceText").dataset.url || "");
  await upsertParsedTask(parsed, "manual");
  setStatus("complete", "手动任务已解析并保存");
});
$("clearText").addEventListener("click", () => { $("sourceText").value = ""; $("readHint").textContent = ""; });

$("copyDebug").addEventListener("click", async () => {
  const { lastReadDebug = {}, autoReadProgress = {} } = await chrome.storage.local.get(["lastReadDebug", "autoReadProgress"]);
  const validation = currentTask ? validateCurrent() : null;
  const report = [
    "趋势任务助手调试信息", "版本：0.7.0",
    `启用账号：${accounts.filter((item) => item.enabled).map((item) => `@${item.username}`).join("、") || "无"}`,
    `阶段：${autoReadProgress.stage || lastReadDebug.stage || "未知"}`,
    `状态：${autoReadProgress.message || lastReadDebug.error || "无"}`,
    `帖子地址：${currentTask?.sourceUrl || lastReadDebug.postUrl || "无"}`,
    `读取方式：${lastReadDebug.readMethod || "无"}`,
    `正文长度：${currentTask?.sourceText?.length || 0}`,
    `Keyword：${validation?.keyword || "未识别"}`,
    `Hashtag：${validation?.hashtags.join(" ") || "未识别"}`,
    `校验问题：${[...(validation?.errors || []), ...(validation?.warnings || [])].join("；") || "无"}`,
    "--- 原始正文 ---", currentTask?.sourceText || "无"
  ].join("\n");
  await navigator.clipboard.writeText(report);
  setToast("调试信息已复制");
});

window.addEventListener("unload", () => { if (countdownTimer) clearInterval(countdownTimer); });
initialize();
