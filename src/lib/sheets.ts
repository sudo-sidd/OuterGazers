import { GOOGLE_SHEET_SCRIPT_URL } from "@/constants";
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
async function postToGoogleScript(data: Record<string, unknown>): Promise<{ success: boolean; message?: string }> {
  if (!GOOGLE_SHEET_SCRIPT_URL) {
    console.warn("Google Sheet Script URL not configured. Data logged locally:", data);
    return { success: true, message: "Demo mode: Google Sheet URL not yet set in environment." };
  }

  const payloadString = JSON.stringify(data);

  try {
    // CRITICAL for Google Apps Script Web Apps:
    // Browser fetch must use mode: "no-cors" to avoid CORS blocks on Google's 302 redirect.
    await fetch(GOOGLE_SHEET_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      keepalive: true,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: payloadString,
    });

    return { success: true, message: "Logged to Google Sheet successfully." };
  } catch (error) {
    console.warn("Fetch to Google Sheet failed, trying sendBeacon fallback:", error);
    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([payloadString], { type: "text/plain;charset=utf-8" });
        navigator.sendBeacon(GOOGLE_SHEET_SCRIPT_URL, blob);
        return { success: true, message: "Logged via sendBeacon." };
      }
    } catch (beaconErr) {
      console.error("sendBeacon fallback failed:", beaconErr);
    }
    return { success: false, message: "Network error sending to Google Sheet." };
  }
}

/**
 * Logs a Game Jam Team Registration to the Google Sheet
 */
export async function submitTeamRegistration(
  payload: TeamRegistrationPayload
): Promise<{ success: boolean; message?: string }> {
  return postToGoogleScript({
    formType: "gamejam_registration",
    ...payload,
  });
}

/**
 * Logs a Contact Form message to the Google Sheet
 */
export async function submitContactInquiry(
  payload: ContactPayload
): Promise<{ success: boolean; message?: string }> {
  return postToGoogleScript({
    formType: "contact_inquiry",
    ...payload,
  });
}
