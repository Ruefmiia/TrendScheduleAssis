function articleToPost(article) {
  const textNode = article?.querySelector('[data-testid="tweetText"]');
  const timeNode = article?.querySelector("time[datetime]");
  const statusLink = article
    ? [...article.querySelectorAll('a[href*="/status/"]')].find((link) =>
        /\/status\/\d+/.test(link.getAttribute("href") || "")
      )
    : null;
  const rawUrl = statusLink ? new URL(statusLink.href, location.origin).href : location.href;
  const statusMatch = rawUrl.match(/^(https:\/\/(?:x|twitter)\.com\/[^/]+\/status\/\d+)/i);
  return {
    text: extractTweetText(textNode),
    url: statusMatch?.[1] || rawUrl,
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

function isLikelyIncompleteTweetText(text) {
  const value = String(text || "").trim();
  if (!value) return true;
  // X 可能先渲染提示符，稍后才补上相邻的 Keyword / Hashtag 文本。
  return /(?:#️⃣|🔑|📅|⏰|📍|🔴|#)\s*$/u.test(value);
}

async function waitForStablePost(readPost, options = {}) {
  const attempts = options.attempts || 30;
  const intervalMs = options.intervalMs ?? 750;
  const stableRoundsRequired = options.stableRoundsRequired || 2;
  let bestPost = null;
  let stableRounds = 0;

  for (let round = 0; round < attempts; round += 1) {
    const post = readPost();
    if (post?.text) {
      if (!bestPost || post.text.length > bestPost.text.length) {
        bestPost = post;
        stableRounds = 0;
      } else if (post.text === bestPost.text) {
        stableRounds += 1;
      }

      if (stableRounds >= stableRoundsRequired && !isLikelyIncompleteTweetText(bestPost.text)) {
        return { ...bestPost, possiblyIncomplete: false };
      }
    }
    if (round < attempts - 1) await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  return bestPost ? { ...bestPost, possiblyIncomplete: isLikelyIncompleteTweetText(bestPost.text) } : null;
}

async function extractPostByStatus(statusId) {
  return waitForStablePost(() => {
    const article = [...document.querySelectorAll("article")].find((candidate) =>
      [...candidate.querySelectorAll('a[href*="/status/"]')].some((link) =>
        (link.getAttribute("href") || "").includes(`/status/${statusId}`)
      )
    );
    return article ? articleToPost(article) : null;
  });
}

function sortRecentTrendPosts(posts, limit = 3) {
  return [...posts].sort((a, b) => {
    const aTime = Date.parse(a.publishedAt || "") || 0;
    const bTime = Date.parse(b.publishedAt || "") || 0;
    return bTime - aTime;
  }).slice(0, limit);
}

async function findRecentTrendPostsOnPage(limit = 3) {
  const found = new Map();
  let unchangedRounds = 0;
  for (let round = 0; round < 24; round += 1) {
    const sizeBefore = found.size;
    for (const article of document.querySelectorAll("article")) {
      const post = articleToPost(article);
      if (/TREND\s+SCHEDULE/i.test(post.text) && /\/status\/\d+/.test(post.url)) {
        found.set(post.url, post);
      }
    }
    unchangedRounds = found.size === sizeBefore ? unchangedRounds + 1 : 0;
    if (found.size >= limit && round >= 2) break;
    if (found.size > 0 && unchangedRounds >= 3 && round >= 3) break;
    window.scrollBy({ top: Math.max(window.innerHeight * 0.85, 600), behavior: "smooth" });
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return sortRecentTrendPosts(found.values(), limit);
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "EXTRACT_POST_BY_STATUS") {
    extractPostByStatus(message.statusId)
      .then((post) => sendResponse({ post, error: post ? null : "无法读取帖子详情页正文" }))
      .catch((error) => sendResponse({ post: null, error: error.message }));
    return true;
  }

  if (message?.type === "FIND_RECENT_TRENDS_ON_PAGE" || message?.type === "FIND_LATEST_TREND_ON_PAGE") {
    findRecentTrendPostsOnPage(message.limit || 3)
      .then((posts) => sendResponse({ posts, post: posts[0] || null, error: posts.length ? null : "搜索结果中没有找到趋势任务" }))
      .catch((error) => sendResponse({ posts: [], post: null, error: error.message }));
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
