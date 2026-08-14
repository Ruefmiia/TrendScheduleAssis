function articleToPost(article) {
  const textNode = article?.querySelector('[data-testid="tweetText"]');
  const timeNode = article?.querySelector("time[datetime]");
  const statusLink = article
    ? [...article.querySelectorAll('a[href*="/status/"]')].find((link) =>
        /\/status\/\d+/.test(link.getAttribute("href") || "")
      )
    : null;
  return {
    text: extractTweetText(textNode),
    url: statusLink ? new URL(statusLink.href, location.origin).href : location.href,
    publishedAt: timeNode?.getAttribute("datetime") || null
  };
}

function extractTweetText(root) {
  if (!root) return "";
  const parts = [];

  function visit(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      parts.push(node.nodeValue || "");
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node;
    if (element.tagName === "BR") {
      parts.push("\n");
      return;
    }
    if (element.tagName === "IMG") {
      parts.push(element.getAttribute("alt") || "");
      return;
    }
    for (const child of element.childNodes) visit(child);
  }

  visit(root);
  return parts
    .join("")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function extractPostByStatus(statusId) {
  for (let round = 0; round < 30; round += 1) {
    const article = [...document.querySelectorAll("article")].find((candidate) =>
      [...candidate.querySelectorAll('a[href*="/status/"]')].some((link) =>
        (link.getAttribute("href") || "").includes(`/status/${statusId}`)
      )
    );
    if (article) {
      const post = articleToPost(article);
      if (post.text) return post;
    }
    await new Promise((resolve) => setTimeout(resolve, 750));
  }
  return null;
}

async function findLatestTrendOnPage() {
  const found = new Map();
  for (let round = 0; round < 24; round += 1) {
    for (const article of document.querySelectorAll("article")) {
      const post = articleToPost(article);
      if (/TREND\s+SCHEDULE/i.test(post.text) && /\/status\/\d+/.test(post.url)) {
        found.set(post.url, post);
      }
    }
    if (found.size > 0 && round >= 2) break;
    window.scrollBy({ top: Math.max(window.innerHeight * 0.85, 600), behavior: "smooth" });
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const posts = [...found.values()].sort((a, b) => {
    const aTime = Date.parse(a.publishedAt || "") || 0;
    const bTime = Date.parse(b.publishedAt || "") || 0;
    return bTime - aTime;
  });
  return posts[0] || null;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "EXTRACT_POST_BY_STATUS") {
    extractPostByStatus(message.statusId)
      .then((post) => sendResponse({ post, error: post ? null : "无法读取帖子详情页正文" }))
      .catch((error) => sendResponse({ post: null, error: error.message }));
    return true;
  }

  if (message?.type === "FIND_LATEST_TREND_ON_PAGE") {
    findLatestTrendOnPage()
      .then((post) => sendResponse({ post, error: post ? null : "搜索结果中没有找到趋势任务" }))
      .catch((error) => sendResponse({ post: null, error: error.message }));
    return true;
  }

  if (message?.type !== "EXTRACT_X_POST") return;

  const selectedText = window.getSelection()?.toString().trim();
  if (selectedText) {
    sendResponse({ text: selectedText, url: location.href, source: "selection" });
    return;
  }

  const articles = [...document.querySelectorAll("article")];
  const scored = articles
    .map((article) => {
      const rect = article.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      const distance = Math.abs(rect.top - window.innerHeight * 0.25);
      return { article, score: (visible ? 10000 : 0) - distance };
    })
    .sort((a, b) => b.score - a.score);

  const article = scored[0]?.article;
  const post = articleToPost(article);

  sendResponse({
    text: post.text,
    url: post.url,
    source: post.text ? "visible-post" : "none"
  });
});
