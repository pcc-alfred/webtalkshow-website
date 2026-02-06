# The Web Talk Show Website

Podcast website built with Astro. All content in Markdown, no server required.

## Tech Stack

- **Astro** - Static site generator
- **Tailwind CSS** - Styling
- **Pagefind** - Static search indexing
- **Markdown** - Episode content

## Development

```bash
npm run dev     # Start dev server on port 5175
npm run build   # Build + index for search
npm run preview # Preview production build
```

## Adding Episodes

Create a new markdown file in `src/content/episodes/`:

```markdown
---
number: 4
title: "Episode Title"
description: "Brief description of the episode"
date: 2026-02-01
duration: "1:23:45"
hosts:
  - Armando
guests:
  - Guest Name
topics:
  - Topic 1
  - Topic 2
# Audio sources (all optional)
audioUrl: https://example.com/episode.mp3
spotifyUrl: https://spotify.com/episode/xxx
appleUrl: https://podcasts.apple.com/episode/xxx
youtubeUrl: https://youtube.com/watch?v=xxx
# Optional transcript for search
transcript: |
  Full transcript here...
---

## Show Notes

Your markdown content here...

## Links Mentioned

- [Link 1](https://example.com)

## Timestamps

- 00:00 - Intro
- 05:00 - Topic 1
```

## File Structure

```
src/
├── content/
│   └── episodes/       # Markdown episode files
├── components/
│   ├── AudioPlayer.astro
│   └── EpisodeCard.astro
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── search.astro
│   └── episodes/
│       ├── index.astro
│       └── [...slug].astro
└── styles/
    └── global.css
```

## Search

Pagefind indexes all content at build time. Search works across:
- Episode titles
- Descriptions
- Show notes
- Transcripts (if provided)

Run `npm run build` to update the search index.

## Deployment

Build outputs to `dist/`. Deploy to any static host:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

## Port Assignment

- **5175** - Web Talk Show Website (this project)
- **5174** - Mom's Guide SA
- **5173** - Web Talk Show Video App
