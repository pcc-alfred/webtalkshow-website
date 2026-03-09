#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const episodesDir = path.join(process.cwd(), 'src', 'content', 'episodes');
const defaultPlaylistUrl =
  'https://www.youtube.com/playlist?list=PL1CI93sNrODNNJppF8HFcDKDHQVHLHN8v';
const defaultSpotifyShowUrl =
  'https://open.spotify.com/show/00BTCbkMIG7mjeTP9zlsIq';
const defaultAppleShowId = '1822997923';

const args = process.argv.slice(2);
const playlistArgIndex = args.findIndex((arg) => arg === '--playlist');
const spotifyArgIndex = args.findIndex((arg) => arg === '--spotify-show');
const appleArgIndex = args.findIndex((arg) => arg === '--apple-show-id');

const playlistUrl = playlistArgIndex >= 0 ? args[playlistArgIndex + 1] : process.env.YOUTUBE_PLAYLIST_URL || defaultPlaylistUrl;
const spotifyShowUrl = spotifyArgIndex >= 0 ? args[spotifyArgIndex + 1] : process.env.SPOTIFY_SHOW_URL || defaultSpotifyShowUrl;
const appleShowId = appleArgIndex >= 0 ? args[appleArgIndex + 1] : process.env.APPLE_SHOW_ID || defaultAppleShowId;

const dryRun = args.includes('--dry-run');
const forceAll = args.includes('--all');
const execFileAsync = promisify(execFile);

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

function stripHtml(input = '') {
  return decodeEntities(String(input).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function normalizeTitle(input = '') {
  return String(input)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(ep|episode|live|podcast)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getEpisodeNumberFromFilename(name) {
  const match = name.match(/^(\d+)-/);
  return match ? Number(match[1]) : null;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/["'`]/g, '')
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
  return String(value).replace(/"/g, '\\"').replace(/\n/g, ' ').trim();
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
  const byId = new Set();

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const fullPath = path.join(episodesDir, file);
    const full = await fs.readFile(fullPath, 'utf8');

    const n = getEpisodeNumberFromFilename(file);
    if (n && n > maxNumber) maxNumber = n;

    const date = parseFrontmatterDateFromContent(full);
    if (date && (!latestDate || date > latestDate)) latestDate = date;

    const youtubeLineMatch = full.match(/^youtubeUrl:\s*['"]?([^\s'\"]+)/im);
    if (youtubeLineMatch?.[1]) {
      const url = youtubeLineMatch[1];
      const videoIdMatch = url.match(/[?&]v=([^&]+)/);
      if (videoIdMatch?.[1]) byId.add(videoIdMatch[1]);
    }
  }

  return { byId, maxNumber, latestDate };
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
      normalizedTitle: normalizeTitle(title),
      published: pubDate,
      description: desc || 'Episode transcript and notes added in the website. Update as needed.',
      duration: parseDurationSeconds(durationSec),
      youtubeUrl: link || `https://www.youtube.com/watch?v=${videoId}`,
      publishedAt: new Date(`${pubDate}T00:00:00Z`),
    });
  }

  return { playlistTitle: decodeEntities(playlistTitle), entries };
}

async function fetchPlaylistViaYtDlp(playlistUrlInput) {
  const { stdout } = await execFileAsync('yt-dlp', ['--flat-playlist', '--dump-single-json', '--playlist-end', '200', playlistUrlInput], {
    maxBuffer: 120 * 1024 * 1024,
  });
  const json = JSON.parse(stdout);
  const entries = (json.entries || [])
    .filter((e) => e?.id && e?.title)
    .map((e) => {
      const rawDate = String(e.upload_date || '').trim();
      const pubDate = /^\d{8}$/.test(rawDate)
        ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
        : new Date().toISOString().slice(0, 10);

      return {
        videoId: e.id,
        title: e.title,
        normalizedTitle: normalizeTitle(e.title),
        published: pubDate,
        description: stripHtml(e.description || '') || 'Episode transcript and notes added in the website. Update as needed.',
        duration: parseDurationSeconds(e.duration),
        youtubeUrl: e.webpage_url || `https://www.youtube.com/watch?v=${e.id}`,
        publishedAt: new Date(`${pubDate}T00:00:00Z`),
      };
    });

  return {
    playlistTitle: json.title || 'YouTube Playlist',
    entries,
  };
}

async function fetchSpotifyEpisodes(showUrl) {
  if (!showUrl) return [];
  try {
    const res = await fetch(showUrl, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!res.ok) return [];
    const html = await res.text();

    const out = [];
    const regex = /<a href=\"\/episode\/([A-Za-z0-9]+)\"[^>]*>\s*<h4[^>]*>([\s\S]*?)<\/h4>/g;
    let m;
    while ((m = regex.exec(html)) !== null) {
      const id = m[1];
      const title = stripHtml(m[2]);
      if (!id || !title) continue;
      out.push({
        title,
        normalizedTitle: normalizeTitle(title),
        url: `https://open.spotify.com/episode/${id}`,
      });
    }

    // de-dupe by url
    const dedup = new Map();
    for (const item of out) dedup.set(item.url, item);
    return [...dedup.values()];
  } catch {
    return [];
  }
}

async function fetchAppleEpisodes(showId) {
  if (!showId) return [];
  try {
    const lookup = await fetch(`https://itunes.apple.com/lookup?id=${encodeURIComponent(showId)}&entity=podcast`);
    if (!lookup.ok) return [];
    const data = await lookup.json();
    const feedUrl = data?.results?.[0]?.feedUrl;
    if (!feedUrl) return [];

    const feedRes = await fetch(feedUrl);
    if (!feedRes.ok) return [];
    const xml = await feedRes.text();

    const items = [];
    const regex = /<item>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = regex.exec(xml)) !== null) {
      const item = m[1];
      const title = decodeEntities((/<title>([\s\S]*?)<\/title>/m.exec(item)?.[1] || '').trim());
      const link = (/<link>([\s\S]*?)<\/link>/m.exec(item)?.[1] || '').trim();
      const pub = (/<pubDate>([\s\S]*?)<\/pubDate>/m.exec(item)?.[1] || '').trim();
      if (!title || !link) continue;
      const pubDate = pub ? new Date(pub) : null;
      items.push({
        title,
        normalizedTitle: normalizeTitle(title),
        url: link,
        publishedAt: pubDate && !Number.isNaN(pubDate.getTime()) ? pubDate : null,
      });
    }

    return items;
  } catch {
    return [];
  }
}

function findByTitle(target, list = []) {
  if (!target || list.length === 0) return null;

  const exact = list.find((x) => x.normalizedTitle === target.normalizedTitle);
  if (exact) return exact;

  const included = list.find((x) =>
    x.normalizedTitle.includes(target.normalizedTitle) || target.normalizedTitle.includes(x.normalizedTitle),
  );
  if (included) return included;

  return null;
}

function findAppleMatch(target, list = []) {
  if (!target || list.length === 0) return null;

  const titleMatch = findByTitle(target, list);
  if (titleMatch) return titleMatch;

  // fallback by publish date proximity
  if (!target.publishedAt || Number.isNaN(target.publishedAt.getTime())) return null;
  const targetMs = target.publishedAt.getTime();
  const withinTwoDays = list.find((x) => {
    if (!x.publishedAt) return false;
    return Math.abs(x.publishedAt.getTime() - targetMs) <= 2 * 24 * 60 * 60 * 1000;
  });

  return withinTwoDays || null;
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
  return compactSentence(sentences[0], 180);
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
  name = name.replace(/[.,:;\-]+$/g, '').trim();
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

function buildFrontmatter({ number, title, description, date, duration, youtubeUrl, spotifyUrl, appleUrl, playlistUrl }) {
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

  const guestBlock = guest ? `guests:\n  - ${sanitizeFrontmatterText(guest)}\n` : '';
  const topicsBlock = compactTopics.length > 0
    ? compactTopics.map((b) => `  - ${sanitizeFrontmatterText(b)}`).join('\n')
    : '  - The Web Talk Show';

  const sourceLinks = [playlistUrl, ...urls];
  if (spotifyUrl) sourceLinks.push(spotifyUrl);
  if (appleUrl) sourceLinks.push(appleUrl);
  const linksBlock = [...new Set(sourceLinks)].map((u) => `- ${u}`).join('\n');

  const spotifyLine = spotifyUrl ? `spotifyUrl: ${spotifyUrl}\n` : '';
  const appleLine = appleUrl ? `appleUrl: ${appleUrl}\n` : '';

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
${spotifyLine}${appleLine}featured: false
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

  let playlistTitle = 'YouTube Playlist';
  let entries = [];

  const playlistResponse = await fetch(rssUrl);
  if (playlistResponse.ok) {
    const feedText = await playlistResponse.text();
    ({ playlistTitle, entries } = parseAtomFeed(feedText));
  } else {
    console.warn(`Playlist RSS unavailable (${playlistResponse.status}). Falling back to yt-dlp...`);
    ({ playlistTitle, entries } = await fetchPlaylistViaYtDlp(playlistUrl));
  }
  const existing = await readExistingEpisodeState();

  const [spotifyEpisodes, appleEpisodes] = await Promise.all([
    fetchSpotifyEpisodes(spotifyShowUrl),
    fetchAppleEpisodes(appleShowId),
  ]);

  const nextEntries = entries.filter((entry) => {
    if (existing.byId.has(entry.videoId)) return false;
    if (!forceAll && existing.latestDate) {
      const entryDate = entry.publishedAt;
      if (!Number.isNaN(entryDate.getTime()) && entryDate <= existing.latestDate) return false;
    }
    return true;
  });

  if (nextEntries.length === 0) {
    console.log(`No new episodes found for ${playlistTitle || 'playlist'} (after most recent local episode${forceAll ? '' : ' date check'}).`);
    return;
  }

  const planned = nextEntries.reverse();
  let nextNumber = existing.maxNumber + 1;
  const output = [];

  for (const entry of planned) {
    const spotifyMatch = findByTitle(entry, spotifyEpisodes);
    const appleMatch = findAppleMatch(entry, appleEpisodes);

    const file = buildFilename(nextNumber, entry.title);
    const content = buildFrontmatter({
      number: nextNumber,
      title: entry.title,
      description: entry.description,
      date: entry.published,
      duration: entry.duration,
      youtubeUrl: entry.youtubeUrl,
      spotifyUrl: spotifyMatch?.url || null,
      appleUrl: appleMatch?.url || null,
      playlistUrl,
    });

    output.push({
      file,
      title: entry.title,
      youtubeUrl: entry.youtubeUrl,
      spotifyUrl: spotifyMatch?.url || null,
      appleUrl: appleMatch?.url || null,
      date: entry.published,
    });

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
    const spotify = item.spotifyUrl ? ` | spotify: ${item.spotifyUrl}` : ' | spotify: (not matched)';
    const apple = item.appleUrl ? ` | apple: ${item.appleUrl}` : ' | apple: (not matched)';
    console.log(`- ${item.file} | ${item.youtubeUrl}${spotify}${apple} | ${item.date}`);
  }

  if (forceAll) {
    console.log('Note: --all flag used. Date cutoff skipped.');
  }

  if (spotifyEpisodes.length === 0) {
    console.log('Warning: Spotify episode list unavailable.');
  }
  if (appleEpisodes.length === 0) {
    console.log('Warning: Apple episode list unavailable.');
  }
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exitCode = 1;
});
