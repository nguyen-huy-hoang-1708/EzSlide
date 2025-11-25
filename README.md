# Slide Studio

Modern Canva-style slide editor built with React, TypeScript, and Vite.

## Features

- Dashboard home with sidebar navigation, shortcut cards (new slide, AI slide, template browser), template strip, and recent-slide grid.
- Curated starter layouts for pitch decks and status reports inside the editor.
- Drag-to-position text blocks, accent shapes, and imagery on a 16:9 canvas.
- Inspector panel with precise controls (position, size, opacity, colors, text copy, corner radius).
- Brand utilities: quick background swatches, stock photo suggestions, duplicate/delete, and bring-to-front actions.
- One-click PNG export powered by `html2canvas`.

## Getting started

```bash
cd canva-clone
npm install
npm run dev
```

The editor runs at http://localhost:5173 by default.

## Shortcuts

- `Delete` / `Backspace`: remove the selected element.
- `⌘/Ctrl + D`: duplicate the selected element.

## Public API contract

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/api/v1/status` | Health check for dashboard. Returns `{ ok: boolean, timestamp }`. |
| `GET` | `/api/v1/user/me` | Authenticated user profile `{ id, name, avatarUrl, isLoggedIn }`. Returns `401` when no token. |
| `GET` | `/api/v1/slides/recent?limit=6` | List of `{ id, title, thumbnailUrl, updatedAt }`. Cache for fast loads. |
| `GET` | `/api/v1/templates?limit=6` | Template thumbnails `{ id, title, category, thumbnailUrl, updatedAt }`. Cache-friendly. |
| `POST` | `/api/v1/shortcuts/launch` | Optional tracking payload `{ shortcut, context }`. |
| `POST` | `/api/v1/uploads` | (Optional) thumbnail upload endpoint. Requires auth + size validation. |

Error contract: `{ message, code }` with HTTP codes `400/401/403/404/500`. Aim for <300 ms latency; add token checks + basic rate limiting on authenticated routes.

## Next ideas

- Resizable handles to scale elements directly on the canvas.
- Multi-select with shift-click and group styling.
- Asset uploads for custom brand kits.

