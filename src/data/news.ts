/**
 * ==============================================================================
 * OUTERGAZERS — NEWS & ANNOUNCEMENTS CONTENT CONFIGURATION
 * ==============================================================================
 *
 * This is the SINGLE file to add, remove, and edit announcements, studio logs,
 * tech deep-dives, and ticker announcements.
 * ==============================================================================
 */

import { StudioTransmission } from "../types";

export interface NewsItem extends StudioTransmission {
  slug?: string;
  content?: string;
  author?: string;
  coverImage?: string;
  isPinned?: boolean;
  relatedEventSlug?: string;
  externalLink?: string;
  published: boolean;
}

export const NEWS_TICKER: string[] = [
  "INTRA-COLLEGE GAME JAM",
  "EXCLUSIVE FOR SIET STUDENTS",
  "100% FREE ENTRY",
  "ZERO REGISTRATION FEE",
  "THEMES: LIMITED SPACE & DEATH IS JUST A BEGINNING",
  "FULL CREATIVE FREEDOM: PICK, COMBINE, OR IGNORE",
  "SUBMISSION DEADLINE: NOV 27, 2026",
  "RESULTS: NOV 30, 2026 (~12:00 PM)",
  "XR LAB · SIET COIMBATORE",
  "QUALIFY FOR INTER-COLLEGE JAM",
  "FREE ENTRY & DISCOUNTS",
  "WINDOWS · WEB · ANDROID",
  "ZIP + README DRIVE SUBMISSION"
];

export const NEWS_DATA: NewsItem[] = [
  {
    id: 1,
    date: "OCT 24, 2026",
    tag: "LIVE EVENT",
    title: "OuterGazers Announces Intra-College GameJam for SIET Students",
    excerpt: "Registration is open & themes are live: 'LIMITED SPACE' and 'DEATH IS JUST A BEGINNING' (pick, combine, or ignore!). Build remotely, get XR Lab mentoring, and qualify for December Inter-College passes.",
    readTime: "2 MIN READ",
    slug: "intracollege-gamejam-announcement",
    relatedEventSlug: "intracollege-gamejam-2026",
    published: true,
  }
];

export const STUDIO_TRANSMISSIONS: StudioTransmission[] = NEWS_DATA;

export function getAllNews(): NewsItem[] {
  return NEWS_DATA;
}

export function getPublishedNews(): NewsItem[] {
  return NEWS_DATA.filter((item) => item.published);
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return NEWS_DATA.find((item) => item.slug === slug);
}
