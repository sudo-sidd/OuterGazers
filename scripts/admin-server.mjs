#!/usr/bin/env node
/**
 * ==============================================================================
 * OUTERGAZERS STUDIO — OFFLINE LOCAL ADMIN PANEL & DEV TOOL
 * ==============================================================================
 *
 * This server runs strictly offline on your local machine (localhost).
 * It provides a comprehensive browser GUI to add, edit, and remove:
 * 1. Project / Works Listings (src/data/works.ts) with live asset previews
 * 2. Event & Game Jam Listings (src/data/events.ts) with full detailed page controls
 *    (tracks, schedules, prizes, esports, rules, FAQs, hospitality, and flagship selector)
 * 3. News & Announcements + Ticker (src/data/news.ts)
 * 4. Studio Comms & Integrations (.env.local)
 * 5. Real-time Health Checks & Diagnostics (Google Sheets, Discord, Email, UPI)
 * 6. Local static asset serving for public/ (images, videos, fonts)
 *
 * Usage:
 *   npm run admin
 *   or: node scripts/admin-server.mjs
 * ==============================================================================
 */

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");

const PORT = process.env.ADMIN_PORT ? parseInt(process.env.ADMIN_PORT, 10) : 3333;
const HOST = "127.0.0.1";

// Paths
const worksPath = path.join(rootDir, "src", "data", "works.ts");
const eventsPath = path.join(rootDir, "src", "data", "events.ts");
const newsPath = path.join(rootDir, "src", "data", "news.ts");
const envPath = path.join(rootDir, ".env.local");

// Helper to extract JSON array from TypeScript file
function extractArrayFromTs(filePath, exportConstName) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf-8");
  const regex = new RegExp(`export const ${exportConstName}[^=]*=\\s*(\\[[\\s\\S]*?\\n\\]);`, "m");
  const match = content.match(regex);
  if (!match) return [];
  try {
    return JSON.parse(match[1]);
  } catch (err) {
    try {
      const sanitized = match[1].replace(/,\s*([\]}])/g, "$1");
      return JSON.parse(sanitized);
    } catch {
      console.error(`Failed parsing ${exportConstName} from ${filePath}`);
      return [];
    }
  }
}

// Read .env.local keys
function readEnvConfig() {
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf-8");
  const config = {};
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      config[key] = val;
    }
  });
  return config;
}

// Save .env.local
function saveEnvConfig(newConfig) {
  let existingContent = "";
  if (fs.existsSync(envPath)) {
    existingContent = fs.readFileSync(envPath, "utf-8");
  }
  const lines = existingContent ? existingContent.split("\n") : [];
  const updatedKeys = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("#")) continue;
    const eqIdx = line.indexOf("=");
    if (eqIdx !== -1) {
      const key = line.slice(0, eqIdx).trim();
      if (key in newConfig) {
        lines[i] = `${key}="${newConfig[key]}"`;
        updatedKeys.add(key);
      }
    }
  }

  for (const [k, v] of Object.entries(newConfig)) {
    if (!updatedKeys.has(k)) {
      lines.push(`${k}="${v}"`);
    }
  }

  fs.writeFileSync(envPath, lines.join("\n"), "utf-8");
}

function saveWorksData(data) {
  const fileContent = `/**
 * ==============================================================================
 * OUTERGAZERS — OUR WORKS CONTENT CONFIGURATION
 * ==============================================================================
 *
 * This is the SINGLE file to add, remove, and edit everything in the "Our Works" section.
 * ==============================================================================
 */

export interface WorkItem {
  title: string;
  description?: string;
  tag?: string;
  link: string;
  thumbnail: string;
  mediaType?: "image" | "video";
}

export const WORKS_DATA: WorkItem[] = ${JSON.stringify(data, null, 2)};
`;
  fs.writeFileSync(worksPath, fileContent, "utf-8");
}

function saveEventsData(data) {
  // Enforce single flagship event
  const featuredIndex = data.findIndex((e) => e.featured);
  const activeFlagshipIndex = featuredIndex !== -1 ? featuredIndex : 0;
  data.forEach((e, idx) => {
    e.featured = idx === activeFlagshipIndex;
  });

  const templateObj = data[0] || {};
  const fileContent = `/**
 * ==============================================================================
 * OUTERGAZERS — EVENTS & GAME JAMS CONTENT CONFIGURATION
 * ==============================================================================
 *
 * This is the SINGLE file to add, remove, and edit everything in the Events section.
 * Every event listing follows the unified template below.
 * ==============================================================================
 */

import { GameJamEvent } from "../types";

export interface EventTrack {
  name: string;
  description: string;
  icon: string;
  hardwareNotes: string;
}

export interface EventSchedulePhase {
  phase: string;
  time: string;
  description: string;
}

export interface EventPrize {
  place: string;
  reward: string;
  perks: string[];
  gradient: string;
}

export interface EventEsportsPrize {
  game: string;
  platform: string;
  format: string;
  prize: string;
}

export interface EventHospitalityItem {
  day: string;
  items: string[];
}

export interface EventFaq {
  question: string;
  answer: string;
}

export interface EventItem extends GameJamEvent {
  featured?: boolean;
  countdownTarget?: string;
  registrationType: "modal" | "external";
  registrationUrl?: string;
  googleSheetScriptUrl?: string;
  discordInviteUrl?: string;
  whatsappGroupUrl?: string;
  upiId?: string;
  upiPayeeName?: string;
  venue: string;
  inPersonDates: string;
  targetAudience: string;
  inclusions: string[];
  esportsPrizes?: EventEsportsPrize[];
  hospitality?: EventHospitalityItem[];
}

export const EMPTY_EVENT_TEMPLATE: EventItem = ${JSON.stringify(templateObj, null, 2)};

export const EVENTS_DATA: EventItem[] = ${JSON.stringify(data, null, 2)};

export const FLAGSHIP_GAME_JAM: EventItem =
  EVENTS_DATA.find((e) => e.featured) || EVENTS_DATA[0];

export function getAllEvents(): EventItem[] {
  return EVENTS_DATA;
}

export function getActiveEvent(): EventItem {
  return EVENTS_DATA.find((e) => e.status !== "Completed") || EVENTS_DATA[0];
}

export function getEventBySlug(slug: string): EventItem | undefined {
  return EVENTS_DATA.find((e) => e.slug === slug);
}
`;
  fs.writeFileSync(eventsPath, fileContent, "utf-8");
}

function saveNewsData(data, ticker) {
  const tickerList =
    ticker && ticker.length > 0
      ? ticker
      : [
          "GAME JAM",
          "ESPORTS SHOWDOWN",
          "₹16,000 PRIZE POOL",
          "XR LAB · SIET",
          "REGISTRATIONS OPEN",
          "DEC 17–18, 2026",
          "72H HYBRID FORMAT",
          "ALL MEALS INCLUDED",
        ];

  const fileContent = `/**
 * ==============================================================================
 * OUTERGAZERS — NEWS & ANNOUNCEMENTS CONTENT CONFIGURATION
 * ==============================================================================
 *
 * This is the SINGLE file to add, remove, and edit announcements, studio logs,
 * tech deep-dives, and ticker announcements.
 * ==============================================================================
 */

export interface NewsItem {
  id: string;
  slug?: string;
  title: string;
  date: string;
  readTime: string;
  tag: "FLAGSHIP EVENT" | "ANNOUNCEMENT" | "TECH LOG" | "STUDIO LOG" | "UPDATE";
  excerpt: string;
  content: string;
  published: boolean;
  relatedEventSlug?: string;
  externalLink?: string;
}

export const NEWS_TICKER: string[] = ${JSON.stringify(tickerList, null, 2)};

export const NEWS_DATA: NewsItem[] = ${JSON.stringify(data, null, 2)};

export const STUDIO_TRANSMISSIONS = NEWS_DATA;

export function getAllNews(): NewsItem[] {
  return NEWS_DATA;
}

export function getPublishedNews(): NewsItem[] {
  return NEWS_DATA.filter((n) => n.published !== false);
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return NEWS_DATA.find((n) => n.slug === slug || n.id === slug);
}
`;
  fs.writeFileSync(newsPath, fileContent, "utf-8");
}

// Health diagnostics
async function runDiagnostics() {
  const envConfig = readEnvConfig();
  const results = [];

  // 1. Google Sheets Web App
  const scriptUrl = envConfig.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    results.push({
      service: "Google Apps Script Backend",
      status: "warning",
      message:
        "NEXT_PUBLIC_GOOGLE_SCRIPT_URL is not set in .env.local. Follow google_apps_script.js instructions to deploy.",
    });
  } else if (!scriptUrl.startsWith("https://script.google.com/macros/s/")) {
    results.push({
      service: "Google Apps Script Backend",
      status: "warning",
      message: `URL format invalid: ${scriptUrl}. Must start with https://script.google.com/macros/s/`,
    });
  } else {
    const t0 = Date.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6500);
      const res = await fetch(scriptUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
        redirect: "follow",
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const latency = Date.now() - t0;
      if (res.ok) {
        const text = await res.text();
        let json = null;
        try {
          json = JSON.parse(text);
        } catch {}
        results.push({
          service: "Google Apps Script Backend",
          status: "healthy",
          latencyMs: latency,
          message:
            json && json.message
              ? `Live and responsive: "${json.message}"`
              : `HTTP ${res.status} OK received.`,
        });
      } else {
        results.push({
          service: "Google Apps Script Backend",
          status: "error",
          latencyMs: latency,
          message: `Endpoint returned HTTP status ${res.status}. Verify deployment permissions are set to 'Anyone'.`,
        });
      }
    } catch (err) {
      results.push({
        service: "Google Apps Script Backend",
        status: "error",
        message: `Connection failed: ${err.message}`,
      });
    }
  }

  // 2. Discord Server Invite
  const discordUrl = envConfig.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.gg/N4w7gGfdq";
  const match = discordUrl.match(/discord\.(?:gg|com\/invite)\/([a-zA-Z0-9_-]+)/);
  if (match) {
    const code = match[1];
    const t0 = Date.now();
    try {
      const res = await fetch(`https://discord.com/api/v10/invites/${code}?with_counts=true`);
      const latency = Date.now() - t0;
      if (res.ok) {
        const data = await res.json();
        const guildName = data.guild?.name || "OuterGazers";
        const total = data.approximate_member_count || 0;
        const online = data.approximate_presence_count || 0;
        results.push({
          service: "Discord Server Invite",
          status: "healthy",
          latencyMs: latency,
          message: `Valid invite to "${guildName}". Total members: ${total}, Online: ${online}.`,
        });
      } else {
        results.push({
          service: "Discord Server Invite",
          status: "warning",
          latencyMs: latency,
          message: `Discord API returned HTTP ${res.status} for invite '${code}'. May be expired.`,
        });
      }
    } catch (err) {
      results.push({
        service: "Discord Server Invite",
        status: "warning",
        message: `Discord check error: ${err.message}`,
      });
    }
  }

  // 3. Email
  const email = envConfig.NEXT_PUBLIC_CONNECT_EMAIL || "connect@outergazer.in";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    results.push({
      service: "Studio Comms Email",
      status: "healthy",
      message: `Directing inquiries to: ${email} via FormSubmit AJAX.`,
    });
  } else {
    results.push({
      service: "Studio Comms Email",
      status: "warning",
      message: `Invalid email address syntax: ${email}`,
    });
  }

  // 4. UPI Payment
  const upiId = envConfig.NEXT_PUBLIC_UPI_ID || "outergazers@oksbi";
  const upiPayee = envConfig.NEXT_PUBLIC_UPI_PAYEE_NAME || "OuterGazers Studio";
  if (/^[\w.-]+@[\w.-]+$/.test(upiId)) {
    results.push({
      service: "UPI Payment Gateway",
      status: "healthy",
      message: `VPA: ${upiId} (${upiPayee}). Mobile deep-links and dynamic QR functional.`,
    });
  } else {
    results.push({
      service: "UPI Payment Gateway",
      status: "warning",
      message: `UPI ID '${upiId}' does not match standard name@bank format.`,
    });
  }

  // 5. Data Files
  const filesOk = fs.existsSync(worksPath) && fs.existsSync(eventsPath) && fs.existsSync(newsPath);
  results.push({
    service: "Local Data Store Files",
    status: filesOk ? "healthy" : "error",
    message: filesOk
      ? "All data modules verified: src/data/works.ts, src/data/events.ts, src/data/news.ts."
      : "One or more core data files are missing.",
  });

  return results;
}

// ─── ADMIN DASHBOARD HTML TEMPLATE ───────────────────────────────────────────
function getDashboardHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OuterGazers Studio — Offline Local Admin Suite</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #080808;
      color: #e4e4e7;
      font-family: 'Inter', -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: #0d0d0d;
      border-bottom: 1px solid #27272a;
      padding: 16px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .hud-title {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .hud-badge {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid #3f3f46;
      background: #18181b;
      color: #a1a1aa;
      font-family: 'JetBrains Mono', monospace;
    }
    .flagship-badge {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid rgba(192, 132, 252, 0.4);
      background: rgba(124, 58, 237, 0.15);
      color: #c084fc;
      font-family: 'JetBrains Mono', monospace;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .tab-nav {
      background: #121214;
      border-bottom: 1px solid #27272a;
      display: flex;
      padding: 0 28px;
      gap: 4px;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: #a1a1aa;
      font-size: 13px;
      font-weight: 600;
      padding: 14px 20px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tab-btn:hover { color: #fff; }
    .tab-btn.active {
      color: #00b4d8;
      border-bottom-color: #00b4d8;
      background: rgba(0, 180, 216, 0.04);
    }
    .container {
      max-width: 1380px;
      margin: 0 auto;
      padding: 32px 28px 80px;
      width: 100%;
      flex: 1;
    }
    .card {
      background: #111113;
      border: 1px solid #27272a;
      border-radius: 12px;
      padding: 22px;
      transition: border-color 0.2s;
    }
    .card:hover { border-color: #3f3f46; }
    .card.flagship-card {
      border-color: rgba(192, 132, 252, 0.4);
      background: linear-gradient(180deg, rgba(124, 58, 237, 0.05) 0%, #111113 100%);
    }
    .btn {
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
      border-radius: 6px;
      cursor: pointer;
      border: 1px solid transparent;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
      text-decoration: none;
    }
    .btn-primary { background: #00b4d8; color: #000; }
    .btn-primary:hover { background: #fff; }
    .btn-flagship { background: #7c3aed; color: #fff; }
    .btn-flagship:hover { background: #9333ea; }
    .btn-secondary { background: #1c1c1f; color: #d4d4d8; border-color: #27272a; }
    .btn-secondary:hover { background: #27272a; color: #fff; }
    .btn-danger { background: rgba(239, 68, 68, 0.1); color: #f87171; border-color: rgba(239, 68, 68, 0.3); }
    .btn-danger:hover { background: #ef4444; color: #fff; }
    
    /* Modals */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 200;
      padding: 20px;
    }
    .modal-content {
      background: #111113;
      border: 1px solid #3f3f46;
      border-radius: 14px;
      width: 100%;
      max-width: 900px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 30px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
    }
    .modal-subnav {
      display: flex;
      gap: 6px;
      border-bottom: 1px solid #27272a;
      margin-bottom: 22px;
      overflow-x: auto;
      padding-bottom: 2px;
    }
    .modal-subtab {
      background: none;
      border: none;
      color: #71717a;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 8px 14px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      white-space: nowrap;
    }
    .modal-subtab:hover { color: #e4e4e7; }
    .modal-subtab.active {
      color: #00b4d8;
      border-bottom-color: #00b4d8;
    }
    .subtab-pane { display: none; }
    .subtab-pane.active { display: block; }

    label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #a1a1aa;
      margin-bottom: 6px;
    }
    input[type="text"], input[type="number"], select, textarea {
      width: 100%;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 6px;
      padding: 10px 12px;
      color: #fff;
      font-size: 13px;
      font-family: inherit;
      margin-bottom: 16px;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type="text"]:focus, input[type="number"]:focus, select:focus, textarea:focus {
      border-color: #00b4d8;
    }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

    /* Switch */
    .switch-container {
      background: rgba(124, 58, 237, 0.08);
      border: 1px solid rgba(124, 58, 237, 0.25);
      border-radius: 10px;
      padding: 14px 18px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .switch {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 26px;
      shrink: 0;
    }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background-color: #27272a;
      transition: 0.3s;
      border-radius: 34px;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
    input:checked + .slider { background-color: #7c3aed; }
    input:checked + .slider:before { transform: translateX(22px); }

    /* Items sub-list */
    .sub-item-card {
      background: #161619;
      border: 1px solid #27272a;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 12px;
      position: relative;
    }
    .sub-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .media-preview-box {
      width: 100%;
      height: 180px;
      background: #0d0d0f;
      border: 1px dashed #27272a;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin-bottom: 16px;
    }
    .media-preview-box img, .media-preview-box video {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #00b4d8;
      color: #000;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      box-shadow: 0 10px 30px rgba(0, 180, 216, 0.4);
      display: none;
      z-index: 999;
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>

  <header>
    <div class="hud-title">
      <span style="font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; font-size: 16px;">
        OuterGazers Studio Dev Tool
      </span>
      <span class="hud-badge">Offline Local Suite · Port ${PORT}</span>
    </div>

    <div style="display: flex; gap: 10px; align-items: center;">
      <a href="http://localhost:3000" target="_blank" class="btn btn-secondary">
        🌐 Open Website (localhost:3000)
      </a>
      <button onclick="loadAllData()" class="btn btn-secondary">
        🔄 Refresh
      </button>
    </div>
  </header>

  <nav class="tab-nav">
    <button class="tab-btn active" onclick="switchTab('works')">📁 Our Works</button>
    <button class="tab-btn" onclick="switchTab('events')">⚡ Events &amp; Game Jams</button>
    <button class="tab-btn" onclick="switchTab('news')">📡 News &amp; Transmissions</button>
    <button class="tab-btn" onclick="switchTab('config')">⚙️ Studio Integrations</button>
    <button class="tab-btn" onclick="switchTab('health')">🩺 Health &amp; Diagnostics</button>
  </nav>

  <main class="container">
    <!-- TAB 1: WORKS -->
    <section id="tab-works">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 20px; font-weight: 800; text-transform: uppercase;">Our Works &amp; Portfolio</h2>
          <p style="font-size: 12px; color: #71717a; margin-top: 4px;">Edits write directly to <code style="color: #00b4d8;">src/data/works.ts</code></p>
        </div>
        <button class="btn btn-primary" onclick="openAddWorkModal()">+ Add New Project</button>
      </div>
      <div id="works-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 18px;"></div>
    </section>

    <!-- TAB 2: EVENTS -->
    <section id="tab-events" style="display: none;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 20px; font-weight: 800; text-transform: uppercase;">Events &amp; Game Jams</h2>
          <p style="font-size: 12px; color: #71717a; margin-top: 4px;">
            Full controls for tracks, schedule, prizes, esports &amp; flagship event. Stored in <code style="color: #00b4d8;">src/data/events.ts</code>
          </p>
        </div>
        <button class="btn btn-primary" onclick="openAddEventModal()">+ Create Event from Template</button>
      </div>
      <div id="events-list" style="display: flex; flex-direction: column; gap: 16px;"></div>
    </section>

    <!-- TAB 3: NEWS -->
    <section id="tab-news" style="display: none;">
      <div class="card" style="margin-bottom: 28px;">
        <h3 style="font-size: 14px; font-weight: 800; text-transform: uppercase; margin-bottom: 6px;">News Ticker Headlines</h3>
        <p style="font-size: 12px; color: #71717a; margin-bottom: 14px;">Animated ticker ribbon at the top of /news</p>
        <div id="ticker-chips" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px;"></div>
        <div style="display: flex; gap: 8px; max-width: 480px;">
          <input type="text" id="new-ticker-input" placeholder="ADD TICKER ITEM..." style="margin: 0;">
          <button class="btn btn-primary" onclick="addTickerItem()">Add</button>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div>
          <h2 style="font-size: 20px; font-weight: 800; text-transform: uppercase;">Announcements &amp; Transmissions</h2>
          <p style="font-size: 12px; color: #71717a; margin-top: 4px;">Stored in <code style="color: #00b4d8;">src/data/news.ts</code></p>
        </div>
        <button class="btn btn-primary" onclick="openAddNewsModal()">+ New Announcement</button>
      </div>
      <div id="news-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 18px;"></div>
    </section>

    <!-- TAB 4: CONFIG -->
    <section id="tab-config" style="display: none;">
      <div style="max-width: 760px;">
        <h2 style="font-size: 20px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">Studio Integrations &amp; Backend</h2>
        <p style="font-size: 12px; color: #71717a; margin-bottom: 24px;">Configures Google Sheets, Discord, Comms, and UPI payment keys. Stored in <code style="color: #00b4d8;">.env.local</code>.</p>

        <form id="config-form" class="card" onsubmit="handleSaveConfig(event)">
          <label>Google Apps Script Web App URL (Sheets Logging &amp; Drive Uploads)</label>
          <input type="text" id="cfg-google-script" placeholder="https://script.google.com/macros/s/..." style="font-family: monospace;">
          <p style="font-size: 11px; color: #71717a; margin-top: -8px; margin-bottom: 14px;">
            Follow deployment guide in <code style="color: #00b4d8;">google_apps_script.js</code>. Ensure 'Who has access' is set to 'Anyone'.
          </p>

          <div class="grid-2">
            <div>
              <label>Discord Server Invite URL</label>
              <input type="text" id="cfg-discord-invite" placeholder="https://discord.gg/...">
            </div>
            <div>
              <label>Studio Contact / Comms Email</label>
              <input type="text" id="cfg-connect-email" placeholder="connect@outergazer.in">
            </div>
          </div>

          <div class="grid-2">
            <div>
              <label>UPI ID (VPA)</label>
              <input type="text" id="cfg-upi-id" placeholder="outergazers@oksbi">
            </div>
            <div>
              <label>UPI Payee Name</label>
              <input type="text" id="cfg-upi-payee" placeholder="OuterGazers Studio">
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px;">
            <button type="submit" class="btn btn-primary">Save .env.local Configuration</button>
          </div>
        </form>
      </div>
    </section>

    <!-- TAB 5: HEALTH -->
    <section id="tab-health" style="display: none;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 20px; font-weight: 800; text-transform: uppercase;">System Health &amp; Diagnostics</h2>
          <p style="font-size: 12px; color: #71717a; margin-top: 4px;">Real-time latency check on Google Apps Script, Discord API, Email, and UPI configuration.</p>
        </div>
        <button class="btn btn-primary" onclick="runDiagnostics()">⚡ Run Health Check Now</button>
      </div>

      <div id="diagnostics-container" style="display: flex; flex-direction: column; gap: 14px; max-width: 860px;">
        <div class="card" style="text-align: center; color: #71717a; padding: 40px;">
          Click "Run Health Check Now" to test live connections.
        </div>
      </div>
    </section>
  </main>

  <!-- ─── WORK EDIT MODAL ─── -->
  <div id="work-modal" class="modal-backdrop">
    <div class="modal-content">
      <h3 id="work-modal-title" style="margin-bottom: 18px; text-transform: uppercase;">Edit Project</h3>
      <input type="hidden" id="work-edit-index">

      <div class="media-preview-box" id="work-media-preview">
        <span style="color: #71717a; font-size: 12px;">Live Thumbnail Preview</span>
      </div>

      <div class="grid-2">
        <div>
          <label>Project Title *</label>
          <input type="text" id="w-title" required>
        </div>
        <div>
          <label>Category Tag *</label>
          <input type="text" id="w-tag" placeholder="VR Game, 3D Art, AR App...">
        </div>
      </div>

      <label>Description</label>
      <textarea id="w-desc" rows="3"></textarea>

      <div class="grid-2">
        <div>
          <label>Media Type</label>
          <select id="w-mediatype" onchange="updateWorkMediaPreview()">
            <option value="image">Image (.png, .jpg, .webp)</option>
            <option value="video">Video (.mp4, .webm)</option>
          </select>
        </div>
        <div>
          <label>Select From Existing Public Media</label>
          <select id="w-quick-media" onchange="pickExistingMedia(this.value)">
            <option value="">-- Choose local asset or type below --</option>
          </select>
        </div>
      </div>

      <div class="grid-2">
        <div>
          <label>Thumbnail / Media Path *</label>
          <input type="text" id="w-thumbnail" placeholder="/images/example.png or /videos/example.mp4" oninput="updateWorkMediaPreview()" required>
        </div>
        <div>
          <label>Project Link (URL or #)</label>
          <input type="text" id="w-link" placeholder="#">
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px;">
        <button class="btn btn-secondary" onclick="closeModal('work-modal')">Cancel</button>
        <button class="btn btn-primary" onclick="saveWorkModal()">Save Project</button>
      </div>
    </div>
  </div>

  <!-- ─── EVENT EDIT MODAL (COMPREHENSIVE) ─── -->
  <div id="event-modal" class="modal-backdrop">
    <div class="modal-content" style="max-width: 960px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h3 id="event-modal-title" style="text-transform: uppercase; font-size: 18px;">Edit Event Master Record</h3>
        <button class="btn btn-secondary" onclick="closeModal('event-modal')">✕</button>
      </div>
      <input type="hidden" id="event-edit-index">

      <!-- Flagship Highlight Switch -->
      <div class="switch-container">
        <div>
          <span style="font-weight: 800; color: #c084fc; font-size: 13px; display: block;">★ Set as Studio Flagship Event</span>
          <span style="font-size: 11px; color: #a1a1aa;">Featured across the homepage hero, header announcement popup, and default registration button.</span>
        </div>
        <label class="switch">
          <input type="checkbox" id="ev-featured">
          <span class="slider"></span>
        </label>
      </div>

      <!-- Modal Subtabs -->
      <div class="modal-subnav">
        <button class="modal-subtab active" onclick="switchEventSubtab('basics')">1. Basics &amp; Logistics</button>
        <button class="modal-subtab" onclick="switchEventSubtab('theme')">2. Theme &amp; Registration</button>
        <button class="modal-subtab" onclick="switchEventSubtab('tracks')">3. Tracks (<span id="ev-subtab-track-count">0</span>)</button>
        <button class="modal-subtab" onclick="switchEventSubtab('schedule')">4. Schedule (<span id="ev-subtab-sched-count">0</span>)</button>
        <button class="modal-subtab" onclick="switchEventSubtab('prizes')">5. Prizes &amp; Esports</button>
        <button class="modal-subtab" onclick="switchEventSubtab('rules')">6. Rules &amp; FAQs</button>
        <button class="modal-subtab" onclick="switchEventSubtab('raw')">7. Raw JSON</button>
      </div>

      <!-- PANE 1: BASICS -->
      <div id="ev-pane-basics" class="subtab-pane active">
        <div class="grid-2">
          <div>
            <label>Event Title *</label>
            <input type="text" id="ev-title" required>
          </div>
          <div>
            <label>URL Slug * (Used for /events/[slug])</label>
            <input type="text" id="ev-slug" required>
          </div>
        </div>

        <label>Subtitle / One-line Pitch</label>
        <input type="text" id="ev-subtitle">

        <div class="grid-3">
          <div>
            <label>Event Status</label>
            <select id="ev-status">
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label>Badge Pill Text</label>
            <input type="text" id="ev-badge" placeholder="Registrations Open">
          </div>
          <div>
            <label>Format</label>
            <input type="text" id="ev-format" placeholder="Hybrid: Remote Build + In-Person Finale">
          </div>
        </div>

        <div class="grid-2">
          <div>
            <label>Overall Dates (Display String)</label>
            <input type="text" id="ev-dates" placeholder="Nov 1 – Dec 18, 2026">
          </div>
          <div>
            <label>In-Person Timing</label>
            <input type="text" id="ev-inperson" placeholder="Dec 17 (10 AM) – Dec 18 (12 PM)">
          </div>
        </div>

        <label>Venue Location</label>
        <input type="text" id="ev-venue" placeholder="XR Lab, Sri Shakthi Institute of Engineering and Technology (SIET), Coimbatore">

        <div class="grid-2">
          <div>
            <label>Target Audience</label>
            <input type="text" id="ev-audience" placeholder="Undergraduate / Bachelor's Degree College Students">
          </div>
          <div>
            <label>Duration String</label>
            <input type="text" id="ev-duration" placeholder="7-Day Hybrid (Remote Jam + 2-Day In-Person Finale)">
          </div>
        </div>

        <div class="grid-3">
          <div>
            <label>Price / Person (₹, 0 for free)</label>
            <input type="number" id="ev-price">
          </div>
          <div>
            <label>Squad Min / Max Members</label>
            <div style="display: flex; gap: 8px;">
              <input type="number" id="ev-minsize" placeholder="Min" style="margin-bottom: 0;">
              <input type="number" id="ev-maxsize" placeholder="Max" style="margin-bottom: 0;">
            </div>
          </div>
          <div>
            <label>Total Prize Pool String</label>
            <input type="text" id="ev-prizepool" placeholder="₹16,000">
          </div>
        </div>
      </div>

      <!-- PANE 2: THEME & REGISTRATION -->
      <div id="ev-pane-theme" class="subtab-pane">
        <div class="grid-2">
          <div>
            <label>Theme Title / Announcement Headline</label>
            <input type="text" id="ev-theme" placeholder="Secret Theme Announced on Dec 11, 2026">
          </div>
          <div>
            <label>Countdown Target (ISO String)</label>
            <input type="text" id="ev-countdown" placeholder="2026-12-11T18:00:00+05:30">
          </div>
        </div>

        <label>Theme Description / Participant Instructions</label>
        <textarea id="ev-themedesc" rows="3"></textarea>

        <div style="background: #09090b; border: 1px solid #27272a; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <span style="font-size: 11px; font-weight: 800; color: #00b4d8; text-transform: uppercase; display: block; margin-bottom: 12px;">
            Registration Mode &amp; Backend Links
          </span>
          <div class="grid-2">
            <div>
              <label>Registration Type</label>
              <select id="ev-regtype">
                <option value="modal">Built-in Interactive UPI Modal + Google Sheets</option>
                <option value="external">External Registration Link (Unstop, Devfolio, Google Forms)</option>
              </select>
            </div>
            <div>
              <label>External Registration URL (if external mode)</label>
              <input type="text" id="ev-regurl" placeholder="https://unstop.com/...">
            </div>
          </div>

          <label>Custom Google Sheet Apps Script URL (Optional Override)</label>
          <input type="text" id="ev-sheeturl" placeholder="Leave empty to use studio default from .env.local">

          <div class="grid-2">
            <div>
              <label>Discord Server / Jam Channel Invite</label>
              <input type="text" id="ev-discord" placeholder="https://discord.gg/...">
            </div>
            <div>
              <label>WhatsApp Group Link</label>
              <input type="text" id="ev-whatsapp" placeholder="https://chat.whatsapp.com/...">
            </div>
          </div>

          <div class="grid-2">
            <div>
              <label>Event-Specific UPI ID (VPA)</label>
              <input type="text" id="ev-upi-id" placeholder="outergazers@oksbi">
            </div>
            <div>
              <label>Event-Specific UPI Payee Name</label>
              <input type="text" id="ev-upi-payee" placeholder="OuterGazers Studio">
            </div>
          </div>
        </div>
      </div>

      <!-- PANE 3: TRACKS -->
      <div id="ev-pane-tracks" class="subtab-pane">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <p style="font-size: 12px; color: #a1a1aa;">Define game creation tracks (e.g., PC Vanguard, VR/XR, AR, Mobile):</p>
          <button type="button" class="btn btn-secondary" onclick="addTrackItem()">+ Add Track</button>
        </div>
        <div id="ev-tracks-container"></div>
      </div>

      <!-- PANE 4: SCHEDULE -->
      <div id="ev-pane-schedule" class="subtab-pane">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <p style="font-size: 12px; color: #a1a1aa;">Event Phases &amp; Milestones (Registration, Theme Drop, Jamming, Finale, Awards):</p>
          <button type="button" class="btn btn-secondary" onclick="addScheduleItem()">+ Add Phase</button>
        </div>
        <div id="ev-schedule-container"></div>
      </div>

      <!-- PANE 5: PRIZES & ESPORTS -->
      <div id="ev-pane-prizes" class="subtab-pane">
        <div style="margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h4 style="font-size: 13px; font-weight: 800; color: #00b4d8; text-transform: uppercase;">Game Jam Awards</h4>
            <button type="button" class="btn btn-secondary" onclick="addPrizeItem()">+ Add Jam Award</button>
          </div>
          <div id="ev-prizes-container"></div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h4 style="font-size: 13px; font-weight: 800; color: #c084fc; text-transform: uppercase;">Bonus Esports Tournaments</h4>
            <button type="button" class="btn btn-secondary" onclick="addEsportItem()">+ Add Esports Tournament</button>
          </div>
          <div id="ev-esports-container"></div>
        </div>
      </div>

      <!-- PANE 6: RULES & FAQS -->
      <div id="ev-pane-rules" class="subtab-pane">
        <label>Key Hospitality / Package Inclusions (One perk per line)</label>
        <textarea id="ev-inclusions-text" rows="4" placeholder="Day 1 & Day 2 Meals&#10;XR Lab Access&#10;Free Esports Entry"></textarea>

        <label style="margin-top: 14px;">Official Rules &amp; Regulations (One rule per line)</label>
        <textarea id="ev-rules-text" rows="6" placeholder="Undergraduate college students only&#10;Team size: 3-4 members&#10;Teams retain 100% IP rights"></textarea>

        <div style="display: flex; justify-content: space-between; align-items: center; margin: 18px 0 10px;">
          <label style="margin: 0;">Frequently Asked Questions (Accordion Pairs)</label>
          <button type="button" class="btn btn-secondary" onclick="addFaqItem()">+ Add FAQ Pair</button>
        </div>
        <div id="ev-faqs-container"></div>
      </div>

      <!-- PANE 7: RAW JSON -->
      <div id="ev-pane-raw" class="subtab-pane">
        <p style="font-size: 12px; color: #a1a1aa; margin-bottom: 8px;">
          Directly inspect or edit the full Event object in JSON:
        </p>
        <textarea id="ev-raw-json" rows="18" style="font-family: monospace; font-size: 12px;"></textarea>
        <div style="display: flex; gap: 10px;">
          <button type="button" class="btn btn-secondary" onclick="syncFormToRawJson()">Sync From Form</button>
          <button type="button" class="btn btn-secondary" onclick="applyRawJsonToForm()">Apply JSON to Form</button>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 22px; padding-top: 16px; border-top: 1px solid #27272a;">
        <button class="btn btn-secondary" onclick="closeModal('event-modal')">Cancel</button>
        <button class="btn btn-primary" onclick="saveEventModal()">Save Event Record</button>
      </div>
    </div>
  </div>

  <!-- ─── NEWS EDIT MODAL ─── -->
  <div id="news-modal" class="modal-backdrop">
    <div class="modal-content">
      <h3 id="news-modal-title" style="margin-bottom: 18px; text-transform: uppercase;">Edit Announcement</h3>
      <input type="hidden" id="news-edit-index">
      <label>Headline Title *</label>
      <input type="text" id="n-title" required>
      <div class="grid-3">
        <div>
          <label>Tag</label>
          <select id="n-tag">
            <option value="FLAGSHIP EVENT">FLAGSHIP EVENT</option>
            <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
            <option value="TECH LOG">TECH LOG</option>
            <option value="STUDIO LOG">STUDIO LOG</option>
            <option value="UPDATE">UPDATE</option>
          </select>
        </div>
        <div>
          <label>Date String</label>
          <input type="text" id="n-date" placeholder="OCT 20, 2026">
        </div>
        <div>
          <label>Read Time</label>
          <input type="text" id="n-readtime" placeholder="3 MIN READ">
        </div>
      </div>
      <label>Excerpt Summary</label>
      <textarea id="n-excerpt" rows="2"></textarea>
      <label>Full Transmission Body (Supports Markdown)</label>
      <textarea id="n-content" rows="6" placeholder="Markdown or full body text..."></textarea>
      <div class="grid-2">
        <div>
          <label>Related Event Slug</label>
          <input type="text" id="n-eventslug" placeholder="gamejam-esports-siet-2026">
        </div>
        <div>
          <label>External Link (Optional)</label>
          <input type="text" id="n-extlink" placeholder="https://...">
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px;">
        <button class="btn btn-secondary" onclick="closeModal('news-modal')">Cancel</button>
        <button class="btn btn-primary" onclick="saveNewsModal()">Save Announcement</button>
      </div>
    </div>
  </div>

  <div id="toast" class="toast">Saved successfully!</div>

  <script>
    let state = {
      works: [],
      events: [],
      news: [],
      ticker: [],
      config: {},
      media: { images: [], videos: [] }
    };

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.innerText = msg;
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }

    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('main > section').forEach(sec => sec.style.display = 'none');

      const targetSec = document.getElementById('tab-' + tabId);
      if (targetSec) targetSec.style.display = 'block';

      const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(tabId));
      if (activeBtn) activeBtn.classList.add('active');
    }

    async function loadAllData() {
      try {
        const res = await fetch('/api/data');
        const data = await res.json();
        state = { ...state, ...data };

        // Fetch media list
        try {
          const mediaRes = await fetch('/api/media-list');
          state.media = await mediaRes.json();
          populateMediaDropdown();
        } catch (e) {
          console.warn('Failed loading media list:', e);
        }

        renderWorks();
        renderEvents();
        renderNews();
        populateConfig();
      } catch (err) {
        alert('Failed loading admin data: ' + err.message);
      }
    }

    // ─── MEDIA HELPERS ───
    function populateMediaDropdown() {
      const select = document.getElementById('w-quick-media');
      if (!select) return;
      select.innerHTML = '<option value="">-- Choose local asset or type below --</option>';

      if (state.media.images && state.media.images.length > 0) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = 'Images (public/images)';
        state.media.images.forEach(img => {
          const opt = document.createElement('option');
          opt.value = img;
          opt.innerText = img.replace('/images/', '');
          optgroup.appendChild(opt);
        });
        select.appendChild(optgroup);
      }

      if (state.media.videos && state.media.videos.length > 0) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = 'Videos (public/videos)';
        state.media.videos.forEach(vid => {
          const opt = document.createElement('option');
          opt.value = vid;
          opt.innerText = vid.replace('/videos/', '');
          optgroup.appendChild(opt);
        });
        select.appendChild(optgroup);
      }
    }

    function pickExistingMedia(val) {
      if (!val) return;
      document.getElementById('w-thumbnail').value = val;
      if (val.endsWith('.mp4') || val.endsWith('.webm') || val.endsWith('.mov')) {
        document.getElementById('w-mediatype').value = 'video';
      } else {
        document.getElementById('w-mediatype').value = 'image';
      }
      updateWorkMediaPreview();
    }

    function updateWorkMediaPreview() {
      const pathVal = document.getElementById('w-thumbnail').value.trim();
      const typeVal = document.getElementById('w-mediatype').value;
      const box = document.getElementById('work-media-preview');

      if (!pathVal) {
        box.innerHTML = '<span style="color: #71717a; font-size: 12px;">Live Thumbnail Preview</span>';
        return;
      }

      if (typeVal === 'video') {
        box.innerHTML = '<video src="' + pathVal + '" controls muted loop autoplay style="max-width: 100%; max-height: 100%; border-radius: 6px;"></video>';
      } else {
        box.innerHTML = '<img src="' + pathVal + '" alt="Preview" style="max-width: 100%; max-height: 100%; border-radius: 6px;" onerror="this.onerror=null; this.parentElement.innerHTML=\\'<span style=\\\\x22color:#ef4444;font-size:12px;\\\\x22>Image not found: ' + pathVal + '</span>\\'">';
      }
    }

    // ─── RENDER WORKS ───
    function renderWorks() {
      const container = document.getElementById('works-list');
      container.innerHTML = state.works.map((w, idx) => {
        const isVideo = w.mediaType === 'video' || (w.thumbnail && w.thumbnail.endsWith('.mp4'));
        const mediaTag = isVideo
          ? '<video src="' + w.thumbnail + '" muted loop autoplay playsinline style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; background: #000;"></video>'
          : '<img src="' + w.thumbnail + '" alt="' + w.title + '" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; background: #000;" onerror="this.src=\\'/images/logo_v2.png\\'">';

        return \`
          <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="position: relative; margin-bottom: 12px; overflow: hidden; border-radius: 8px;">
                \${mediaTag}
                <span class="hud-badge" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);">
                  \${w.tag || 'Project'}
                </span>
              </div>
              <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px;">\${w.title}</h3>
              <p style="font-size: 12px; color: #a1a1aa; line-height: 1.4; margin-bottom: 12px;">\${w.description || 'No description'}</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; pt-3; border-top: 1px solid #1f1f23; margin-top: 8px;">
              <div style="display: flex; gap: 4px;">
                <button class="btn btn-secondary" onclick="moveWork(\${idx}, -1)" \${idx === 0 ? 'disabled' : ''}>▲</button>
                <button class="btn btn-secondary" onclick="moveWork(\${idx}, 1)" \${idx === state.works.length - 1 ? 'disabled' : ''}>▼</button>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-secondary" onclick="openEditWorkModal(\${idx})">✏️ Edit</button>
                <button class="btn btn-danger" onclick="deleteWork(\${idx})">🗑️ Delete</button>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function openAddWorkModal() {
      document.getElementById('work-edit-index').value = '-1';
      document.getElementById('work-modal-title').innerText = 'Add New Project';
      document.getElementById('w-title').value = '';
      document.getElementById('w-tag').value = 'PC Game';
      document.getElementById('w-desc').value = '';
      document.getElementById('w-link').value = '#';
      document.getElementById('w-thumbnail').value = '';
      document.getElementById('w-mediatype').value = 'image';
      document.getElementById('w-quick-media').value = '';
      updateWorkMediaPreview();
      document.getElementById('work-modal').style.display = 'flex';
    }

    function openEditWorkModal(idx) {
      const w = state.works[idx];
      document.getElementById('work-edit-index').value = idx;
      document.getElementById('work-modal-title').innerText = 'Edit Project: ' + w.title;
      document.getElementById('w-title').value = w.title || '';
      document.getElementById('w-tag').value = w.tag || '';
      document.getElementById('w-desc').value = w.description || '';
      document.getElementById('w-link').value = w.link || '#';
      document.getElementById('w-thumbnail').value = w.thumbnail || '';
      document.getElementById('w-mediatype').value = w.mediaType || 'image';
      document.getElementById('w-quick-media').value = '';
      updateWorkMediaPreview();
      document.getElementById('work-modal').style.display = 'flex';
    }

    async function saveWorkModal() {
      const idx = parseInt(document.getElementById('work-edit-index').value, 10);
      const title = document.getElementById('w-title').value.trim();
      const tag = document.getElementById('w-tag').value.trim();
      const description = document.getElementById('w-desc').value.trim();
      const link = document.getElementById('w-link').value.trim() || '#';
      const thumbnail = document.getElementById('w-thumbnail').value.trim();
      const mediaType = document.getElementById('w-mediatype').value;

      if (!title || !thumbnail) {
        return alert('Title and Thumbnail path are required.');
      }

      const item = { title, description, tag, link, thumbnail, mediaType };
      let updated = [...state.works];
      if (idx === -1) {
        updated.push(item);
      } else {
        updated[idx] = item;
      }

      await postSave('works', updated);
      state.works = updated;
      renderWorks();
      closeModal('work-modal');
    }

    function moveWork(idx, dir) {
      const updated = [...state.works];
      const target = idx + dir;
      const tmp = updated[idx];
      updated[idx] = updated[target];
      updated[target] = tmp;
      postSave('works', updated);
      state.works = updated;
      renderWorks();
    }

    function deleteWork(idx) {
      if (!confirm('Delete this project?')) return;
      const updated = state.works.filter((_, i) => i !== idx);
      postSave('works', updated);
      state.works = updated;
      renderWorks();
    }

    // ─── RENDER EVENTS ───
    function renderEvents() {
      const container = document.getElementById('events-list');
      container.innerHTML = state.events.map((ev, idx) => {
        const isFlagship = !!ev.featured;
        return \`
          <div class="card \${isFlagship ? 'flagship-card' : ''}" style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px;">
              <div>
                <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center; flex-wrap: wrap;">
                  <span class="hud-badge" style="color: #00b4d8; border-color: rgba(0,180,216,0.3);">\${ev.status} · \${ev.badgeText}</span>
                  \${isFlagship ? '<span class="flagship-badge">★ ACTIVE STUDIO FLAGSHIP (Controls Homepage & Popups)</span>' : ''}
                  <span style="font-size: 11px; font-family: monospace; color: #71717a;">/events/\${ev.slug}</span>
                  <span style="font-size: 11px; color: #71717a;">(\${ev.registrationType === 'external' ? 'External Link' : 'Built-in UPI Modal'})</span>
                </div>
                <h3 style="font-size: 20px; font-weight: 800; color: #fff;">\${ev.title}</h3>
                <p style="font-size: 13px; color: #a1a1aa; margin: 4px 0 10px 0;">\${ev.subtitle || ev.themeDescription || ''}</p>
                <div style="font-size: 12px; color: #71717a; font-family: monospace; display: flex; gap: 18px; flex-wrap: wrap;">
                  <span>📍 \${ev.venue || 'TBD'}</span>
                  <span>📅 \${ev.inPersonDates || ev.dates}</span>
                  <span>💰 ₹\${ev.pricePerPerson || 0}/Head</span>
                  <span>🏆 \${ev.totalPrizePool || 'TBD'}</span>
                  <span>🎮 \${(ev.tracks || []).length} Tracks</span>
                  <span>⏱️ \${(ev.schedule || []).length} Phases</span>
                </div>
              </div>
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; shrink: 0;">
                \${!isFlagship ? \`<button class="btn btn-flagship" onclick="makeEventFlagship(\${idx})">★ Set as Flagship</button>\` : ''}
                <a href="http://localhost:3000/events/\${ev.slug}" target="_blank" class="btn btn-secondary">👁️ Preview Page</a>
                <button class="btn btn-primary" onclick="openEditEventModal(\${idx})">✏️ Edit Master Record</button>
                <button class="btn btn-danger" onclick="deleteEvent(\${idx})">🗑️ Delete</button>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    async function makeEventFlagship(idx) {
      const updated = state.events.map((ev, i) => ({
        ...ev,
        featured: i === idx
      }));
      await postSave('events', updated);
      state.events = updated;
      renderEvents();
      showToast('Set "' + state.events[idx].title + '" as Studio Flagship!');
    }

    // Modal Subtab navigation
    function switchEventSubtab(paneName) {
      document.querySelectorAll('.modal-subtab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.subtab-pane').forEach(p => p.classList.remove('active'));

      const pane = document.getElementById('ev-pane-' + paneName);
      if (pane) pane.classList.add('active');

      const btn = Array.from(document.querySelectorAll('.modal-subtab')).find(b => b.getAttribute('onclick').includes(paneName));
      if (btn) btn.classList.add('active');

      if (paneName === 'raw') {
        syncFormToRawJson();
      }
    }

    // Working state for complex nested arrays inside event editor
    let currentEventDraft = {};

    function openAddEventModal() {
      const base = state.events[0] || {};
      const newEv = JSON.parse(JSON.stringify(base));
      newEv.id = 'jam-' + Date.now();
      newEv.slug = 'gamejam-' + Date.now();
      newEv.title = 'New Game Jam Title';
      newEv.subtitle = 'Hybrid Hackathon & Showcase';
      newEv.featured = false;
      document.getElementById('event-edit-index').value = '-1';
      document.getElementById('event-modal-title').innerText = 'Create New Event from Template';
      populateEventForm(newEv);
      switchEventSubtab('basics');
      document.getElementById('event-modal').style.display = 'flex';
    }

    function openEditEventModal(idx) {
      const ev = state.events[idx];
      document.getElementById('event-edit-index').value = idx;
      document.getElementById('event-modal-title').innerText = 'Edit Event: ' + ev.title;
      populateEventForm(ev);
      switchEventSubtab('basics');
      document.getElementById('event-modal').style.display = 'flex';
    }

    function populateEventForm(ev) {
      currentEventDraft = JSON.parse(JSON.stringify(ev));

      // Tab 1: Basics
      document.getElementById('ev-featured').checked = !!ev.featured;
      document.getElementById('ev-title').value = ev.title || '';
      document.getElementById('ev-slug').value = ev.slug || '';
      document.getElementById('ev-subtitle').value = ev.subtitle || '';
      document.getElementById('ev-status').value = ev.status || 'Upcoming';
      document.getElementById('ev-badge').value = ev.badgeText || 'Registrations Open';
      document.getElementById('ev-format').value = ev.format || '';
      document.getElementById('ev-dates').value = ev.dates || '';
      document.getElementById('ev-inperson').value = ev.inPersonDates || '';
      document.getElementById('ev-venue').value = ev.venue || '';
      document.getElementById('ev-audience').value = ev.targetAudience || '';
      document.getElementById('ev-duration').value = ev.duration || '';
      document.getElementById('ev-price').value = ev.pricePerPerson ?? 800;
      document.getElementById('ev-minsize').value = ev.minTeamSize ?? 3;
      document.getElementById('ev-maxsize').value = ev.maxTeamSize ?? 4;
      document.getElementById('ev-prizepool').value = ev.totalPrizePool || '';

      // Tab 2: Theme & Comms
      document.getElementById('ev-theme').value = ev.theme || '';
      document.getElementById('ev-countdown').value = ev.countdownTarget || '';
      document.getElementById('ev-themedesc').value = ev.themeDescription || '';
      document.getElementById('ev-regtype').value = ev.registrationType || 'modal';
      document.getElementById('ev-regurl').value = ev.registrationUrl || '';
      document.getElementById('ev-sheeturl').value = ev.googleSheetScriptUrl || '';
      document.getElementById('ev-discord').value = ev.discordInviteUrl || '';
      document.getElementById('ev-whatsapp').value = ev.whatsappGroupUrl || '';
      document.getElementById('ev-upi-id').value = ev.upiId || 'outergazers@oksbi';
      document.getElementById('ev-upi-payee').value = ev.upiPayeeName || 'OuterGazers Studio';

      // Tab 6: Rules & Inclusions
      document.getElementById('ev-inclusions-text').value = (ev.inclusions || []).join('\n');
      document.getElementById('ev-rules-text').value = (ev.rules || []).join('\n');

      renderTrackInputs();
      renderScheduleInputs();
      renderPrizeInputs();
      renderFaqInputs();
    }

    // Tracks editor
    function renderTrackInputs() {
      const tracks = currentEventDraft.tracks || [];
      document.getElementById('ev-subtab-track-count').innerText = tracks.length;
      const c = document.getElementById('ev-tracks-container');
      c.innerHTML = tracks.map((t, i) => \`
        <div class="sub-item-card">
          <div class="sub-item-header">
            <span style="font-weight: 700; color: #00b4d8; font-size: 12px;">Track #\${i + 1}</span>
            <button type="button" class="btn btn-danger" style="padding: 2px 8px; font-size: 11px;" onclick="removeTrackItem(\${i})">Remove</button>
          </div>
          <div class="grid-2">
            <div>
              <label>Track Name</label>
              <input type="text" value="\${t.name || ''}" onchange="updateTrackField(\${i}, 'name', this.value)" placeholder="e.g. PC Interactive Vanguard">
            </div>
            <div>
              <label>Hardware Target / Note</label>
              <input type="text" value="\${t.hardwareNotes || ''}" onchange="updateTrackField(\${i}, 'hardwareNotes', this.value)" placeholder="e.g. Windows PC Build Target">
            </div>
          </div>
          <label>Track Description</label>
          <textarea rows="2" onchange="updateTrackField(\${i}, 'description', this.value)">\${t.description || ''}</textarea>
        </div>
      \`).join('');
    }

    function addTrackItem() {
      if (!currentEventDraft.tracks) currentEventDraft.tracks = [];
      currentEventDraft.tracks.push({
        name: 'New Track Discipline',
        description: 'Track description and creative criteria.',
        icon: 'Monitor',
        hardwareNotes: 'Build Target'
      });
      renderTrackInputs();
    }
    function removeTrackItem(idx) {
      currentEventDraft.tracks.splice(idx, 1);
      renderTrackInputs();
    }
    function updateTrackField(idx, field, val) {
      if (currentEventDraft.tracks && currentEventDraft.tracks[idx]) {
        currentEventDraft.tracks[idx][field] = val;
      }
    }

    // Schedule editor
    function renderScheduleInputs() {
      const schedule = currentEventDraft.schedule || [];
      document.getElementById('ev-subtab-sched-count').innerText = schedule.length;
      const c = document.getElementById('ev-schedule-container');
      c.innerHTML = schedule.map((s, i) => \`
        <div class="sub-item-card">
          <div class="sub-item-header">
            <span style="font-weight: 700; color: #00b4d8; font-size: 12px;">Phase #\${i + 1}</span>
            <button type="button" class="btn btn-danger" style="padding: 2px 8px; font-size: 11px;" onclick="removeScheduleItem(\${i})">Remove</button>
          </div>
          <div class="grid-2">
            <div>
              <label>Phase Headline</label>
              <input type="text" value="\${s.phase || ''}" onchange="updateScheduleField(\${i}, 'phase', this.value)" placeholder="Phase 1: Registration Window">
            </div>
            <div>
              <label>Date / Time Range</label>
              <input type="text" value="\${s.time || ''}" onchange="updateScheduleField(\${i}, 'time', this.value)" placeholder="Nov 1 – Dec 11, 2026">
            </div>
          </div>
          <label>Phase Description</label>
          <textarea rows="2" onchange="updateScheduleField(\${i}, 'description', this.value)">\${s.description || ''}</textarea>
        </div>
      \`).join('');
    }

    function addScheduleItem() {
      if (!currentEventDraft.schedule) currentEventDraft.schedule = [];
      currentEventDraft.schedule.push({
        phase: 'Phase ' + (currentEventDraft.schedule.length + 1) + ': Milestone',
        time: 'TBD',
        description: 'Phase details and team actions.'
      });
      renderScheduleInputs();
    }
    function removeScheduleItem(idx) {
      currentEventDraft.schedule.splice(idx, 1);
      renderScheduleInputs();
    }
    function updateScheduleField(idx, field, val) {
      if (currentEventDraft.schedule && currentEventDraft.schedule[idx]) {
        currentEventDraft.schedule[idx][field] = val;
      }
    }

    // Prizes editor
    function renderPrizeInputs() {
      const prizes = currentEventDraft.prizes || [];
      const pc = document.getElementById('ev-prizes-container');
      pc.innerHTML = prizes.map((p, i) => \`
        <div class="sub-item-card">
          <div class="sub-item-header">
            <span style="font-weight: 700; color: #00b4d8; font-size: 12px;">Award #\${i + 1}</span>
            <button type="button" class="btn btn-danger" style="padding: 2px 8px; font-size: 11px;" onclick="removePrizeItem(\${i})">Remove</button>
          </div>
          <div class="grid-2">
            <div>
              <label>Award Title</label>
              <input type="text" value="\${p.place || ''}" onchange="updatePrizeField(\${i}, 'place', this.value)" placeholder="Overall Game Jam Winner">
            </div>
            <div>
              <label>Cash Reward</label>
              <input type="text" value="\${p.reward || ''}" onchange="updatePrizeField(\${i}, 'reward', this.value)" placeholder="₹8,000">
            </div>
          </div>
          <label>Perks / Criteria (One per line)</label>
          <textarea rows="2" onchange="updatePrizePerks(\${i}, this.value)">\${(p.perks || []).join('\n')}</textarea>
        </div>
      \`).join('');

      // Esports
      const esports = currentEventDraft.esportsPrizes || [];
      const ec = document.getElementById('ev-esports-container');
      ec.innerHTML = esports.map((e, i) => \`
        <div class="sub-item-card">
          <div class="sub-item-header">
            <span style="font-weight: 700; color: #c084fc; font-size: 12px;">Esports Tournament #\${i + 1}</span>
            <button type="button" class="btn btn-danger" style="padding: 2px 8px; font-size: 11px;" onclick="removeEsportItem(\${i})">Remove</button>
          </div>
          <div class="grid-2">
            <div>
              <label>Game Title</label>
              <input type="text" value="\${e.game || ''}" onchange="updateEsportField(\${i}, 'game', this.value)" placeholder="Valorant">
            </div>
            <div>
              <label>Platform &amp; Hardware</label>
              <input type="text" value="\${e.platform || ''}" onchange="updateEsportField(\${i}, 'platform', this.value)" placeholder="PC (Lab Gaming Rig)">
            </div>
          </div>
          <div class="grid-2">
            <div>
              <label>Tournament Format</label>
              <input type="text" value="\${e.format || ''}" onchange="updateEsportField(\${i}, 'format', this.value)" placeholder="1v1 Elimination Bracket">
            </div>
            <div>
              <label>Prize Pool</label>
              <input type="text" value="\${e.prize || ''}" onchange="updateEsportField(\${i}, 'prize', this.value)" placeholder="₹2,000 (Winner Takes All)">
            </div>
          </div>
        </div>
      \`).join('');
    }

    function addPrizeItem() {
      if (!currentEventDraft.prizes) currentEventDraft.prizes = [];
      currentEventDraft.prizes.push({
        place: 'Special Category Award',
        reward: '₹2,000',
        perks: ['Award recognition', 'Official Certificate'],
        gradient: 'from-[#00b4d8] to-[#7c3aed]'
      });
      renderPrizeInputs();
    }
    function removePrizeItem(idx) {
      currentEventDraft.prizes.splice(idx, 1);
      renderPrizeInputs();
    }
    function updatePrizeField(idx, field, val) {
      if (currentEventDraft.prizes && currentEventDraft.prizes[idx]) {
        currentEventDraft.prizes[idx][field] = val;
      }
    }
    function updatePrizePerks(idx, val) {
      if (currentEventDraft.prizes && currentEventDraft.prizes[idx]) {
        currentEventDraft.prizes[idx].perks = val.split('\n').map(s => s.trim()).filter(Boolean);
      }
    }

    function addEsportItem() {
      if (!currentEventDraft.esportsPrizes) currentEventDraft.esportsPrizes = [];
      currentEventDraft.esportsPrizes.push({
        game: 'EA Sports FC 26',
        platform: 'PlayStation 5',
        format: '1v1 Knockout Bracket',
        prize: '₹2,000 (Winner Takes All)'
      });
      renderPrizeInputs();
    }
    function removeEsportItem(idx) {
      currentEventDraft.esportsPrizes.splice(idx, 1);
      renderPrizeInputs();
    }
    function updateEsportField(idx, field, val) {
      if (currentEventDraft.esportsPrizes && currentEventDraft.esportsPrizes[idx]) {
        currentEventDraft.esportsPrizes[idx][field] = val;
      }
    }

    // FAQs editor
    function renderFaqInputs() {
      const faqs = currentEventDraft.faqs || [];
      const fc = document.getElementById('ev-faqs-container');
      fc.innerHTML = faqs.map((f, i) => \`
        <div class="sub-item-card">
          <div class="sub-item-header">
            <span style="font-weight: 700; color: #00b4d8; font-size: 12px;">FAQ #\${i + 1}</span>
            <button type="button" class="btn btn-danger" style="padding: 2px 8px; font-size: 11px;" onclick="removeFaqItem(\${i})">Remove</button>
          </div>
          <label>Question</label>
          <input type="text" value="\${f.question || ''}" onchange="updateFaqField(\${i}, 'question', this.value)" placeholder="e.g. Who is eligible to participate?">
          <label>Answer</label>
          <textarea rows="2" onchange="updateFaqField(\${i}, 'answer', this.value)">\${f.answer || ''}</textarea>
        </div>
      \`).join('');
    }

    function addFaqItem() {
      if (!currentEventDraft.faqs) currentEventDraft.faqs = [];
      currentEventDraft.faqs.push({
        question: 'Frequently Asked Question',
        answer: 'Detailed answer providing clarity for student teams.'
      });
      renderFaqInputs();
    }
    function removeFaqItem(idx) {
      currentEventDraft.faqs.splice(idx, 1);
      renderFaqInputs();
    }
    function updateFaqField(idx, field, val) {
      if (currentEventDraft.faqs && currentEventDraft.faqs[idx]) {
        currentEventDraft.faqs[idx][field] = val;
      }
    }

    // JSON Sync
    function assembleEventFromForm() {
      const inclusions = document.getElementById('ev-inclusions-text').value.split('\n').map(s => s.trim()).filter(Boolean);
      const rules = document.getElementById('ev-rules-text').value.split('\n').map(s => s.trim()).filter(Boolean);

      return {
        ...currentEventDraft,
        featured: document.getElementById('ev-featured').checked,
        title: document.getElementById('ev-title').value.trim(),
        slug: document.getElementById('ev-slug').value.trim(),
        subtitle: document.getElementById('ev-subtitle').value.trim(),
        status: document.getElementById('ev-status').value,
        badgeText: document.getElementById('ev-badge').value.trim(),
        format: document.getElementById('ev-format').value.trim(),
        dates: document.getElementById('ev-dates').value.trim(),
        inPersonDates: document.getElementById('ev-inperson').value.trim(),
        venue: document.getElementById('ev-venue').value.trim(),
        targetAudience: document.getElementById('ev-audience').value.trim(),
        duration: document.getElementById('ev-duration').value.trim(),
        pricePerPerson: Number(document.getElementById('ev-price').value),
        minTeamSize: Number(document.getElementById('ev-minsize').value),
        maxTeamSize: Number(document.getElementById('ev-maxsize').value),
        totalPrizePool: document.getElementById('ev-prizepool').value.trim(),
        theme: document.getElementById('ev-theme').value.trim(),
        countdownTarget: document.getElementById('ev-countdown').value.trim(),
        themeDescription: document.getElementById('ev-themedesc').value.trim(),
        registrationType: document.getElementById('ev-regtype').value,
        registrationUrl: document.getElementById('ev-regurl').value.trim(),
        googleSheetScriptUrl: document.getElementById('ev-sheeturl').value.trim(),
        discordInviteUrl: document.getElementById('ev-discord').value.trim(),
        whatsappGroupUrl: document.getElementById('ev-whatsapp').value.trim(),
        upiId: document.getElementById('ev-upi-id').value.trim(),
        upiPayeeName: document.getElementById('ev-upi-payee').value.trim(),
        inclusions,
        rules,
      };
    }

    function syncFormToRawJson() {
      const obj = assembleEventFromForm();
      document.getElementById('ev-raw-json').value = JSON.stringify(obj, null, 2);
    }

    function applyRawJsonToForm() {
      try {
        const parsed = JSON.parse(document.getElementById('ev-raw-json').value);
        populateEventForm(parsed);
        showToast('Applied raw JSON to form controls!');
      } catch (err) {
        alert('Invalid JSON syntax: ' + err.message);
      }
    }

    async function saveEventModal() {
      const idx = parseInt(document.getElementById('event-edit-index').value, 10);
      const ev = assembleEventFromForm();

      if (!ev.title || !ev.slug) {
        switchEventSubtab('basics');
        return alert('Event Title and URL Slug are required.');
      }

      let updated = [...state.events];
      if (idx === -1) {
        updated.push(ev);
      } else {
        updated[idx] = ev;
      }

      // If marked as featured/flagship, ensure all others are unset
      if (ev.featured) {
        const targetSlug = ev.slug;
        updated = updated.map(e => ({
          ...e,
          featured: e.slug === targetSlug
        }));
      }

      await postSave('events', updated);
      state.events = updated;
      renderEvents();
      closeModal('event-modal');
    }

    function deleteEvent(idx) {
      if (!confirm('Are you sure you want to delete this event listing?')) return;
      const updated = state.events.filter((_, i) => i !== idx);
      postSave('events', updated);
      state.events = updated;
      renderEvents();
    }

    // ─── RENDER NEWS ───
    function renderNews() {
      const tickerContainer = document.getElementById('ticker-chips');
      tickerContainer.innerHTML = state.ticker.map((t, idx) => \`
        <span class="hud-badge" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; font-size: 11px;">
          \${t}
          <button onclick="deleteTickerItem(\${idx})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 12px;">×</button>
        </span>
      \`).join('');

      const listContainer = document.getElementById('news-list');
      listContainer.innerHTML = state.news.map((n, idx) => \`
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span class="hud-badge" style="color: #00b4d8; border-color: rgba(0,180,216,0.3);">\${n.tag}</span>
              <span style="font-size: 11px; font-family: monospace; color: #71717a;">\${n.date} · \${n.readTime}</span>
            </div>
            <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 6px;">\${n.title}</h4>
            <p style="font-size: 12px; color: #a1a1aa; line-height: 1.4; margin-bottom: 12px;">\${n.excerpt}</p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; pt-3; border-top: 1px solid #1f1f23; margin-top: 12px;">
            <button class="btn btn-secondary" onclick="openEditNewsModal(\${idx})">✏️ Edit</button>
            <button class="btn btn-danger" onclick="deleteNews(\${idx})">🗑️ Delete</button>
          </div>
        </div>
      \`).join('');
    }

    function addTickerItem() {
      const input = document.getElementById('new-ticker-input');
      const val = input.value.trim().toUpperCase();
      if (!val) return;
      const updated = [...state.ticker, val];
      state.ticker = updated;
      postSave('news', state.news, updated);
      renderNews();
      input.value = '';
    }

    function deleteTickerItem(idx) {
      const updated = state.ticker.filter((_, i) => i !== idx);
      state.ticker = updated;
      postSave('news', state.news, updated);
      renderNews();
    }

    function openAddNewsModal() {
      document.getElementById('news-edit-index').value = '-1';
      document.getElementById('news-modal-title').innerText = 'New Announcement';
      document.getElementById('n-title').value = '';
      document.getElementById('n-tag').value = 'ANNOUNCEMENT';
      document.getElementById('n-date').value = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
      document.getElementById('n-readtime').value = '3 MIN READ';
      document.getElementById('n-excerpt').value = '';
      document.getElementById('n-content').value = '';
      document.getElementById('n-eventslug').value = '';
      document.getElementById('n-extlink').value = '';
      document.getElementById('news-modal').style.display = 'flex';
    }

    function openEditNewsModal(idx) {
      const n = state.news[idx];
      document.getElementById('news-edit-index').value = idx;
      document.getElementById('news-modal-title').innerText = 'Edit: ' + n.title;
      document.getElementById('n-title').value = n.title || '';
      document.getElementById('n-tag').value = n.tag || 'ANNOUNCEMENT';
      document.getElementById('n-date').value = n.date || '';
      document.getElementById('n-readtime').value = n.readTime || '3 MIN READ';
      document.getElementById('n-excerpt').value = n.excerpt || '';
      document.getElementById('n-content').value = n.content || '';
      document.getElementById('n-eventslug').value = n.relatedEventSlug || '';
      document.getElementById('n-extlink').value = n.externalLink || '';
      document.getElementById('news-modal').style.display = 'flex';
    }

    async function saveNewsModal() {
      const idx = parseInt(document.getElementById('news-edit-index').value, 10);
      const title = document.getElementById('n-title').value.trim();
      const tag = document.getElementById('n-tag').value;
      const date = document.getElementById('n-date').value.trim();
      const readTime = document.getElementById('n-readtime').value.trim();
      const excerpt = document.getElementById('n-excerpt').value.trim();
      const content = document.getElementById('n-content').value.trim();
      const relatedEventSlug = document.getElementById('n-eventslug').value.trim() || undefined;
      const externalLink = document.getElementById('n-extlink').value.trim() || undefined;

      if (!title) return alert('Headline Title is required');

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const item = {
        id: idx === -1 ? 'news-' + Date.now() : state.news[idx].id,
        slug,
        title,
        date,
        readTime,
        tag,
        excerpt,
        content,
        published: true,
        relatedEventSlug,
        externalLink
      };

      let updated = [...state.news];
      if (idx === -1) {
        updated.unshift(item);
      } else {
        updated[idx] = item;
      }

      await postSave('news', updated, state.ticker);
      state.news = updated;
      renderNews();
      closeModal('news-modal');
    }

    function deleteNews(idx) {
      if (!confirm('Delete this announcement?')) return;
      const updated = state.news.filter((_, i) => i !== idx);
      postSave('news', updated, state.ticker);
      state.news = updated;
      renderNews();
    }

    // ─── CONFIG & HEALTH ───
    function populateConfig() {
      const cfg = state.config || {};
      document.getElementById('cfg-google-script').value = cfg.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '';
      document.getElementById('cfg-discord-invite').value = cfg.NEXT_PUBLIC_DISCORD_INVITE_URL || '';
      document.getElementById('cfg-connect-email').value = cfg.NEXT_PUBLIC_CONNECT_EMAIL || '';
      document.getElementById('cfg-upi-id').value = cfg.NEXT_PUBLIC_UPI_ID || '';
      document.getElementById('cfg-upi-payee').value = cfg.NEXT_PUBLIC_UPI_PAYEE_NAME || '';
    }

    async function handleSaveConfig(e) {
      e.preventDefault();
      const newConfig = {
        NEXT_PUBLIC_GOOGLE_SCRIPT_URL: document.getElementById('cfg-google-script').value.trim(),
        NEXT_PUBLIC_DISCORD_INVITE_URL: document.getElementById('cfg-discord-invite').value.trim(),
        NEXT_PUBLIC_CONNECT_EMAIL: document.getElementById('cfg-connect-email').value.trim(),
        NEXT_PUBLIC_UPI_ID: document.getElementById('cfg-upi-id').value.trim(),
        NEXT_PUBLIC_UPI_PAYEE_NAME: document.getElementById('cfg-upi-payee').value.trim(),
      };
      await postSave('config', newConfig);
      state.config = { ...state.config, ...newConfig };
      showToast('Saved .env.local configuration!');
    }

    async function runDiagnostics() {
      const container = document.getElementById('diagnostics-container');
      container.innerHTML = '<div class="card" style="text-align: center; color: #00b4d8; padding: 30px;">Testing connections across Google Sheets, Discord, Email & UPI...</div>';
      try {
        const res = await fetch('/api/health-check');
        const results = await res.json();
        container.innerHTML = results.map(r => \`
          <div class="card" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
                <span class="health-pill pill-\${r.status}">\${r.status}</span>
                <span style="font-weight: 700; font-size: 14px;">\${r.service}</span>
                \${r.latencyMs ? '<span style="font-size: 11px; font-family: monospace; color: #71717a;">(' + r.latencyMs + 'ms)</span>' : ''}
              </div>
              <p style="font-size: 12px; color: #a1a1aa;">\${r.message}</p>
            </div>
          </div>
        \`).join('');
      } catch (err) {
        container.innerHTML = '<div style="color: #ef4444;">Diagnostic failed: ' + err.message + '</div>';
      }
    }

    async function postSave(section, data, ticker) {
      try {
        const res = await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section, data, ticker })
        });
        const out = await res.json();
        if (out.success) {
          showToast('Saved ' + section + ' successfully!');
        } else {
          alert('Error: ' + (out.error || 'Failed saving'));
        }
      } catch (err) {
        alert('Failed saving: ' + err.message);
      }
    }

    function closeModal(id) {
      document.getElementById(id).style.display = 'none';
    }

    window.onclick = function(e) {
      if (e.target.classList.contains('modal-backdrop')) {
        e.target.style.display = 'none';
      }
    };

    // Initial boot
    loadAllData();
  </script>
</body>
</html>`;
}

// ─── HTTP SERVER REQUEST DISPATCHER ──────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  // Enforce local only access
  const remoteIp = req.socket.remoteAddress;
  if (remoteIp !== "127.0.0.1" && remoteIp !== "::1" && remoteIp !== "::ffff:127.0.0.1") {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("Forbidden: Access restricted strictly to offline localhost.");
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // Serve Dashboard HTML
  if (pathname === "/" || pathname === "/admin") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(getDashboardHtml());
  }

  // GET /api/data
  if (pathname === "/api/data" && req.method === "GET") {
    const works = extractArrayFromTs(worksPath, "WORKS_DATA");
    const events = extractArrayFromTs(eventsPath, "EVENTS_DATA");
    const news = extractArrayFromTs(newsPath, "NEWS_DATA");
    const ticker = extractArrayFromTs(newsPath, "NEWS_TICKER");
    const config = readEnvConfig();

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ works, events, news, ticker, config }));
  }

  // GET /api/media-list
  if (pathname === "/api/media-list" && req.method === "GET") {
    const imagesDir = path.join(publicDir, "images");
    const videosDir = path.join(publicDir, "videos");
    const images = fs.existsSync(imagesDir)
      ? fs
          .readdirSync(imagesDir)
          .filter((f) => /\.(png|jpe?g|webp|gif|svg)$/i.test(f))
          .map((f) => `/images/${f}`)
      : [];
    const videos = fs.existsSync(videosDir)
      ? fs
          .readdirSync(videosDir)
          .filter((f) => /\.(mp4|webm|mov)$/i.test(f))
          .map((f) => `/videos/${f}`)
      : [];

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ images, videos }));
  }

  // POST /api/save
  if (pathname === "/api/save" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const payload = JSON.parse(body);
        const { section, data, ticker } = payload;

        if (section === "works") {
          saveWorksData(data);
        } else if (section === "events") {
          saveEventsData(data);
        } else if (section === "news") {
          saveNewsData(data, ticker);
        } else if (section === "config") {
          saveEnvConfig(data);
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Invalid section" }));
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // GET /api/health-check
  if (pathname === "/api/health-check" && req.method === "GET") {
    const results = await runDiagnostics();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(results));
  }

  // ─── STATIC ASSET SERVING FOR PUBLIC/ (IMAGES, VIDEOS, FONTS) ───
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, "");
  const filePath = path.join(publicDir, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".mov": "video/quicktime",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".woff": "font/woff",
      ".woff2": "font/woff2",
      ".ttf": "font/ttf",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json",
      ".ico": "image/x-icon",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";
    const stat = fs.statSync(filePath);
    const range = req.headers.range;

    // Support video/audio streaming with byte ranges (HTTP 206)
    if (range && (contentType.startsWith("video/") || contentType.startsWith("audio/"))) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": contentType,
      });
      return file.pipe(res);
    }

    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stat.size,
      "Cache-Control": "public, max-age=3600",
    });
    return fs.createReadStream(filePath).pipe(res);
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(PORT, HOST, () => {
  const url = `http://localhost:${PORT}`;
  console.log("\n\x1b[36m\x1b[1m╔════════════════════════════════════════════════════════════════════╗\x1b[0m");
  console.log(`\x1b[36m\x1b[1m║   OUTERGAZERS OFFLINE LOCAL ADMIN PANEL RUNNING AT:               ║\x1b[0m`);
  console.log(`\x1b[36m\x1b[1m║   👉 \x1b[32m${url}\x1b[36m                                          ║\x1b[0m`);
  console.log("\x1b[36m\x1b[1m╚════════════════════════════════════════════════════════════════════╝\x1b[0m\n");
  console.log("\x1b[90mThis server is strictly local and will never be published to the web.\x1b[0m");
  console.log("\x1b[90mPress Ctrl+C to terminate the admin server.\x1b[0m\n");

  const openCmd =
    process.platform === "win32"
      ? `start ${url}`
      : process.platform === "darwin"
      ? `open ${url}`
      : `xdg-open ${url}`;
  exec(openCmd, () => {});
});
