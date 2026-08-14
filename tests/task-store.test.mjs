import assert from "node:assert/strict";
import { taskDedupKey, mergeTaskRecord, consolidateTaskRecords } from "../extension/task-store.js";

const first = {
  id: "first-id",
  eventDate: "2026-08-14",
  keyword: "SANTA LIP NUDE LIVE",
  hashtags: ["#LOrealLaqueNudexSanta"],
  username: "TrendforSanta",
  sourceUrl: "https://x.com/TrendforSanta/status/1"
};
const duplicate = {
  id: "second-id",
  eventDate: "2026-08-14",
  keyword: "  santa   lip nude live ",
  hashtags: ["#LOrealLaqueNudexSanta"],
  username: "TrendPerthSanta",
  sourceUrl: "https://x.com/TrendPerthSanta/status/2"
};
const anotherDate = { ...duplicate, id: "third-id", eventDate: "2026-08-15" };

assert.equal(taskDedupKey(first), taskDedupKey(duplicate));
assert.notEqual(taskDedupKey(first), taskDedupKey(anotherDate));
const sameKeywordDifferentHashtag = { ...first, hashtags: ["#AnotherActivity"] };
assert.notEqual(taskDedupKey(first), taskDedupKey(sameKeywordDifferentHashtag));
const sameHashtagWithoutKeyword = { ...first, keyword: "" };
assert.equal(taskDedupKey(first), taskDedupKey(sameHashtagWithoutKeyword));
const keywordFallback = { ...first, hashtags: [] };
assert.match(taskDedupKey(keywordFallback), /^keyword:/);
const merged = mergeTaskRecord(first, duplicate);
assert.equal(merged.id, "first-id");
assert.deepEqual(merged.usernames, ["TrendforSanta", "TrendPerthSanta"]);
const consolidated = consolidateTaskRecords([first, duplicate, anotherDate]);
assert.equal(consolidated.length, 2);
assert.deepEqual(consolidated.find((task) => task.eventDate === "2026-08-14").usernames, ["TrendforSanta", "TrendPerthSanta"]);

console.log("Cross-account task deduplication tests passed.");
