# Shreneek Desai Portfolio

A responsive personal portfolio built with plain HTML, CSS, and vanilla JavaScript. It has no framework, package manager, or build step, so `index.html` can be opened directly in a browser.

## Run locally

1. Double-click `index.html`, or right-click it and choose your browser.
2. For a local server (optional), run `python3 -m http.server` from this folder and open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a GitHub repository and upload the contents of this folder.
2. In the repository, open **Settings → Pages**.
3. Select **Deploy from a branch**, choose the default branch and `/ (root)`, then save.
4. Open the GitHub Pages URL shown by GitHub.

## Links

All certificate, CodeChef, LeetCode, project, email, LinkedIn, and GitHub links are filled in. External links open in a new tab with `noopener noreferrer` protection.

## Auto-updating problem counts

GitHub Actions runs `scripts/update-stats.js` daily and stores the latest good CodeChef and LeetCode counts in `data/stats.json`.
The browser reads that shared JSON file and updates both Home and Profile counters, with a local fallback for direct `file://` opening.
The LeetCode difficulty breakdown and last-updated date are shown when live stats load successfully.

To enable it on GitHub, go to **Settings → Actions → General → Workflow permissions** and select **Read and write permissions**.

To run it manually, open the **Actions** tab, choose **Update stats**, and select **Run workflow**.

CodeChef is scraped because it has no official API. If CodeChef changes its page, the count stays at the last good value.
