// Zapier Code Action (JavaScript): Add a user to a private Slack channel
//
// Setup in Zapier:
// 1. Add a "Code by Zapier" action (choose "Run JavaScript")
// 2. Set up these Input Data fields (left panel):
//      slack_token   → Your Slack Bot Token (xoxb-...)
//      user_id       → The Slack User ID (e.g. U01ABCDEF)
//      channel_id    → The Slack Channel ID (e.g. C01ABCDEF)
// 3. Paste this script
//
// Requirements:
// - The Slack Bot Token must have the "groups:write" scope
// - The bot must already be a member of the private channel

const slackToken = inputData.slack_token;
const channelId = inputData.channel_id;
const userId = inputData.user_id;

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
    output = { status: "success", message: `User ${userId} added to channel ${channelId}` };
} else if (result.error === "already_in_channel") {
    output = { status: "skipped", message: `User ${userId} is already in channel ${channelId}` };
} else {
    throw new Error(`Slack API error: ${result.error}`);
}
