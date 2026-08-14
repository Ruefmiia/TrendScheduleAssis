import assert from "node:assert/strict";
import {
  parseTrendTask,
  formatChinaTask,
  normalizeKeyword,
  normalizeHashtags,
  validateTrendCopy
} from "../extension/parser.js";

const sample = `📣 SANTA TREND SCHEDULE

🤍 Santa’s Lip Picks: Laque Resistance - Nude Edition ✨

📅 August 14, 2026
⏰ 12.00 PM (GMT+7)
📍SQ1 BTS Skytrain Connection
🔴 Live Shopee : L’Oreal Paris

Start trend : 11.45 AM (GMT+7)
🔑 SANTA LIP NUDE LIVE
#️⃣ LOrealLaqueNudexSanta

‼️Kindly refrain from using the hashtag and keyword before the scheduled time‼️`;

const task = parseTrendTask(sample, "https://x.com/example/status/1");
assert.equal(task.title, "Santa’s Lip Picks: Laque Resistance - Nude Edition ✨");
assert.equal(task.eventDate, "2026-08-14");
assert.equal(task.keyword, "SANTA LIP NUDE LIVE");
assert.deepEqual(task.hashtags, ["#LOrealLaqueNudexSanta"]);
assert.equal(task.chinaTrendStart, "2026-08-14T12:45:00+08:00");
assert.equal(task.chinaLiveStart, "2026-08-14T13:00:00+08:00");
assert.equal(task.doNotUseBeforeStart, true);

const actualHashtagSample = sample.replace("#️⃣ LOrealLaqueNudexSanta", "#LOrealLaqueNudexSanta");
const hashtagTask = parseTrendTask(actualHashtagSample);
assert.deepEqual(hashtagTask.hashtags, ["#LOrealLaqueNudexSanta"]);
assert.match(formatChinaTask(hashtagTask), /12:45/);
assert.match(formatChinaTask(hashtagTask), /#LOrealLaqueNudexSanta/);

console.log("Parser tests passed.");

const perthSantaSample = `📢 TREND SCHEDULE |SANTA
#Santapp
@LOrealParisTH

—★ 14 AUG 2026
⏰ 12:00 PM (BKK TIME)
📍 SQ1 BTS Skytrain Connection
LIVE: Shopee: L'Oreal Paris

✨ SANTA'S LIP PICKS: LAQUE RESISTANCE — NUDE EDITION ✨

— START TRENDING : 11:45 AM (BKK)
🔑 SANTA LIP NUDE LIVE
#️⃣ LOrealLaqueNudexSanta`;

const perthSantaTask = parseTrendTask(perthSantaSample, "https://x.com/TrendPerthSanta/status/1");
assert.equal(perthSantaTask.title, "SANTA'S LIP PICKS: LAQUE RESISTANCE — NUDE EDITION ✨");
assert.equal(perthSantaTask.eventDate, "2026-08-14");
assert.equal(perthSantaTask.sourceOffsetMinutes, 420);
assert.equal(perthSantaTask.chinaTrendStart, "2026-08-14T12:45:00+08:00");
assert.equal(perthSantaTask.chinaLiveStart, "2026-08-14T13:00:00+08:00");
assert.equal(perthSantaTask.keyword, "SANTA LIP NUDE LIVE");
assert.deepEqual(perthSantaTask.hashtags, ["#LOrealLaqueNudexSanta"]);
assert.equal(perthSantaTask.missing.length, 0);

console.log("TrendPerthSanta regression test passed.");

const xRenderedWithoutEmoji = `TREND SCHEDULE |SANTA
#Santapp @LOrealParisTH

—★ 14 AUG 2026
12:00 PM (BKK TIME)
SQ1 BTS Skytrain Connection
LIVE: Shopee: L'Oreal Paris

SANTA'S LIP PICKS: LAQUE RESISTANCE — NUDE EDITION

— START TRENDING : 11:45 AM (BKK)
SANTA LIP NUDE LIVE
LOrealLaqueNudexSanta`;

const xRenderedTask = parseTrendTask(xRenderedWithoutEmoji);
assert.equal(xRenderedTask.keyword, "SANTA LIP NUDE LIVE");
assert.deepEqual(xRenderedTask.hashtags, ["#LOrealLaqueNudexSanta"]);
assert.equal(xRenderedTask.chinaTrendStart, "2026-08-14T12:45:00+08:00");
assert.equal(xRenderedTask.chinaLiveStart, "2026-08-14T13:00:00+08:00");

console.log("X emoji-stripped text regression test passed.");

assert.equal(normalizeKeyword("  SANTA   LIP NUDE   LIVE  "), "SANTA LIP NUDE LIVE");
assert.deepEqual(normalizeHashtags("LOrealLaqueNudexSanta  #LOrealLaqueNudexSanta"), ["#LOrealLaqueNudexSanta"]);

const validCopy = validateTrendCopy(perthSantaTask);
assert.equal(validCopy.valid, true);
assert.equal(validCopy.keyword, "SANTA LIP NUDE LIVE");
assert.deepEqual(validCopy.hashtags, ["#LOrealLaqueNudexSanta"]);

const invalidCopy = validateTrendCopy({ keyword: "BAD #KEYWORD", hashtags: ["#bad tag"] });
assert.equal(invalidCopy.valid, false);
assert.ok(invalidCopy.errors.length >= 2);

const suspiciousCopy = validateTrendCopy({ keyword: "SANTA TEST", hashtags: ["#Santapp"], sourceText: "SANTA TEST #Santapp" });
assert.equal(suspiciousCopy.valid, true);
assert.ok(suspiciousCopy.warnings.some((item) => item.includes("#Santapp")));

console.log("Keyword and Hashtag validation tests passed.");
