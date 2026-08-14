const normalizeKeywordKey = (value) => String(value || "").replace(/\s+/g, " ").trim().toLocaleLowerCase();

export function taskDedupKey(task) {
  const keyword = normalizeKeywordKey(task?.keyword);
  const date = task?.eventDate || task?.chinaTrendStart?.slice(0, 10) || "undated";
  if (keyword) return `keyword:${date}:${keyword}`;
  const hashtag = String(task?.hashtags?.[0] || "").trim().toLocaleLowerCase();
  if (hashtag) return `hashtag:${date}:${hashtag}`;
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
