const { StartSanityChecks, AddSanityCheck, AddAlert } = require("./");

StartSanityChecks();

AddSanityCheck("memory", () => {
  const formatMemoryUsage = (data) =>
    `${Math.round((data / 1024 / 1024) * 100) / 100}`;

  const memoryUsage = process.memoryUsage();

  // Check if memory usage is over 100MB
  if (parseFloat(formatMemoryUsage(memoryUsage.heapUsed)) > 100) {
    return [
      false,
      `Exceeded memory limit. Current usage: ${formatMemoryUsage(
        memoryUsage.heapUsed
      )}MB`,
    ];
  }

  return [true, null];
});

AddAlert(
  `Test`,
  "https://canary.discord.com/api/webhooks/DISCORD_WH_ID/DISCORD_WH_TOKEN"
);

console.log("Hello world", process.__sanity);
