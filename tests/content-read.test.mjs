import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../extension/content.js", import.meta.url), "utf8");
const context = vm.createContext({
  chrome: { runtime: { onMessage: { addListener() {} } } },
  setTimeout,
  URL,
  location: { origin: "https://x.com", href: "https://x.com/test/status/1" }
});
vm.runInContext(source, context);
const isIncomplete = vm.runInContext("isLikelyIncompleteTweetText", context);
const waitForStablePost = vm.runInContext("waitForStablePost", context);

assert.equal(isIncomplete("SANTA LIP NUDE LIVE\n#️⃣"), true);
assert.equal(isIncomplete("SANTA LIP NUDE LIVE\n#️⃣ LOrealLaqueNudexSanta"), false);

const partial = "SANTA LIP NUDE LIVE\n#️⃣";
const complete = `${partial} LOrealLaqueNudexSanta`;
let reads = 0;
const post = await waitForStablePost(() => {
  reads += 1;
  return { text: reads < 3 ? partial : complete, url: "https://x.com/test/status/1" };
}, { attempts: 8, intervalMs: 0, stableRoundsRequired: 2 });

assert.equal(post.text, complete);
assert.equal(post.possiblyIncomplete, false);
assert.ok(reads >= 5);

const timedOut = await waitForStablePost(
  () => ({ text: partial, url: "https://x.com/test/status/1" }),
  { attempts: 3, intervalMs: 0, stableRoundsRequired: 1 }
);
assert.equal(timedOut.text, partial);
assert.equal(timedOut.possiblyIncomplete, true);

console.log("X post stability tests passed.");
