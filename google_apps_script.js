/**
 * ============================================================================
 * OUTERGAZERS STUDIO — GOOGLE APPS SCRIPT WEB APP
 * Handles Form Submissions, UPI Payment Screenshot Uploads & Sheets Logging
 * ============================================================================
 *
 * HOW TO DEPLOY:
 * 1. Open Google Sheets (create a new sheet or use an existing one).
 * 2. Click: Extensions > Apps Script.
 * 3. Delete any default code in Code.gs, paste this ENTIRE file, and save (Ctrl+S).
 * 4. (Optional) Paste your Discord Webhook URL into DISCORD_WEBHOOK_URL below if you
 *    want automated Discord alerts whenever someone registers or sends a message.
 * 5. Click the blue "Deploy" button (top right) > "New deployment" (or "Manage deployments" > edit).
 * 6. Select type: "Web app" (click gear icon > Web app).
 * 7. Set:
 *    - Description: "OuterGazers API v2 (UPI Screenshot Support)"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (CRITICAL: this allows the website to POST to it)
 * 8. Click "Deploy", and authorize permissions when prompted (includes Google Drive
 *    permissions to save uploaded payment screenshots).
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
    message: "OuterGazers Google Sheets & Drive API is live and ready for registrations."
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
      const screenshotUrl = handleGameJamRegistration(ss, data);
      if (DISCORD_WEBHOOK_URL) {
        sendDiscordAlert(data, screenshotUrl);
      }
      return jsonResponse({
        status: "success",
        message: "Registration and payment proof logged successfully",
        registrationId: data.registrationId,
        screenshotUrl: screenshotUrl || null
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
  const headers = [
    "Timestamp",
    "Registration ID",
    "Event Title",
    "Team Name",
    "College / Institution",
    "Team Size",
    "Amount (INR)",
    "Payment Status",
    "Transaction UTR / Ref",
    "Payment Screenshot",
    "Leader Name",
    "Leader Email",
    "Leader Phone & Discord",
    "Member 2 (Name & Contacts)",
    "Member 3 (Name & Contacts)",
    "Member 4 (Name & Contacts)"
  ];

  if (!sheet) {
    const allSheets = ss.getSheets();
    if (allSheets.length === 1 && allSheets[0].getLastRow() === 0) {
      sheet = allSheets[0];
      sheet.setName("GameJam_Registrations");
    } else {
      sheet = ss.insertSheet("GameJam_Registrations");
    }
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#00b4d8").setFontColor("#000000");
    sheet.setFrozenRows(1);
  } else {
    // If the sheet exists, check if headers need to be upgraded to include screenshot column
    try {
      const currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
      if (!currentHeaders.includes("Payment Screenshot")) {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#00b4d8").setFontColor("#000000");
      }
    } catch (err) {
      Logger.log("Header check notice: " + err.toString());
    }
  }

  // 1. Save uploaded screenshot image to Google Drive
  let screenshotUrl = "";
  if (data.screenshotBase64) {
    try {
      const folderName = "OuterGazers_GameJam_Screenshots";
      const folders = DriveApp.getFoldersByName(folderName);
      const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

      let base64String = data.screenshotBase64;
      let contentType = "image/jpeg";

      if (base64String.indexOf(",") > -1) {
        const parts = base64String.split(",");
        const match = parts[0].match(/:(.*?);/);
        if (match) contentType = match[1];
        base64String = parts[1];
      }

      const decodedBytes = Utilities.base64Decode(base64String);
      const regId = data.registrationId || ("REG_" + Date.now());
      const teamSafe = (data.teamName || "Team").replace(/[^a-zA-Z0-9_-]/g, "_");
      const fileName = data.screenshotFileName || (regId + "_" + teamSafe + "_payment_proof.jpg");

      const blob = Utilities.newBlob(decodedBytes, contentType, fileName);
      const file = folder.createFile(blob);

      // Make file viewable by anyone with the link so organizers clicking from the sheet can view
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      screenshotUrl = file.getUrl();
    } catch (fileErr) {
      Logger.log("Failed to save screenshot file to Drive: " + fileErr.toString());
      screenshotUrl = "Upload error: " + fileErr.toString();
    }
  }

  const leader = data.leader || {};
  const members = data.members || [];
  const m2 = members[0] || {};
  const m3 = members[1] || {};
  const m4 = members[2] || {};

  function formatMember(m) {
    if (!m || !m.name) return "";
    let str = m.name;
    if (m.phone) str += " | WA: " + m.phone;
    if (m.discordTag) str += " | DC: @" + m.discordTag;
    return str;
  }

  const leaderContact = (leader.phone || "") + (leader.discordTag ? " | DC: @" + leader.discordTag : "");

  // Create clickable hyperlink formula for the spreadsheet if URL exists
  const screenshotCell = (screenshotUrl && screenshotUrl.startsWith("http"))
    ? '=HYPERLINK("' + screenshotUrl + '", "View Screenshot")'
    : (screenshotUrl || "No screenshot uploaded");

  const row = [
    data.submittedAt || new Date().toISOString(),
    data.registrationId || "",
    data.eventTitle || "",
    data.teamName || "",
    data.collegeName || "",
    data.teamSize || "",
    data.totalAmount || "",
    data.paymentStatus || "PENDING_VERIFICATION",
    data.transactionUtr || data.paymentReference || "N/A",
    screenshotCell,
    leader.name || "",
    leader.email || "",
    leaderContact,
    formatMember(m2),
    formatMember(m3),
    formatMember(m4) || "N/A"
  ];

  sheet.appendRow(row);
  return screenshotUrl;
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

  const timestamp = data.submittedAt || new Date().toISOString();
  const name = data.name || "Anonymous";
  const email = data.email || "";
  const subject = data.subject || "Comms Transmission";
  const message = data.message || "";

  sheet.appendRow([
    timestamp,
    name,
    email,
    subject,
    message
  ]);

  // Deliver instant email notification to connect@outergazer.in
  try {
    const toEmail = "connect@outergazer.in";
    MailApp.sendEmail({
      to: toEmail,
      replyTo: email || toEmail,
      subject: `[OuterGazers Comms] ${subject} (from ${name})`,
      body: `New message received from OuterGazers website contact box:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nTime: ${timestamp}\n\nMessage:\n${message}\n\nReply directly to this email to respond to the sender.`,
      htmlBody: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #0d0d0e; color: #f4f4f5; border: 1px solid #27272a; border-radius: 8px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #00b4d8 0%, #7c3aed 100%); padding: 18px 24px;">
            <h1 style="margin: 0; font-size: 18px; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;">
              OuterGazers Studio · Comms Relay
            </h1>
          </div>
          <div style="padding: 24px;">
            <p style="margin: 0 0 16px 0; font-size: 12px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.1em; font-weight: bold;">
              New message received from website contact box
            </p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              <tr style="border-bottom: 1px solid #1f1f23;">
                <td style="padding: 10px 0; color: #71717a; width: 100px; font-weight: 600;">Sender:</td>
                <td style="padding: 10px 0; color: #ffffff; font-weight: bold;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #1f1f23;">
                <td style="padding: 10px 0; color: #71717a; font-weight: 600;">Email:</td>
                <td style="padding: 10px 0;">
                  <a href="mailto:${email}" style="color: #00b4d8; text-decoration: none; font-weight: 500;">${email || "None provided"}</a>
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #1f1f23;">
                <td style="padding: 10px 0; color: #71717a; font-weight: 600;">Subject:</td>
                <td style="padding: 10px 0; color: #ffffff;">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #71717a; font-weight: 600;">Received:</td>
                <td style="padding: 10px 0; color: #a1a1aa;">${timestamp}</td>
              </tr>
            </table>

            <div style="background-color: #18181b; border-left: 4px solid #00b4d8; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #00b4d8; font-weight: bold;">Message Content:</p>
              <p style="margin: 0; color: #f4f4f5; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>

            <p style="font-size: 12px; color: #71717a; margin: 0; padding-top: 16px; border-top: 1px solid #1f1f23;">
              💡 You can click <strong>Reply</strong> in your email client to directly reply to <a href="mailto:${email}" style="color: #00b4d8;">${email}</a>.
            </p>
          </div>
        </div>
      `
    });
  } catch (err) {
    Logger.log("Failed to send email to connect@outergazer.in via MailApp: " + err.toString());
  }
}

function sendDiscordAlert(data, screenshotUrl) {
  try {
    const leader = data.leader || {};
    const members = data.members || [];
    const m2 = members[0] || {};
    const m3 = members[1] || {};
    const m4 = members[2] || {};

    const rosterLines = [
      "1. **" + (leader.name || "Leader") + "** (Leader) · WA: " + (leader.phone || "N/A") + (leader.discordTag ? " · DC: @" + leader.discordTag : ""),
      m2.name ? "2. **" + m2.name + "** · WA: " + (m2.phone || "N/A") + (m2.discordTag ? " · DC: @" + m2.discordTag : "") : null,
      m3.name ? "3. **" + m3.name + "** · WA: " + (m3.phone || "N/A") + (m3.discordTag ? " · DC: @" + m3.discordTag : "") : null,
      m4.name ? "4. **" + m4.name + "** · WA: " + (m4.phone || "N/A") + (m4.discordTag ? " · DC: @" + m4.discordTag : "") : null
    ].filter(Boolean).join("\n");

    const fields = [
      { name: "Team Size", value: String(data.teamSize) + " Gazers", inline: true },
      { name: "Amount Due", value: "₹" + data.totalAmount + " (" + (data.paymentStatus || "PENDING_VERIFICATION") + ")", inline: true },
      { name: "Transaction UTR / Ref", value: data.transactionUtr || "Pending Manual Review", inline: true },
      { name: "Leader Contact", value: (leader.email || "") + " | WA: " + (leader.phone || "") + (leader.discordTag ? " | DC: @" + leader.discordTag : ""), inline: false },
      { name: "Squad Roster Contacts", value: rosterLines, inline: false }
    ];

    if (screenshotUrl && screenshotUrl.startsWith("http")) {
      fields.push({
        name: "Payment Proof Screenshot",
        value: "[Click to View Payment Screenshot in Google Drive](" + screenshotUrl + ")",
        inline: false
      });
    }

    const payload = {
      content: "🚀 **NEW GAME JAM REGISTRATION RECEIVED (UPI PAYMENT PROOF ATTACHED)!**",
      embeds: [
        {
          title: "Team: " + data.teamName,
          description: "Registered for **" + data.eventTitle + "**\nCollege: *" + (data.collegeName || "N/A") + "*",
          color: 46376, // #00b4d8 cyan
          fields: fields,
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
