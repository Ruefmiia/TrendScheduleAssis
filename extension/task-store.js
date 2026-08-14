const normalizeKeywordKey = (value) => String(value || "").replace(/\s+/g, " ").trim().toLocaleLowerCase();
const normalizeHashtagKey = (value) => {
  let hashtag = String(value || "").trim().replace(/^＃/, "#");
  if (hashtag.startsWith("#")) hashtag = `#${hashtag.slice(1).replace(/^[.·•:：\-–—]+/u, "")}`;
  return hashtag.toLocaleLowerCase();
};

export function taskDedupKey(task) {
  const date = task?.eventDate || task?.chinaTrendStart?.slice(0, 10) || "undated";
  const hashtag = normalizeHashtagKey(task?.hashtags?.[0]);
  if (hashtag) return `hashtag:${date}:${hashtag}`;
  const keyword = normalizeKeywordKey(task?.keyword);
  if (keyword) return `keyword:${date}:${keyword}`;
  return `source:${task?.sourceUrl?.match(/\/status\/(\d+)/)?.[1] || task?.sourceUrl || "unknown"}`;
}

export function mergeTaskRecord(existing, incoming) {
  const usernames = [...new Set([
    ...(existing?.usernames || []),
    existing?.username,
    ...(incoming?.usernames || []),
    incoming?.username
  ].filter(Boolean))];
  return {
    ...existing,
    ...incoming,
    id: existing?.id || incoming.id,
    identity: taskDedupKey(incoming),
    username: usernames[0] || incoming.username || existing?.username || "manual",
    usernames
  };
}

export function consolidateTaskRecords(tasks = []) {
  const merged = new Map();
  for (const task of tasks) {
    const key = taskDedupKey(task);
    const existing = merged.get(key);
    merged.set(key, existing ? mergeTaskRecord(existing, task) : mergeTaskRecord(null, { ...task, identity: key }));
  }
  return [...merged.values()];
}
