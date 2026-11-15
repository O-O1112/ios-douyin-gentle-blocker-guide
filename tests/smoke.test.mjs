import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { DEFAULT_QUOTES, STEPS, pickRandomQuote, escapeHtml } = require("../src/app.js");

test("STEPS 應包含 5 個設定步驟且編號連續", () => {
  assert.equal(STEPS.length, 5);
  STEPS.forEach((step, idx) => {
    assert.equal(step.id, idx + 1);
    assert.ok(step.title.length > 0);
    assert.ok(step.items.length > 0);
  });
});

test("pickRandomQuote 在空陣列與非空陣列皆應回傳有效字串", () => {
  const fallback = pickRandomQuote([]);
  assert.equal(typeof fallback, "string");
  assert.ok(fallback.length > 0);

  const picked = pickRandomQuote(DEFAULT_QUOTES);
  assert.ok(DEFAULT_QUOTES.includes(picked));
});

test("escapeHtml 應正確跳脫 HTML 特殊字元", () => {
  assert.equal(escapeHtml('<script>"test"</script>'), "&lt;script&gt;&quot;test&quot;&lt;/script&gt;");
});

test("src/index.html 應正確引用 styles.css 與 app.js", () => {
  const html = fs.readFileSync(path.resolve("src/index.html"), "utf8");
  assert.match(html, /href="styles\.css"/);
  assert.match(html, /src="app\.js"/);
});
