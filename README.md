# Neighbor Keyword Alert

Neighbor Keyword Alert is a deployable MVP that turns a noisy neighborhood feed into a focused alert system.

The app lets a user enter a keyword, scan fictional neighborhood-style posts, highlight matching posts, and get an alert when a new matching post appears. Users can also click a post, submit a reply, and attach photos to posts or replies.

This demo intentionally uses mock Nextdoor-like posts instead of scraping or connecting to a real social platform. A production version would use approved platform APIs and would not access private content without permission.

## Who It Helps

This app is for people who care about timely local updates but do not want to constantly monitor every neighborhood post.

Examples include:

- Pet owners watching for lost or found pet posts
- Parents monitoring safety alerts near schools or parks
- Neighbors looking for urgent community updates
- Local volunteers helping with lost pets, mutual aid, or neighborhood watch
- Busy residents who only want alerts for topics they care about

## What It Does

- Monitors a fictional neighborhood feed for a user-defined keyword
- Highlights matching posts in the feed
- Shows an alert when a simulated new post matches the keyword
- Lets users click a post and submit a reply
- Lets users attach photos to posts and replies
- Persists the keyword, posts, replies, uploaded photos, and simulated posts with `localStorage`

## How To Demo

1. Open the deployed app.
2. Leave the keyword as `lost dog`, or enter a different keyword.
3. Click **Scan Feed** to highlight matching posts.
4. Click **Simulate New Post** to trigger a new matching alert.
5. Click a post to open the reply panel.
6. Add a reply and submit it.
7. Attach a photo to a post or reply.
8. Refresh the page to show that replies, photos, and simulated posts persist locally.

## How It Was Built

The app is built with plain HTML, CSS, and JavaScript.

- `index.html` defines the page structure.
- `styles.css` styles the dashboard, alerts, posts, replies, and photo previews.
- `app.js` manages keyword scanning, simulated posts, replies, photo previews, and `localStorage` persistence.

No framework, backend, database, or external API is required for the demo.

## Run Locally

Open `index.html` in a browser.

## Deploy To Vercel

Import the GitHub repo into Vercel.

Use these settings:

- Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `.`

## Limitations

- The feed is mock data.
- Uploaded photos are stored in browser `localStorage`, so very large images may exceed browser storage limits.
- Data persists only in the current browser, not across users or devices.
- A real Nextdoor integration would require official API access or another approved data source.
