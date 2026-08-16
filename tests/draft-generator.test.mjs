import assert from "node:assert/strict";
import { DRAFT_LIBRARY, detectActivityType, generateDrafts, getDraftMode } from "../extension/draft-generator.js";

assert.equal(DRAFT_LIBRARY.length, 500);
assert.equal(DRAFT_LIBRARY.filter((item) => item.type === "general").length, 400);
assert.equal(DRAFT_LIBRARY.filter((item) => item.type === "celebration").length, 100);
assert.equal(DRAFT_LIBRARY.filter((item) => item.id.startsWith("praise-")).length, 140);
assert.ok(DRAFT_LIBRARY.filter((item) => item.id.startsWith("praise-")).every((item) => [...item.text.zh].length <= 30));
assert.ok(DRAFT_LIBRARY.every((item) => ["zh", "en", "ja", "ko"].every((language) => item.text[language])));
assert.equal(new Set(DRAFT_LIBRARY.map((item) => item.id)).size, 500);
for (const language of ["zh", "en", "ja", "ko"]) {
  assert.equal(new Set(DRAFT_LIBRARY.map((item) => item.text[language])).size, 500);
}

const full = { keyword: "SANTA LIP NUDE LIVE", hashtags: ["#LOrealLaqueNudexSanta"] };
assert.equal(getDraftMode(full).mode, "keyword-hashtag");
const fullDrafts = generateDrafts(full, { language: "en", count: 5 });
assert.equal(fullDrafts.length, 5);
assert.equal(new Set(fullDrafts.map((item) => item.text)).size, 5);
assert.ok(fullDrafts.every((item) => item.text.includes(full.keyword) && item.text.includes(full.hashtags[0])));
assert.ok(fullDrafts.every((item) => item.charCount <= 280));
for (const language of ["zh", "en", "ja", "ko"]) {
  assert.equal(generateDrafts(full, { language, count: 10 }).length, 10);
}
assert.equal(detectActivityType({ sourceText: "HAPPY BIRTHDAY EVENT" }), "celebration");
assert.equal(detectActivityType({ sourceText: "BRAND LIVE EVENT" }), "general");

const hashtagOnly = { keyword: "", hashtags: ["#Santapp"] };
assert.equal(getDraftMode(hashtagOnly).mode, "hashtag-only");
assert.ok(generateDrafts(hashtagOnly, { count: 3 }).every((item) => item.text.endsWith("#Santapp")));
assert.throws(() => generateDrafts({ keyword: "KEY", hashtags: [] }), /Hashtag/);
console.log("Draft generator tests passed.");
