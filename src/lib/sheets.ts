import { GOOGLE_SHEET_SCRIPT_URL, FORMSUBMIT_URL, CONTACT_EMAIL } from "@/constants";
import { TeamRegistrationPayload } from "@/types";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

/**
 * Sends data to the Google Apps Script Web App.
 * Uses text/plain body to prevent CORS preflight blocks across static origins.
 */
async function postToGoogleScript(
  data: Record<string, unknown>,
  customUrl?: string
): Promise<{ success: boolean; message?: string }> {
  const targetUrl = customUrl || GOOGLE_SHEET_SCRIPT_URL;

  if (!targetUrl) {
    console.warn("Google Sheet Script URL is not configured. Skipping Google Sheets logging.");
    return {
      success: false,
      message: "Google Sheet URL is not configured.",
    };
  }

  const payloadString = JSON.stringify(data);

  try {
    // Browser fetch must use mode: "no-cors" to avoid CORS blocks on Google's 302 redirect.
    // Note: keepalive is omitted here to support payloads > 64KB (such as payment proof screenshot images).
    await fetch(targetUrl, {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: payloadString,
    });

    return { success: true, message: "Logged to Google Sheet successfully." };
  } catch (error) {
    console.warn("Fetch to Google Sheet failed, trying fallback:", error);
    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon && payloadString.length < 60000) {
        const blob = new Blob([payloadString], { type: "text/plain;charset=utf-8" });
        navigator.sendBeacon(targetUrl, blob);
        return { success: true, message: "Logged via sendBeacon." };
      }
    } catch (beaconErr) {
      console.error("sendBeacon fallback failed:", beaconErr);
    }
    return { success: false, message: "Network error sending to Google Sheet." };
  }
}

/**
 * Logs a Game Jam Team Registration to the Google Sheet (supports per-event customSheetUrl)
 */
export async function submitTeamRegistration(
  payload: TeamRegistrationPayload,
  customSheetUrl?: string
): Promise<{ success: boolean; message?: string }> {
  return postToGoogleScript(
    {
      formType: "gamejam_registration",
      ...payload,
    },
    customSheetUrl
  );
}

/**
 * Dispatches Contact Form messages directly to connect@outergazer.in
 * Uses FormSubmit as primary email delivery pipeline with optional Google Sheets backup.
 */
export async function submitContactInquiry(
  payload: ContactPayload
): Promise<{ success: boolean; message?: string }> {
  let emailDispatched = false;
  let lastError = "";

  // 1. Primary: Direct email delivery to connect@outergazer.in via FormSubmit AJAX endpoint
  try {
    const response = await fetch(FORMSUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        _replyto: payload.email,
        _subject: `[OuterGazers Comms] ${payload.subject || "General Inquiry"} from ${payload.name}`,
        subject: payload.subject,
        message: payload.message,
        submittedAt: payload.submittedAt || new Date().toISOString(),
        _template: "table",
        _captcha: "false",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // Accepts both direct success and first-time activation notification
      if (
        data.success === "true" ||
        data.success === true ||
        (typeof data.message === "string" && data.message.toLowerCase().includes("activation"))
      ) {
        emailDispatched = true;
      }
    } else {
      lastError = `Form service returned status ${response.status}`;
    }
  } catch (err) {
    console.warn("Direct email delivery via FormSubmit encountered error:", err);
    lastError = err instanceof Error ? err.message : String(err);
  }

  // 2. Secondary: If Google Apps Script is configured, log inquiry and dispatch via Google MailApp
  if (GOOGLE_SHEET_SCRIPT_URL) {
    try {
      const scriptRes = await postToGoogleScript({
        formType: "contact_inquiry",
        ...payload,
      });
      if (scriptRes.success) {
        emailDispatched = true;
      }
    } catch (sheetErr) {
      console.warn("Google Apps Script contact dispatch failed:", sheetErr);
    }
  }

  if (emailDispatched) {
    return {
      success: true,
      message: `Transmission received! Message routed to ${CONTACT_EMAIL}.`,
    };
  }

  return {
    success: false,
    message: lastError || `Unable to deliver transmission to ${CONTACT_EMAIL}.`,
  };
}
