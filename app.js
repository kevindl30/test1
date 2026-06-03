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
  nextId: samplePosts.length + 1,
  selectedPostId: null
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
      const isSelected = post.id === state.selectedPostId;
      const classes = ["post", isMatch ? "match" : "", isNew ? "new" : "", isSelected ? "selected" : ""]
        .filter(Boolean)
        .join(" ");

      return `
        <article class="${classes}" data-post-id="${post.id}" tabindex="0">
          <div class="post-header">
            <h3>${escapeHtml(post.author)}</h3>
            <span class="meta">${escapeHtml(post.area)} &middot; ${post.minutesAgo} min ago</span>
          </div>
          <p>${highlightText(post.text, state.keyword)}</p>
          ${renderPostPhotos(post)}
          ${renderReplySection(post, isSelected)}
        </article>
      `;
    })
    .join("");
}

function renderReplySection(post, isSelected) {
  const replies = post.replies || [];
  const replyList = replies
    .map((reply) => {
      const normalizedReply = typeof reply === "string" ? { text: reply, photo: "" } : reply;

      return `
        <li>
          <p>${escapeHtml(normalizedReply.text)}</p>
          ${normalizedReply.photo ? renderPhoto(normalizedReply.photo, "Reply photo") : ""}
        </li>
      `;
    })
    .join("");

  if (!isSelected) {
    return `
      <div class="reply-summary">
        <span>${replies.length} ${replies.length === 1 ? "reply" : "replies"}</span>
        <span>Click post to reply</span>
      </div>
    `;
  }

  return `
    <div class="reply-panel">
      <form class="post-photo-form" data-photo-post-id="${post.id}">
        <label for="post-photo-${post.id}">Add a photo to this post</label>
        <div class="file-row">
          <input id="post-photo-${post.id}" name="photo" type="file" accept="image/*" />
          <button type="submit" class="secondary">Upload Photo</button>
        </div>
      </form>
      <form class="reply-form" data-reply-post-id="${post.id}">
        <label for="reply-${post.id}">Reply to this post</label>
        <textarea id="reply-${post.id}" name="reply" rows="3" placeholder="Type a helpful neighbor reply..."></textarea>
        <label class="file-label" for="reply-photo-${post.id}">Attach a reply photo</label>
        <input id="reply-photo-${post.id}" name="photo" type="file" accept="image/*" />
        <button type="submit">Submit Reply</button>
      </form>
      <div class="replies">
        <h4>${replies.length ? "Replies" : "No replies yet"}</h4>
        ${replies.length ? `<ul>${replyList}</ul>` : "<p>Be the first to respond.</p>"}
      </div>
    </div>
  `;
}

function renderPostPhotos(post) {
  const photos = post.photos || [];

  if (!photos.length) {
    return "";
  }

  return `
    <div class="photo-strip" aria-label="Post photos">
      ${photos.map((photo) => renderPhoto(photo, "Post photo")).join("")}
    </div>
  `;
}

function renderPhoto(src, alt) {
  return `<img class="uploaded-photo" src="${escapeHtml(src)}" alt="${alt}" />`;
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
    text,
    replies: []
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
postList.addEventListener("click", (event) => {
  if (event.target.closest(".reply-form") || event.target.closest(".post-photo-form")) {
    return;
  }

  const post = event.target.closest(".post");
  if (!post) {
    return;
  }

  state.selectedPostId = Number(post.dataset.postId);
  scanFeed();
});
postList.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const post = event.target.closest(".post");
  if (!post) {
    return;
  }

  event.preventDefault();
  state.selectedPostId = Number(post.dataset.postId);
  scanFeed();
});
postList.addEventListener("submit", async (event) => {
  event.preventDefault();

  const photoForm = event.target.closest(".post-photo-form");
  if (photoForm) {
    await submitPostPhoto(photoForm);
    return;
  }

  const form = event.target.closest(".reply-form");
  if (!form) {
    return;
  }

  await submitReply(form);
});

async function submitPostPhoto(form) {
  const postId = Number(form.dataset.photoPostId);
  const photoInput = form.elements.photo;
  const photo = await readImageFile(photoInput);

  if (!photo) {
    photoInput.focus();
    return;
  }

  state.posts = state.posts.map((post) => {
    if (post.id !== postId) {
      return post;
    }

    return {
      ...post,
      photos: [...(post.photos || []), photo]
    };
  });
  state.selectedPostId = postId;
  scanFeed();
}

async function submitReply(form) {
  const postId = Number(form.dataset.replyPostId);
  const replyInput = form.elements.reply;
  const photoInput = form.elements.photo;
  const replyText = replyInput.value.trim();
  const photo = await readImageFile(photoInput);

  if (!replyText && !photo) {
    replyInput.focus();
    return;
  }

  state.posts = state.posts.map((post) => {
    if (post.id !== postId) {
      return post;
    }

    return {
      ...post,
      replies: [
        ...(post.replies || []),
        {
          text: replyText || "Shared a photo.",
          photo
        }
      ]
    };
  });
  state.selectedPostId = postId;
  scanFeed();
}

function readImageFile(input) {
  const file = input.files && input.files[0];

  if (!file) {
    return Promise.resolve("");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

scanFeed();
