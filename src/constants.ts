import { Work, Founder, GameJamEvent, StudioTransmission } from "./types";

// ─── Studio Integrations & Config ─────────────────────────────────────────────
export const DISCORD_INVITE_URL = "https://discord.gg/N4w7gGfdq";
export const WHATSAPP_GROUP_INVITE_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "https://chat.whatsapp.com/invite/temp-outergazers-siet-jam";

// Google Apps Script Web App URL for Sheets logging
export const GOOGLE_SHEET_SCRIPT_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "";

// Studio Contact & Comms
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "connect@outergazer.in";
export const FORMSUBMIT_URL =
  process.env.NEXT_PUBLIC_FORMSUBMIT_URL || `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

// UPI Payment Configuration
export const UPI_PAYMENT_CONFIG = {
  upiId: process.env.NEXT_PUBLIC_UPI_ID || "outergazers@oksbi",
  payeeName: process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || "OuterGazers Studio",
  accountNote: "SIET XR Lab Game Jam Entry",
};

// ─── Studio Events (Managed in src/data/events.ts) ───────────────────────────
export {
  FLAGSHIP_GAME_JAM,
  EVENTS_DATA,
  type EventItem,
  getAllEvents,
  getActiveEvent,
  getEventBySlug,
} from "./data/events";

// ─── Studio Transmissions & News (Managed in src/data/news.ts) ────────────────
export {
  STUDIO_TRANSMISSIONS,
  NEWS_DATA,
  NEWS_TICKER,
  type NewsItem,
  getAllNews,
  getPublishedNews,
  getNewsBySlug,
} from "./data/news";

// ─── Studio Works & Projects (Managed in src/data/works.ts) ───────────────────
export { WORKS_DATA, FEATURED_WORKS, type WorkItem } from "./data/works";

// ─── Existing Studio Data ─────────────────────────────────────────────────────
export const WORKS: Work[] = [
  {
    id: "work-1",
    title: "Project Alpha",
    slug: "project-alpha",
    description: "An innovative AR experience.",
    sector: "AR",
    coverImageUrl: null,
    videoUrl: null,
    isPublished: true,
  },
  {
    id: "work-2",
    title: "Virtual Realm",
    slug: "virtual-realm",
    description: "Immersive VR environment for Quest.",
    sector: "VR_QUEST",
    coverImageUrl: null,
    videoUrl: null,
    isPublished: true,
  },
];

export const FOUNDERS: Founder[] = [
  {
    id: "p1",
    name: "Siddharth T",
    role: "Gameplay Programmer | Technical Artist",
    domain: "Game AI, Physics, Tooling & Shader Work",
    qualification: "B.Tech (Artificial Intelligence & Machine Learning)",
    cvUrl: null,
    portfolioUrl: "https://sudosidd.dev",
    profilePhotoUrl: "/images/base1.jpg",
  },
  {
    id: "p2",
    name: "Pranavan K R",
    role: "Environment / 3D Artist",
    domain: "Environment Art & Real-Time 3D Pipeline",
    qualification: "BE Mechanical Engineering",
    cvUrl: null,
    portfolioUrl: "https://ArtStation.com/pranav016",
    profilePhotoUrl: "/images/pranav.jpg",
  },
  {
    id: "p3",
    name: "Raghul PK",
    role: "Technical Artist & Gameplay Programmer",
    domain: "VR/MR Development, Game Mechanics, Technical Art",
    qualification: "B.Tech (Artificial Intelligence and Machine Learning)",
    cvUrl: null,
    portfolioUrl: "https://raghul-gem.netlify.app",
    profilePhotoUrl: "/images/raghul.jpg",
  },
];
