const samplePosts = [
  {
    id: 1,
    author: "Maya P.",
    area: "Cedar Grove",
    minutesAgo: 9,
    text: "Has anyone seen a small brown lost dog near Elm and 4th? He has a blue collar and is very friendly."
  },
  {
    id: 2,
    author: "Andre L.",
    area: "Maple Ridge",
    minutesAgo: 22,
    text: "Reminder that the neighborhood cleanup starts at 9 AM on Saturday by the community garden."
  },
  {
    id: 3,
    author: "Nina R.",
    area: "Cedar Grove",
    minutesAgo: 31,
    text: "Free moving boxes on my porch. Please take what you need before the rain starts."
  },
  {
    id: 4,
    author: "Sam K.",
    area: "Oak Terrace",
    minutesAgo: 45,
    text: "Power flickered twice this morning. Is anyone else seeing the same thing?"
  }
];

const simulatedPosts = [
  "I found a lost dog wandering near the school playground. Message me if this sounds like yours.",
  "Anyone have recommendations for a plumber who can come out today?",
  "Heads up: car break-in reported near Willow Court last night.",
  "Found keys on the trail by the pond. They are at my front desk now.",
  "Garage sale this weekend with kids bikes, books, and kitchen supplies."
];

const state = {
  posts: [...samplePosts],
  keyword: "lost dog",
  lastNewPostId: null,
  nextId: samplePosts.length + 1
};

const keywordInput = document.querySelector("#keyword-input");
const scanButton = document.querySelector("#scan-button");
const newPostButton = document.querySelector("#new-post-button");
const alertPanel = document.querySelector("#alert-panel");
const postList = document.querySelector("#post-list");
const postCount = document.querySelector("#post-count");
const matchCount = document.querySelector("#match-count");
const lastScan = document.querySelector("#last-scan");

function normalize(value) {
  return value.trim().toLowerCase();
}

function postMatches(post, keyword) {
  return keyword.length > 0 && post.text.toLowerCase().includes(keyword);
}

function highlightText(text, keyword) {
  if (!keyword) {
    return escapeHtml(text);
  }

  const escaped = escapeRegExp(keyword);
  const matcher = new RegExp(`(${escaped})`, "ig");
  return escapeHtml(text).replace(matcher, "<mark>$1</mark>");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scanFeed({ alertOnNewMatch = false } = {}) {
  state.keyword = normalize(keywordInput.value);
  const matches = state.posts.filter((post) => postMatches(post, state.keyword));
  const newestPost = state.posts.find((post) => post.id === state.lastNewPostId);
  const newestPostMatches = newestPost && postMatches(newestPost, state.keyword);

  renderPosts(matches);
  updateSummary(matches);
  updateAlert(matches, newestPost, newestPostMatches && alertOnNewMatch);
}

function renderPosts(matches) {
  const matchIds = new Set(matches.map((post) => post.id));
  postList.innerHTML = state.posts
    .map((post) => {
      const isMatch = matchIds.has(post.id);
      const isNew = post.id === state.lastNewPostId;
      const classes = ["post", isMatch ? "match" : "", isNew ? "new" : ""].filter(Boolean).join(" ");

      return `
        <article class="${classes}">
          <div class="post-header">
            <h3>${escapeHtml(post.author)}</h3>
            <span class="meta">${escapeHtml(post.area)} · ${post.minutesAgo} min ago</span>
          </div>
          <p>${highlightText(post.text, state.keyword)}</p>
        </article>
      `;
    })
    .join("");
}

function updateSummary(matches) {
  postCount.textContent = String(state.posts.length);
  matchCount.textContent = String(matches.length);
  lastScan.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function updateAlert(matches, newestPost, newMatchFound) {
  if (newMatchFound) {
    alertPanel.classList.add("active");
    alertPanel.innerHTML = `
      <div>
        <p class="panel-label">New keyword alert</p>
        <h2>New post matched "${escapeHtml(state.keyword)}"</h2>
      </div>
      <p>${escapeHtml(newestPost.text)}</p>
    `;
    return;
  }

  alertPanel.classList.toggle("active", matches.length > 0);
  alertPanel.innerHTML = `
    <div>
      <p class="panel-label">Alert status</p>
      <h2>${matches.length} matching ${matches.length === 1 ? "post" : "posts"} found</h2>
    </div>
    <p>${state.keyword ? `Monitoring for "${escapeHtml(state.keyword)}".` : "Enter a keyword to start monitoring."}</p>
  `;
}

function simulateNewPost() {
  const text = simulatedPosts[(state.nextId - samplePosts.length - 1) % simulatedPosts.length];
  const post = {
    id: state.nextId,
    author: "New Neighbor",
    area: "Live Demo",
    minutesAgo: 0,
    text
  };

  state.nextId += 1;
  state.lastNewPostId = post.id;
  state.posts = [post, ...state.posts.map((existing) => ({ ...existing, minutesAgo: existing.minutesAgo + 3 }))];
  scanFeed({ alertOnNewMatch: true });
}

scanButton.addEventListener("click", () => scanFeed());
newPostButton.addEventListener("click", simulateNewPost);
keywordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    scanFeed();
  }
});

scanFeed();
