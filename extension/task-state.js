export function taskStart(task) {
  const value = Date.parse(task?.chinaTrendStart || "");
  return Number.isFinite(value) ? value : null;
}

export function taskEnd(task) {
  const start = taskStart(task);
  return start == null ? null : start + 24 * 60 * 60 * 1000;
}

export function taskPhase(task, now = Date.now()) {
  const start = taskStart(task);
  const end = taskEnd(task);
  if (start == null) return { phase: "unknown", remaining: null };
  if (now < start) return { phase: "upcoming", remaining: start - now };
  if (now < end) return { phase: "running", remaining: end - now };
  return { phase: "ended", remaining: 0 };
}

export function formatDuration(ms) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const clock = [hours, minutes, secs].map((value) => String(value).padStart(2, "0")).join(":");
  return days > 0 ? `${days}天 ${clock}` : clock;
}

export function choosePriorityTask(tasks = [], now = Date.now()) {
  if (tasks.length === 0) return null;
  const running = tasks
    .filter((task) => taskPhase(task, now).phase === "running")
    .sort((a, b) => taskStart(b) - taskStart(a));
  if (running[0]) return running[0];
  const upcoming = tasks
    .filter((task) => taskPhase(task, now).phase === "upcoming")
    .sort((a, b) => taskStart(a) - taskStart(b));
  if (upcoming[0]) return upcoming[0];
  return [...tasks].sort((a, b) => (taskStart(b) || 0) - (taskStart(a) || 0))[0];
}
