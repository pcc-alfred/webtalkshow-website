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

## Episode Sync Shortcut

If you say **"check for new episodes"**, I will do this:

1. Fetch the latest videos from the playlist URL:
   `https://www.youtube.com/playlist?list=PL1CI93sNrODNNJppF8HFcDKDHQVHLHN8v`
2. Compare against existing `src/content/episodes/*.md` by YouTube video id.
3. Add only episodes with a publish date newer than the latest episode already on the site (so we only append to the end).
4. Add them automatically with the normalized Ian Cook style (richer always):
   - Full frontmatter (`number`, `title`, `description`, `date`, `duration`, `hosts`, optional `guests`, `topics`, `youtubeUrl`)
   - Show Notes, Topics Covered, and Links Mentioned sections
   - incremented episode number sequence

Run command:

```bash
npm run sync:episodes
```

Add `--dry-run` to preview without writing files.
Use `--all` to bypass the "after latest" date check (legacy behavior).

## Workflow

To keep the website updated:
- Run `npm run sync:episodes` when new episodes are posted.
- Run `npm run build` before deploy to refresh Pagefind index.
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

