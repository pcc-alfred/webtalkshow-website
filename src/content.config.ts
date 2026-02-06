import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const episodes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/episodes' }),
  schema: z.object({
    number: z.number(),
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    duration: z.string(), // e.g., "1:23:45"
    hosts: z.array(z.string()).default(['Armando']),
    guests: z.array(z.string()).optional(),
    topics: z.array(z.string()).default([]),
    // Audio sources
    audioUrl: z.string().optional(), // Direct audio URL
    spotifyUrl: z.string().optional(),
    appleUrl: z.string().optional(),
    youtubeUrl: z.string().optional(),
    // Transcript
    transcript: z.string().optional(),
    // Meta
    image: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { episodes };
