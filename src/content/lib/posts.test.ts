import assert from "node:assert/strict";
import test from "node:test";

const { renderMarkdown } = await import(
  new URL("./posts.ts", import.meta.url).href
);
const { isPageBottom } = await import(
  new URL(
    "../../app/(site)/[slug]/_components/table-of-contents-state.ts",
    import.meta.url,
  ).href
);

test("detects the bottom of the document despite subpixel rounding", () => {
  assert.equal(isPageBottom(800, 1199.5, 2000), true);
  assert.equal(isPageBottom(800, 1198, 2000), false);
});

test("renders highlighted code without a redundant language badge", async () => {
  const html = await renderMarkdown(
    '```ts id="hidden-element" title="loop.ts"\nconst tag = "<div>";\n```',
  );

  assert.match(html, /data-rehype-pretty-code-figure/);
  assert.match(html, /<figure[^>]+id="hidden-element"/);
  assert.doesNotMatch(html, /code-language-label/);
  assert.doesNotMatch(html, /<script/);
  assert.match(html, /data-line-numbers/);
  assert.match(html, /github-light-default/);
});

test("creates a stable id from a code block title", async () => {
  const html = await renderMarkdown(
    "```js title=example.js\nconsole.log('ok')\n```",
  );

  assert.match(html, /<figure[^>]+id="example-js"/);
});

test("preserves added and removed diff colors", async () => {
  const html = await renderMarkdown("```diff\n- before\n+ after\n```");

  assert.match(html, /data-diff="remove"/);
  assert.match(html, /data-diff="add"/);
});

test("renders footnote references and accessible back links", async () => {
  const html = await renderMarkdown(
    "본문의 각주[^1]\n\n[^1]: 각주 내용입니다.",
  );

  assert.match(html, /href="#footnote-1"[^>]+data-footnote-ref/);
  assert.match(html, /<section class="footnotes" data-footnotes>/);
  assert.match(html, /id="footnote-1"/);
  assert.match(html, /aria-label="각주 참조 1로 돌아가기"/);
});
