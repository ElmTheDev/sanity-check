require("dotenv").config();
require("./src/express");

const { SendWebhookDiscord, SendWebhookSlack } = require("./src/webhooks");
const { log } = require("./src/logger");

let sanityCheckInterval;
let sanityCheckIntervalTime = 1000;

// Inject sanity check globals
const inject = () => {
  process.__sanity = {
    is_sane: true,
    checks: [],
    errors: [],
    alerts: [],
    last_check: null,
  };
};

const sendAlert = (name, error, stack, timestamp) => {
  if (!process.__sanity) inject();
  if (!process.__sanity.alerts.length) return;

  for (const alert of process.__sanity.alerts) {
    if (alert.webhook.includes("discord")) {
      SendWebhookDiscord(name, error, stack, timestamp, alert.webhook);
    } else {
      SendWebhookSlack(name, error, stack, timestamp, alert.webhook);
    }
  }
};

/**
 * Add a sanity check
 * @param {string} name - Name of the sanity check
 * @param {Function} check - Function that returns an array of [is_success (Bool), error (Message | null if success)]
 */
const AddSanityCheck = (name, check) => {
  if (!process.__sanity) inject();

  if (process.__sanity.checks.find((c) => c.name === name)) {
    throw new Error(`Sanity check with name ${name} already exists`);
  }

  process.__sanity.checks.push({
    name,
    check,
  });
};

/**
 * Add new alert that will trigger when sanity check fails
 * @param {string} name - Name of the alert
 * @param {string} webhook - Webhook to send the alert to (Supported: Discord, Slack)
 */
const AddAlert = (name, webhook) => {
  if (!process.__sanity) inject();

  if (process.__sanity.alerts.find((a) => a.name === name)) {
    throw new Error(`Alert with name "${name}" already exists`);
  }

  process.__sanity.alerts.push({
    name,
    webhook,
  });
};

/**
 * Start Sanity Checking logic
 * @param {number} interval Optional - How often should sanity check run, in milliseconds
 * @returns {void}
 */
const StartSanityChecks = (interval = 1000) => {
  if (sanityCheckInterval) return;

  inject();

  sanityCheckIntervalTime = interval;

  sanityCheckInterval = setInterval(async () => {
    let didGoInsane = false;

    for (let check of process.__sanity.checks) {
      try {
        const [is_success, error] = await check.check();

        if (!is_success) {
          didGoInsane = true;
          log(`Sanity check "${check.name}" failed`);
          process.__sanity.errors.push({
            name: check.name,
            error,
            timestamp: new Date(),
          });

          sendAlert(check.name, error, undefined, new Date());
        }
      } catch (err) {
        didGoInsane = true;
        log(`Sanity check "${check.name}" failed with error: ${err.message}`);
        process.__sanity.errors.push({
          name: check.name,
          error: `Error during sanity check`,
          stack: err.stack,
          timestamp: new Date(),
        });

        sendAlert(check.name, err.message, err.stack, new Date());
      }
    }

    if (didGoInsane) {
      process.__sanity.is_sane = false;
    } else {
      process.__sanity.is_sane = true;
      process.__sanity.errors = [];
      log(`Sanity checks passed`);
    }

    process.__sanity.last_check = new Date();
  }, sanityCheckIntervalTime);
};

/**
 * Stop sanity checking
 */
const StopSanityChecks = () => {
  clearInterval(sanityCheckInterval);
  sanityCheckInterval = null;
  delete process.__sanity;
};

module.exports = {
  AddSanityCheck,
  StopSanityChecks,
  StartSanityChecks,
  AddAlert,
};
