import assert from "node:assert/strict";
import fs from "node:fs";

const popupJs = fs.readFileSync(new URL("../extension/popup.js", import.meta.url), "utf8");
const popupHtml = fs.readFileSync(new URL("../extension/popup.html", import.meta.url), "utf8");
const referencedIds = [...popupJs.matchAll(/\$\("([^"]+)"\)/g)].map((match) => match[1]);
const missingIds = [...new Set(referencedIds)].filter((id) => !popupHtml.includes(`id="${id}"`));

assert.deepEqual(missingIds, []);
console.log("Popup DOM contract test passed.");
