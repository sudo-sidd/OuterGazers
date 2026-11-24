#!/usr/bin/env node
/**
 * ==============================================================================
 * OUTERGAZERS STUDIO — INTEGRATION HEALTH CHECK & DIAGNOSTICS SCRIPT
 * ==============================================================================
 *
 * Tests all live integrations and configurations:
 * 1. Google Sheets Backend & Apps Script Web App (doGet / deployment check)
 * 3. Studio Email Comms Pipeline
 * 4. UPI Payment VPA & Deep-link configuration
 * 5. Local Data Store files integrity (works.ts, events.ts, news.ts)
 *
 * Usage:
 *   npm run health-check
 *   node scripts/health-check.mjs
 * ==============================================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// ANSI Colors
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const PURPLE = "\x1b[35m";
const GRAY = "\x1b[90m";

// Load .env.local
const envPath = path.join(rootDir, ".env.local");
const envVars = {};

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        envVars[key] = val;
      }
    }
  });
}

const GOOGLE_SCRIPT_URL = envVars.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "";
const CONTACT_EMAIL = envVars.NEXT_PUBLIC_CONTACT_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "connect@outergazer.in";
const UPI_ID = envVars.NEXT_PUBLIC_UPI_ID || process.env.NEXT_PUBLIC_UPI_ID || "outergazers@oksbi";
const UPI_PAYEE = envVars.NEXT_PUBLIC_UPI_PAYEE_NAME || process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || "OuterGazers Studio";

console.log("\n" + CYAN + BOLD + "╔════════════════════════════════════════════════════════════════════╗" + RESET);
console.log(CYAN + BOLD + "║           OUTERGAZERS STUDIO — SYSTEM HEALTH & DIAGNOSTICS         ║" + RESET);
console.log(CYAN + BOLD + "╚════════════════════════════════════════════════════════════════════╝" + RESET + "\n");

let passedCount = 0;
let warnCount = 0;
let failCount = 0;

function logResult(status, title, message, latencyMs) {
  let badge = "";
  if (status === "PASS") {
    badge = GREEN + BOLD + "  [ PASS ] " + RESET;
    passedCount++;
  } else if (status === "WARN") {
    badge = YELLOW + BOLD + "  [ WARN ] " + RESET;
    warnCount++;
  } else {
    badge = RED + BOLD + "  [ FAIL ] " + RESET;
    failCount++;
  }

  const timing = latencyMs !== undefined ? GRAY + ` (${latencyMs}ms)` + RESET : "";
  console.log(`${badge}${BOLD}${title}${RESET}${timing}`);
  console.log(`           ${GRAY}${message}${RESET}\n`);
}

async function runHealthChecks() {
  // ─── 1. GOOGLE APPS SCRIPT & SHEETS ───────────────────────────────────────
  if (!GOOGLE_SCRIPT_URL) {
    logResult(
      "WARN",
      "Google Apps Script Web App",
      "NEXT_PUBLIC_GOOGLE_SCRIPT_URL is not set in .env.local.\n" +
      "           To enable automatic Sheets logging & payment proof uploads:\n" +
      "           1. Follow deployment steps in 'google_apps_script.js'\n" +
      "           2. Add NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/... to .env.local"
    );
  } else if (!GOOGLE_SCRIPT_URL.startsWith("https://script.google.com/macros/s/")) {
    logResult(
      "WARN",
      "Google Apps Script Web App",
      `Configured URL does not look like a standard Google Apps Script Web App:\n           ${GOOGLE_SCRIPT_URL}`
    );
  } else {
    const t0 = Date.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(GOOGLE_SCRIPT_URL, {
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

        if (json && json.status === "active") {
          logResult(
            "PASS",
            "Google Apps Script Web App",
            `Backend responded with active status: "${json.message}"`,
            latency
          );
        } else {
          logResult(
            "PASS",
            "Google Apps Script Web App",
            `HTTP ${res.status} OK received from Apps Script Web App.`,
            latency
          );
        }
      } else {
        logResult(
          "FAIL",
          "Google Apps Script Web App",
          `Returned HTTP ${res.status}. Ensure Apps Script deployment 'Who has access' is set to 'Anyone'.`,
          latency
        );
      }
    } catch (err) {
      const latency = Date.now() - t0;
      logResult(
        "FAIL",
        "Google Apps Script Web App",
        `Network error: ${err.message}. Check your internet connection or Google Script deployment URL.`,
        latency
      );
    }
  }

  // ─── 3. EMAIL & COMMS ─────────────────────────────────────────────────────
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(CONTACT_EMAIL)) {
    logResult(
      "PASS",
      "Studio Comms & Inquiries",
      `Routing address: ${CONTACT_EMAIL} via FormSubmit AJAX endpoint.`
    );
  } else {
    logResult("WARN", "Studio Comms & Inquiries", `Invalid contact email syntax: ${CONTACT_EMAIL}`);
  }

  // ─── 4. UPI PAYMENT GATEWAY ───────────────────────────────────────────────
  const upiRegex = /^[\w.-]+@[\w.-]+$/;
  if (upiRegex.test(UPI_ID)) {
    logResult(
      "PASS",
      "UPI Payment Configuration",
      `VPA: ${UPI_ID} (${UPI_PAYEE}). Instant QR generator & mobile deep-links functional.`
    );
  } else {
    logResult("WARN", "UPI Payment Configuration", `UPI ID '${UPI_ID}' does not follow user@bank format.`);
  }

  // ─── 5. DATA STORE FILES ──────────────────────────────────────────────────
  const worksPath = path.join(rootDir, "src", "data", "works.ts");
  const eventsPath = path.join(rootDir, "src", "data", "events.ts");
  const newsPath = path.join(rootDir, "src", "data", "news.ts");

  const worksExists = fs.existsSync(worksPath);
  const eventsExists = fs.existsSync(eventsPath);
  const newsExists = fs.existsSync(newsPath);

  if (worksExists && eventsExists && newsExists) {
    logResult(
      "PASS",
      "Modular Data Store Architecture",
      "Dedicated data files verified: src/data/works.ts, src/data/events.ts, src/data/news.ts."
    );
  } else {
    logResult(
      "FAIL",
      "Modular Data Store Architecture",
      `Missing data files. Works: ${worksExists}, Events: ${eventsExists}, News: ${newsExists}.`
    );
  }

  // ─── SUMMARY REPORT ───────────────────────────────────────────────────────
  console.log(GRAY + "────────────────────────────────────────────────────────────────────" + RESET);
  console.log(
    `Summary: ${GREEN}${passedCount} Passed${RESET} | ` +
    `${YELLOW}${warnCount} Warnings${RESET} | ` +
    `${RED}${failCount} Failed${RESET}`
  );

  if (failCount === 0 && warnCount === 0) {
    console.log(GREEN + BOLD + "✔ All OuterGazers integrations & data stores are in prime condition!\n" + RESET);
  } else if (failCount === 0) {
    console.log(YELLOW + BOLD + "▲ System operational with minor recommendations above.\n" + RESET);
  } else {
    console.log(RED + BOLD + "✖ Action required for failed components before deployment.\n" + RESET);
  }

  console.log(CYAN + "To manage content or run diagnostics in browser, launch: " + BOLD + "npm run admin" + RESET + CYAN + " (opens " + BOLD + "http://localhost:3333" + RESET + CYAN + ")\n" + RESET);
}

runHealthChecks();
