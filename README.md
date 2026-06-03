# Hackathon 26 Starter

This repo contains a tiny deployable MVP app. Your job is to use Codex to inspect it, understand it, modify it, and deploy your own version in 3 hours.

## Goal

Build a demoable MVP app in 3 hours using Codex UI, GitHub, and Vercel.

## Tools

- Codex UI
- GitHub
- Vercel
- Any approved editor, if needed

## Start With Codex

Paste this into Codex:

> Inspect this repo. Tell me what kind of app it is, how it works, and how I could deploy it to Vercel. Do not edit files yet.

## Pick Your MVP Idea

After Codex explains the repo, paste:

> Help me turn this starter into a 3-hour MVP. Ask me for the app idea first, then identify any external platform or API risks. Propose the smallest 4-step implementation plan. Do not edit files yet.

## Implement In Small Steps

Use this pattern:

> Implement step 1 only. Keep the change small. Tell me what changed and what I should test.

Then continue one step at a time:

> Now implement step 2 only. Keep it focused and preserve the app's deployability to Vercel.

## If GitHub Integration Is Blocked

If Codex cannot directly access or edit your GitHub repo, ask for manual instructions:

> GitHub integration is blocked. Give me full replacement contents for each file that needs to change, and tell me exactly where each file belongs.

## Deploy To Vercel

Ask Codex:

> Check whether this app is ready for Vercel deployment. Identify any blockers and suggest the smallest fix.

For this static starter app, Vercel settings should usually be:

- Framework Preset: Other
- Build Command: npm run build
- Output Directory: .

## MVP Rules

- Build the smallest demoable version first.
- Use mock data when real APIs are blocked or slow.
- Avoid scraping websites or private platform data.
- Add one feature at a time.
- Review Codex changes before deploying.
- Keep the app deployable throughout the hackathon.

## Example Starting App

The included app is a mock neighborhood keyword alert tool. It scans sample posts for a keyword, highlights matches, and shows an alert when a simulated new post matches.

It does not connect to Nextdoor or scrape any social platform. It is intentionally mock-data-first so you can focus on the MVP workflow.
