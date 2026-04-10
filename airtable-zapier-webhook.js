// Airtable Automation Script: Send record data to Zapier webhook
//
// Setup:
// 1. Create an Automation with a trigger (e.g. "When record matches conditions")
// 2. Add a "Run a script" action
// 3. Paste this script into the script action
// 4. In the left panel, add these Input Variables and map them to the trigger record:
//      full_name    → Full Name
//      email        → Email
//      ads          → Ads
//      ads_status   → Ads Status
//      slack_channel → Slack Channel

const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/16798417/u7r7q4l/";

let config = input.config();

let payload = {
    full_name: (config.full_name || "").trim(),
    email: (config.email || "").trim(),
    ads: (config.ads || "").trim(),
    ads_status: (config.ads_status || "").trim(),
    slack_channel: (config.slack_channel || "").trim(),
};

console.log("Payload being sent:");
console.log(JSON.stringify(payload, null, 2));

let params = new URLSearchParams(payload);

let response = await fetch(ZAPIER_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
});

let responseBody = await response.text();
console.log(`Status: ${response.status}`);
console.log(`Response body: ${responseBody}`);
