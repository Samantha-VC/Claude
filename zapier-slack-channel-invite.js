// Zapier Code Action (JavaScript): Add a user to a private Slack channel
//
// Setup in Zapier:
// 1. Add a "Code by Zapier" action (choose "Run JavaScript")
// 2. Set up these Input Data fields (left panel):
//      slack_token    → Your Slack User Token (xoxp-...)
//      user_id        → The Slack User ID (e.g. U01ABCDEF)
//      channel_name   → The Slack channel name (from Airtable)
// 3. Paste this script
//
// Requirements:
// - The Slack User Token must have groups:read and groups:write scopes
// - You must be a member of the private channel

const slackToken = inputData.slack_token;
const userId = inputData.user_id;
const channelName = inputData.channel_name.replace(/^#/, "").trim();

// Step 1: Look up the channel ID from the channel name
let channelId = null;
let cursor = "";

while (!channelId) {
    const listUrl = `https://slack.com/api/conversations.list?types=private_channel&limit=200${cursor ? `&cursor=${cursor}` : ""}`;
    const listResponse = await fetch(listUrl, {
        headers: { "Authorization": `Bearer ${slackToken}` },
    });
    const listResult = await listResponse.json();

    if (!listResult.ok) {
        throw new Error(`Slack API error listing channels: ${listResult.error}`);
    }

    const match = listResult.channels.find(c => c.name === channelName);
    if (match) {
        channelId = match.id;
        break;
    }

    cursor = listResult.response_metadata?.next_cursor;
    if (!cursor) break;
}

if (!channelId) {
    throw new Error(`Channel "${channelName}" not found. Make sure the name is correct and you are a member.`);
}

console.log(`Resolved channel "${channelName}" to ID: ${channelId}`);

// Step 2: Invite the user to the channel
const response = await fetch("https://slack.com/api/conversations.invite", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${slackToken}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        channel: channelId,
        users: userId,
    }),
});

const result = await response.json();

if (result.ok) {
    output = { status: "success", message: `User ${userId} added to #${channelName} (${channelId})` };
} else if (result.error === "already_in_channel") {
    output = { status: "skipped", message: `User ${userId} is already in #${channelName}` };
} else {
    throw new Error(`Slack API error: ${result.error}`);
}
