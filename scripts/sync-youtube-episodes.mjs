#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const episodesDir = path.join(process.cwd(), 'src', 'content', 'episodes');
const defaultPlaylistUrl =
  'https://www.youtube.com/playlist?list=PL1CI93sNrODNNJppF8HFcDKDHQVHLHN8v';

const args = process.argv.slice(2);
const playlistArgIndex = args.findIndex((arg) => arg === '--playlist');
const playlistUrl = playlistArgIndex >= 0 ? args[playlistArgIndex + 1] : process.env.YOUTUBE_PLAYLIST_URL || defaultPlaylistUrl;
const dryRun = args.includes('--dry-run');
const forceAll = args.includes('--all');

function decodeEntities(input = '') {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#x27;/g, "'");
}

function getEpisodeNumberFromFilename(name) {
  const match = name.match(/^(\d+)-/);
  return match ? Number(match[1]) : null;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[\"'`]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90);
}

function parseDurationSeconds(input = '') {
  if (!input) return null;
  const sec = Number(input);
  if (!Number.isFinite(sec) || sec <= 0) return null;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m)}:${String(s).padStart(2, '0')}`;
}

function sanitizeFrontmatterText(value = '') {
  return String(value).replace(/\"/g, '\\\"').replace(/\n/g, ' ').trim();
}

function parsePlaylistId(input) {
  const match = input.match(/[?&]list=([^&]+)/);
  return match ? match[1] : input;
}

function parseFrontmatterDateFromContent(content = '') {
  const dateMatch = content.match(/^date:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/m);
  if (!dateMatch?.[1]) return null;
  const parsed = new Date(`${dateMatch[1]}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function readExistingEpisodeState() {
  const files = await fs.readdir(episodesDir);
  let maxNumber = 0;
  let latestDate = null;
  let latestVideoId = null;
  const byId = new Set();

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const fullPath = path.join(episodesDir, file);
    const full = await fs.readFile(fullPath, 'utf8');

    const n = getEpisodeNumberFromFilename(file);
    if (n && n > maxNumber) {
      maxNumber = n;
    }

    const date = parseFrontmatterDateFromContent(full);
    if (date && (!latestDate || date > latestDate)) {
      latestDate = date;
    }

    const youtubeLineMatch = full.match(/^youtubeUrl:\s*['"]?([^\s'\"]+)/im);
    if (youtubeLineMatch?.[1]) {
      const url = youtubeLineMatch[1];
      const videoIdMatch = url.match(/[?&]v=([^&]+)/);
      if (videoIdMatch?.[1]) {
        byId.add(videoIdMatch[1]);
        if (n === maxNumber) {
          latestVideoId = videoIdMatch[1];
        }
      }
    }
  }

  return { byId, maxNumber, latestDate, latestVideoId };
}

function parseAtomFeed(feedText) {
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  const entries = [];
  const playlistTitle = /<title>(.*?)<\/title>/m.exec(feedText)?.[1] || '';
  let entryMatch;

  while ((entryMatch = entryRegex.exec(feedText)) !== null) {
    const entry = entryMatch[1];
    const title = decodeEntities((/<title>([\s\S]*?)<\/title>/m.exec(entry)?.[1] || '').trim());
    const videoId = /<yt:videoId>([\w-]+)<\/yt:videoId>/m.exec(entry)?.[1];
    const pubDateRaw = /<published>([\dT:\-.+:Z]+)<\/published>/m.exec(entry)?.[1];
    const pubDate = pubDateRaw ? pubDateRaw.slice(0, 10) : new Date().toISOString().slice(0, 10);
    const desc = decodeEntities((/<media:description>([\s\S]*?)<\/media:description>/m.exec(entry)?.[1] || '').replace(/\s+/g, ' ').trim());
    const durationSec = /<yt:duration seconds=\"([\d]+)\"\/>/m.exec(entry)?.[1];
    const link = /<link[^>]*href=\"([^\"]+)\"[^>]*rel=\"alternate\"[^>]*/m.exec(entry)?.[1];

    if (!videoId || !title) continue;

    entries.push({
      videoId,
      title,
      published: pubDate,
      description: desc || 'Episode transcript and notes added in the website. Update as needed.',
      duration: parseDurationSeconds(durationSec),
      youtubeUrl: link || `https://www.youtube.com/watch?v=${videoId}`,
      publishedAt: new Date(`${pubDate}T00:00:00Z`),
    });
  }

  return { playlistTitle: decodeEntities(playlistTitle), entries };
}

function buildFilename(number, title) {
  const slug = slugify(title);
  return `${String(number).padStart(3, '0')}-${slug}.md`;
}

function extractUrls(text = '') {
  const matches = text.match(/https?:\/\/[^\s)\]]+/g) || [];
  return [...new Set(matches.map((u) => u.replace(/[.,]$/, '')))];
}

function extractBulletLines(text = '') {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^[-•]\s+/.test(l))
    .map((l) => l.replace(/^[-•]\s+/, '').trim())
    .filter(Boolean);
}

function compactSentence(input = '', maxLen = 180) {
  const clean = String(input).replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  const clipped = clean.slice(0, maxLen);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${(lastSpace > 40 ? clipped.slice(0, lastSpace) : clipped).trim()}…`;
}

function makeShortDescription(full = '') {
  const normalized = String(full).replace(/\s+/g, ' ').trim();
  if (!normalized) return 'New episode from The Web Talk Show.';
  const sentences = normalized.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length === 0) return compactSentence(normalized, 180);
  const one = compactSentence(sentences[0], 180);
  return one;
}

function compactTopic(topic = '') {
  let t = String(topic).replace(/\s+/g, ' ').trim();
  t = t
    .replace(/^why\s+/i, '')
    .replace(/^how\s+/i, '')
    .replace(/^what\s+/i, '')
    .replace(/^the\s+/i, '');
  return compactSentence(t, 58);
}

function cleanGuestName(raw = '') {
  let name = String(raw)
    .replace(/^(the\s+)/i, '')
    .replace(/\b(founder|ceo|co-founder|host|svp|vp|director|head)\b.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  // remove trailing punctuation
  name = name.replace(/[.,:;\-]+$/g, '').trim();

  // keep up to first 4 tokens for stability if description is noisy
  const parts = name.split(' ').filter(Boolean);
  if (parts.length > 4) name = parts.slice(0, 4).join(' ');

  return name;
}

function inferGuest(description = '') {
  const patterns = [
    /sits down with\s+([^\n]+)/i,
    /joined by\s+([^\n]+)/i,
    /talks with\s+([^\n]+)/i,
    /conversation with\s+([^\n]+)/i,
    /with\s+([^\n]+?),\s+founder/i,
  ];

  for (const p of patterns) {
    const m = description.match(p);
    if (m?.[1]) {
      const candidate = cleanGuestName(m[1]);
      if (candidate && !/armando/i.test(candidate)) return candidate;
    }
  }

  return null;
}

function buildFrontmatter({ number, title, description, date, duration, youtubeUrl, playlistUrl }) {
  const d = duration || '00:00';
  const shortDescription = sanitizeFrontmatterText(makeShortDescription(description));
  const cleanDescription = sanitizeFrontmatterText(description);
  const bullets = extractBulletLines(description);
  const urls = extractUrls(description);
  const guest = inferGuest(description);

  const compactTopics = bullets.length > 0
    ? bullets.slice(0, 5).map((b) => compactTopic(b)).filter(Boolean)
    : [];

  const topicBullets = bullets.length > 0
    ? bullets.slice(0, 6).map((b) => `- ${sanitizeFrontmatterText(b)}`).join('\n')
    : '- The Web Talk Show';

  const guestBlock = guest
    ? `guests:\n  - ${sanitizeFrontmatterText(guest)}\n`
    : '';

  const topicsBlock = compactTopics.length > 0
    ? compactTopics.map((b) => `  - ${sanitizeFrontmatterText(b)}`).join('\n')
    : '  - The Web Talk Show';

  const linksBlock = [...new Set([playlistUrl, ...urls])]
    .map((u) => `- ${u}`)
    .join('\n');

  return `---
number: ${number}
title: "${sanitizeFrontmatterText(title)}"
description: "${shortDescription}"
date: ${date}
duration: "${d}"
hosts:
  - Armando
${guestBlock}topics:
${topicsBlock}
# Audio sources
youtubeUrl: ${youtubeUrl}
featured: false
---

## Show Notes

${cleanDescription}

## Topics Covered

${topicBullets}

## Links Mentioned

${linksBlock}
`;
}

async function main() {
  if (!playlistUrl || !playlistUrl.startsWith('http')) {
    throw new Error('No valid playlist URL provided. Use --playlist <url> or set YOUTUBE_PLAYLIST_URL.');
  }

  const playlistId = parsePlaylistId(playlistUrl);
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`;
  const playlistResponse = await fetch(rssUrl);
  if (!playlistResponse.ok) {
    throw new Error(`Failed to fetch playlist RSS (${playlistResponse.status} ${playlistResponse.statusText})`);
  }

  const feedText = await playlistResponse.text();
  const { playlistTitle, entries } = parseAtomFeed(feedText);
  const existing = await readExistingEpisodeState();

  const nextEntries = entries.filter((entry) => {
    if (existing.byId.has(entry.videoId)) {
      return false;
    }

    if (!forceAll && existing.latestDate) {
      const entryDate = entry.publishedAt;
      if (!Number.isNaN(entryDate.getTime()) && entryDate <= existing.latestDate) {
        return false;
      }
    }

    return true;
  });

  if (nextEntries.length === 0) {
    console.log(`No new episodes found for ${playlistTitle || 'playlist'} (after most recent local episode${forceAll ? '' : ' date check'}).`);
    return;
  }

  // Feed is usually newest -> oldest; reverse so we append oldest first.
  const planned = nextEntries.reverse();
  let nextNumber = existing.maxNumber + 1;
  const output = [];

  for (const entry of planned) {
    const file = buildFilename(nextNumber, entry.title);
    const content = buildFrontmatter({
      number: nextNumber,
      title: entry.title,
      description: entry.description,
      date: entry.published,
      duration: entry.duration,
      youtubeUrl: entry.youtubeUrl,
      playlistUrl,
    });

    output.push({ file, title: entry.title, youtubeUrl: entry.youtubeUrl, date: entry.published });

    if (!dryRun) {
      await fs.writeFile(path.join(episodesDir, file), content, 'utf8');
    }

    nextNumber += 1;
  }

  if (dryRun) {
    console.log(`DRY RUN: would add ${output.length} episode(s):`);
  } else {
    console.log(`Added ${output.length} new episode(s) to webtalkshow-website:`);
  }

  for (const item of output) {
    console.log(`- ${item.file} | ${item.youtubeUrl} | ${item.date}`);
  }

  if (forceAll) {
    console.log('Note: --all flag used. Date cutoff skipped.');
  }
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exitCode = 1;
});
