/**
 * ============================================================================
 * OUTERGAZERS STUDIO — GOOGLE APPS SCRIPT WEB APP
 * Handles Form Submissions, Google Sheets Logging & Discord Alerts
 * ============================================================================
 *
 * HOW TO DEPLOY:
 * 1. Open Google Sheets (create a new sheet or use an existing one).
 * 2. Click: Extensions > Apps Script.
 * 3. Delete any default code in Code.gs, paste this ENTIRE file, and save (Ctrl+S).
 * 4. (Optional) Paste your Discord Webhook URL into DISCORD_WEBHOOK_URL below if you
 *    want automated Discord alerts whenever someone registers or sends a message.
 * 5. Click the blue "Deploy" button (top right) > "New deployment".
 * 6. Select type: "Web app" (click the gear icon > Web app).
 * 7. Set:
 *    - Description: "OuterGazers API v1"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (CRITICAL: this allows your GitHub Pages static site to POST to it)
 * 8. Click "Deploy", authorize permissions when prompted.
 * 9. Copy the "Web app URL" (starts with https://script.google.com/macros/s/...)
 * 10. Add it to your .env file or GitHub repository secrets as:
 *     NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/...
 * ============================================================================
 */

// Paste your Discord Channel Webhook URL here to receive instant team registration alerts:
const DISCORD_WEBHOOK_URL = ""; 

function doGet(e) {
  return jsonResponse({
    status: "active",
    message: "OuterGazers Google Sheets API is live and ready for registrations."
  });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: "error", message: "No data payload received" });
    }

    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.formType === "gamejam_registration") {
      handleGameJamRegistration(ss, data);
      if (DISCORD_WEBHOOK_URL) {
        sendDiscordAlert(data);
      }
      return jsonResponse({
        status: "success",
        message: "Registration logged successfully",
        registrationId: data.registrationId
      });
    } else if (data.formType === "contact_inquiry") {
      handleContactInquiry(ss, data);
      if (DISCORD_WEBHOOK_URL) {
        sendDiscordContactAlert(data);
      }
      return jsonResponse({
        status: "success",
        message: "Inquiry logged successfully"
      });
    }

    return jsonResponse({ status: "error", message: "Unknown form type" });
  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return jsonResponse({ status: "error", error: error.toString() });
  }
}

function handleGameJamRegistration(ss, data) {
  let sheet = ss.getSheetByName("GameJam_Registrations");
  if (!sheet) {
    sheet = ss.insertSheet("GameJam_Registrations");
    const headers = [
      "Timestamp",
      "Registration ID",
      "Event Title",
      "Team Name",
      "College / Institution",
      "Team Size",
      "Amount (INR)",
      "Payment Status",
      "Payment ID",
      "Leader Name",
      "Leader Email",
      "Leader Phone",
      "Member 2 Name",
      "Member 3 Name",
      "Member 4 Name"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#00b4d8").setFontColor("#000000");
    sheet.setFrozenRows(1);
  }

  const leader = data.leader || {};
  const members = data.members || [];
  const m2 = members[0] || {};
  const m3 = members[1] || {};
  const m4 = members[2] || {};

  const row = [
    data.submittedAt || new Date().toISOString(),
    data.registrationId || "",
    data.eventTitle || "",
    data.teamName || "",
    data.collegeName || "",
    data.teamSize || "",
    data.totalAmount || "",
    data.paymentStatus || "PENDING",
    data.razorpayPaymentId || "N/A",
    leader.name || "",
    leader.email || "",
    leader.phone || "",
    m2.name || "",
    m3.name || "",
    m4.name || "N/A"
  ];

  sheet.appendRow(row);
}

function handleContactInquiry(ss, data) {
  let sheet = ss.getSheetByName("Contact_Inquiries");
  if (!sheet) {
    sheet = ss.insertSheet("Contact_Inquiries");
    const headers = ["Timestamp", "Name", "Email", "Subject", "Message"];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#7c3aed").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    data.submittedAt || new Date().toISOString(),
    data.name || "",
    data.email || "",
    data.subject || "",
    data.message || ""
  ]);
}

function sendDiscordAlert(data) {
  try {
    const leader = data.leader || {};
    const payload = {
      content: "🚀 **NEW GAME JAM REGISTRATION RECEIVED!**",
      embeds: [
        {
          title: "Team: " + data.teamName,
          description: "Registered for **" + data.eventTitle + "**",
          color: 46376, // #00b4d8 cyan
          fields: [
            { name: "Track", value: data.track || "Not specified", inline: true },
            { name: "Team Size", value: String(data.teamSize) + " Gazers", inline: true },
            { name: "Fee Status", value: "₹" + data.totalAmount + " (" + data.paymentStatus + ")", inline: true },
            { name: "Payment ID", value: data.razorpayPaymentId || "Pending", inline: true },
            { name: "Team Leader", value: (leader.name || "Unknown") + " (" + (leader.discordTag || "No Discord") + ")", inline: true },
            { name: "Contact", value: (leader.email || "") + " | " + (leader.phone || ""), inline: false }
          ],
          footer: { text: "OuterGazers Transmissions · Reg ID: " + data.registrationId }
        }
      ]
    };

    UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch (err) {
    Logger.log("Discord alert failed: " + err.toString());
  }
}

function sendDiscordContactAlert(data) {
  try {
    const payload = {
      content: "📨 **NEW CONTACT INQUIRY RECEIVED!**",
      embeds: [
        {
          title: data.subject || "Comms Transmission",
          description: data.message || "",
          color: 8141549, // #7c3aed purple
          fields: [
            { name: "From", value: data.name || "Unknown", inline: true },
            { name: "Email", value: data.email || "", inline: true }
          ],
          footer: { text: "OuterGazers Comms" }
        }
      ]
    };

    UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch (err) {
    Logger.log("Discord contact alert failed: " + err.toString());
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
