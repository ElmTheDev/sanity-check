const { EmbedBuilder } = require("@discordjs/builders");
const { IncomingWebhook } = require("@slack/webhook");
const { WebhookClient } = require("discord.js");

const SendWebhookDiscord = (name, error, stack, timestamp, webhook_url) => {
  if (!webhook_url) return;

  const embed = new EmbedBuilder();

  embed.setTitle(`Sanity check "${name}" failed`);
  embed.setDescription(`Message: ${error}\n\nStack: \n${stack || "N/A"}`);
  embed.setTimestamp(timestamp);
  embed.setColor(0xff0000);

  const split = webhook_url.split("/");
  const id = split[split.length - 2];
  const token = split[split.length - 1];

  const client = new WebhookClient({
    id,
    token,
  });

  client.send({
    embeds: [embed],
  });
};

const SendWebhookSlack = (name, error, stack, timestamp, webhook_url) => {
  if (!webhook_url) return;

  const webhook = new IncomingWebhook(webhook_url);

  webhook.send({
    text: `Sanity check "${name}" failed\n\nMessage: ${error}\n\nStack: \n${
      stack || "N/A"
    }`,
    username: "Sanity Check Alerts",
  });
};

module.exports = {
  SendWebhookDiscord,
  SendWebhookSlack,
};
