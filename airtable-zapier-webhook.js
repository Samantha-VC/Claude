// Airtable Scripting Extension: Send record data to Zapier webhook
//
// Setup:
// 1. Replace ZAPIER_WEBHOOK_URL with your actual Zapier webhook URL
// 2. Update TABLE_NAME to match your Airtable table name
// 3. Add this script in Airtable via Extensions > Scripting
//
// Field mapping (update field names if yours differ):
//   "Full Name"    - text string
//   "Email"        - email
//   "Ads"          - text string
//   "Ads Status"   - text string
//   "Slack Channel" - text string

const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/16798417/u7r7q4l/";
const TABLE_NAME = "Clients";

// ---------------------------------------------------------------------------

let table = base.getTable(TABLE_NAME);

// Prompt the user to pick which record to send
let record = await input.recordAsync("Select a record to send to Zapier", table);

if (!record) {
    output.text("No record selected. Exiting.");
} else {
    let payload = {
        full_name: record.getCellValueAsString("Full Name"),
        email: record.getCellValueAsString("Email"),
        ads: record.getCellValueAsString("Ads"),
        ads_status: record.getCellValueAsString("Ads Status"),
        slack_channel: record.getCellValueAsString("Slack Channel"),
    };

    output.text(`Sending data for: ${payload.full_name}`);
    output.table(payload);

    let response = await fetch(ZAPIER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (response.ok) {
        output.text(`Success! Zapier responded with status ${response.status}.`);
    } else {
        output.text(`Error: Zapier responded with status ${response.status}.`);
    }
}
