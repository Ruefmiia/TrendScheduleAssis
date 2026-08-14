const MONTHS = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8, sep: 9,
  sept: 9, oct: 10, nov: 11, dec: 12
};

const cleanLine = (value = "") => value
  .replace(/^[\s\p{Emoji_Presentation}\p{Extended_Pictographic}#️⃣🔑📅⏰📍🔴‼️]+/gu, "")
  .trim();

function parseDate(text) {
  const english = text.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2})(?:st|nd|rd|th)?[,]?\s+(20\d{2})\b/i);
  if (english) {
    return { year: Number(english[3]), month: MONTHS[english[1].toLowerCase()], day: Number(english[2]) };
  }


  const dayFirst = text.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?[,]?\s+(20\d{2})\b/i);
  if (dayFirst) {
    return { year: Number(dayFirst[3]), month: MONTHS[dayFirst[2].toLowerCase()], day: Number(dayFirst[1]) };
  }

  const numeric = text.match(/\b(20\d{2})[\/-](\d{1,2})[\/-](\d{1,2})\b/);
  if (numeric) return { year: +numeric[1], month: +numeric[2], day: +numeric[3] };

  const chinese = text.match(/\b(20\d{2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (chinese) return { year: +chinese[1], month: +chinese[2], day: +chinese[3] };
  return null;
}

function parseClock(value) {
  if (!value) return null;
  const match = value.match(/\b(\d{1,2})[.:](\d{2})(?:\s*(AM|PM))?\b/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (minute > 59 || hour > (meridiem ? 12 : 23)) return null;
  if (meridiem === "AM" && hour === 12) hour = 0;
  if (meridiem === "PM" && hour !== 12) hour += 12;
  return { hour, minute, raw: match[0] };
}

function parseOffset(value, fallbackText = "") {
  const combined = `${value || ""} ${fallbackText}`;
  const match = combined.match(/(?:GMT|UTC)\s*([+-])\s*(\d{1,2})(?::?(\d{2}))?/i);
  if (!match && /\b(?:BKK|BANGKOK)(?:\s+TIME)?\b/i.test(combined)) return 7 * 60;
  if (!match) return null;
  const minutes = Number(match[2]) * 60 + Number(match[3] || 0);
  return (match[1] === "-" ? -1 : 1) * minutes;
}

function findLine(lines, patterns) {
  return lines.find((line) => patterns.some((pattern) => pattern.test(line))) || null;
}

function toIsoAndChina(date, clock, offsetMinutes) {
  if (!date || !clock || offsetMinutes == null) return { source: null, china: null };
  const utc = Date.UTC(date.year, date.month - 1, date.day, clock.hour, clock.minute) - offsetMinutes * 60000;
  const sourceDate = new Date(utc + offsetMinutes * 60000);
  const chinaDate = new Date(utc + 8 * 60 * 60000);
  const format = (d, offset) => {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const h = String(d.getUTCHours()).padStart(2, "0");
    const min = String(d.getUTCMinutes()).padStart(2, "0");
    const sign = offset >= 0 ? "+" : "-";
    const abs = Math.abs(offset);
    return `${y}-${m}-${day}T${h}:${min}:00${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
  };
  return { source: format(sourceDate, offsetMinutes), china: format(chinaDate, 480) };
}

function inferTitle(lines) {
  const headerIndex = lines.findIndex((line) => /trend\s*schedule|趋势任务/i.test(line));
  const candidates = lines.filter((line, index) => {
    if (headerIndex >= 0 && index <= headerIndex) return false;
    return !/^\s*(?:📅|⏰|📍|🔴|🔑|#️⃣|#|@|—?\s*start\s*trend|keyword|hashtag|live\s*:)/iu.test(line)
      && !/(?:GMT|UTC)\s*[+-]/i.test(line)
      && !/\b(?:BKK|BANGKOK)(?:\s+TIME)?\b/i.test(line)
      && !parseDate(line)
      && !/refrain|scheduled time|请勿提前|禁止提前/i.test(line);
  });
  return cleanLine(candidates[0] || "") || null;
}

export function parseTrendTask(input, sourceUrl = "") {
  const text = String(input || "").replace(/\r/g, "").trim();
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const date = parseDate(text);
  const trendLine = findLine(lines, [/start\s*trend/i, /trend\s*start/i, /开始(?:冲)?趋势/i, /趋势开始/i]);
  const markedLiveLine = findLine(lines, [/^⏰/u, /live\s*(?:start|time)/i, /直播时间/i]);
  const liveLine = markedLiveLine || lines.find((line) =>
    line !== trendLine
      && Boolean(parseClock(line))
      && /(?:GMT|UTC)\s*[+-]|\b(?:BKK|BANGKOK)(?:\s+TIME)?\b/i.test(line)
  );
  const trendClock = parseClock(trendLine);
  const liveClock = parseClock(liveLine);
  const offset = parseOffset(`${trendLine || ""} ${liveLine || ""}`, text);

  const keywordLine = findLine(lines, [/^🔑/u, /^(?:keyword|trend\s*keyword|关键词)\s*[:：]/i]);
  const trendLineIndex = trendLine ? lines.indexOf(trendLine) : -1;
  const linesAfterTrend = trendLineIndex >= 0 ? lines.slice(trendLineIndex + 1) : [];
  const fallbackKeywordLine = linesAfterTrend.find((line) => {
    const cleaned = cleanLine(line);
    const words = cleaned.match(/[A-Z][A-Z']+/g) || [];
    return words.length >= 2 && !/^#|^@|\d{1,2}[.:]\d{2}/.test(cleaned);
  });
  const resolvedKeywordLine = keywordLine || fallbackKeywordLine;
  const keyword = resolvedKeywordLine
    ? cleanLine(resolvedKeywordLine.replace(/^(?:🔑\s*)?(?:keyword|trend\s*keyword|关键词)?\s*[:：]?\s*/i, "")) || null
    : null;
  const explicitHashtags = text.match(/#[\p{L}\p{N}_]+/gu) || [];
  const hashtagHintLines = lines
    .filter((line) => /^#️⃣/u.test(line))
    .map((line) => cleanLine(line))
    .filter(Boolean)
    .map((value) => value.startsWith("#") ? value : `#${value.replace(/\s+/g, "")}`);
  const explicitHashtagsAfterTrend = trendLine
    ? (text.slice(text.indexOf(trendLine) + trendLine.length).match(/#[\p{L}\p{N}_]+/gu) || [])
    : [];
  const keywordIndex = resolvedKeywordLine ? lines.indexOf(resolvedKeywordLine) : -1;
  const possibleBareHashtag = keywordIndex >= 0
    ? lines.slice(keywordIndex + 1).map(cleanLine).find((line) => /^[A-Za-z][A-Za-z0-9_]{5,}$/.test(line))
    : null;
  // #️⃣ 后的值最可靠；兜底时也只检查 START TRENDING 之后，避免把 #Santapp 当成任务标签。
  const hashtags = [...new Set(
    hashtagHintLines.length > 0
      ? hashtagHintLines
      : explicitHashtagsAfterTrend.length > 0
        ? explicitHashtagsAfterTrend
        : possibleBareHashtag ? [`#${possibleBareHashtag}`] : []
  )];
  const locationLine = findLine(lines, [/^📍/u, /^(?:location|地点)\s*[:：]/i]);
  const platformLine = findLine(lines, [/^🔴/u, /live\s*(?:shopee|lazada|tiktok|youtube)/i]);
  const trendTimes = toIsoAndChina(date, trendClock, offset);
  const liveTimes = toIsoAndChina(date, liveClock, offset);

  return {
    title: inferTitle(lines),
    eventDate: date ? `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}` : null,
    sourceOffsetMinutes: offset,
    trendStart: trendTimes.source,
    liveStart: liveTimes.source,
    chinaTrendStart: trendTimes.china,
    chinaLiveStart: liveTimes.china,
    keyword,
    hashtags,
    location: locationLine ? cleanLine(locationLine) : null,
    platform: platformLine ? cleanLine(platformLine) : null,
    doNotUseBeforeStart: /refrain.{0,80}(?:before|prior)|do\s*not\s*use.{0,80}before|请勿提前|禁止提前/is.test(text),
    sourceUrl,
    sourceText: text,
    missing: [
      !date && "date",
      !trendClock && "trendStart",
      !keyword && "keyword",
      hashtags.length === 0 && "hashtags",
      offset == null && "timezone"
    ].filter(Boolean)
  };
}

export function formatChinaTask(task) {
  const formatChina = (iso) => {
    if (!iso) return "未识别";
    const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    return match ? `${match[1]}年${Number(match[2])}月${Number(match[3])}日 ${match[4]}:${match[5]}` : iso;
  };
  return [
    `📣 ${task.title || "趋势任务"}`,
    "",
    `📅 日期：${task.eventDate || "未识别"}`,
    `🚀 开始冲趋势（北京时间）：${formatChina(task.chinaTrendStart)}`,
    task.chinaLiveStart ? `🔴 直播开始（北京时间）：${formatChina(task.chinaLiveStart)}` : null,
    `🔑 关键词：${task.keyword || "未识别"}`,
    `#️⃣ 话题标签：${task.hashtags.join(" ") || "未识别"}`,
    task.location ? `📍 地点：${task.location}` : null,
    task.platform ? `📺 平台：${task.platform}` : null,
    task.doNotUseBeforeStart ? "\n‼️请勿在规定时间前使用关键词和话题标签‼️" : null,
    task.sourceUrl ? `\n原帖：${task.sourceUrl}` : null
  ].filter(Boolean).join("\n");
}

export function normalizeKeyword(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function normalizeHashtags(value) {
  const candidates = Array.isArray(value) ? value : String(value || "").split(/[\s,，]+/);
  return [...new Set(candidates.map((item) => {
    const cleaned = String(item || "").trim().replace(/^＃/, "#");
    return cleaned && !cleaned.startsWith("#") ? `#${cleaned}` : cleaned;
  }).filter(Boolean))];
}

export function validateTrendCopy(task) {
  const keyword = normalizeKeyword(task?.keyword);
  const hashtags = normalizeHashtags(task?.hashtags || []);
  const errors = [];
  const warnings = [];

  if (!keyword) errors.push("未识别到 Keyword");
  if (keyword.includes("#")) errors.push("Keyword 不应包含 #");
  if (keyword.length > 100) warnings.push("Keyword 长度异常，请核对原文");
  if (hashtags.length === 0) errors.push("未识别到 Hashtag");
  for (const tag of hashtags) {
    if (!/^#[\p{L}\p{N}_]+$/u.test(tag)) errors.push(`Hashtag 格式错误：${tag}`);
    if (/^#santapp$/i.test(tag)) warnings.push("当前结果是常规标签 #Santapp，请确认是否误识别");
  }
  if (hashtags.length > 2) warnings.push("识别到多个 Hashtag，请确认是否都属于趋势任务");

  const source = String(task?.sourceText || "");
  if (keyword && source && !source.replace(/\s+/g, " ").includes(keyword)) {
    warnings.push("Keyword 与原帖文字不完全一致");
  }
  for (const tag of hashtags) {
    if (source && !source.toLowerCase().includes(tag.slice(1).toLowerCase())) {
      warnings.push(`原帖中未找到 ${tag.slice(1)}`);
    }
  }

  return { keyword, hashtags, errors: [...new Set(errors)], warnings: [...new Set(warnings)], valid: errors.length === 0 };
}
