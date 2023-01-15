const log = (...args) => {
  if (process.env.SANITY_CHECK_LOGGING === "true")
    console.log(`[sanity-check]`, ...args);
};

module.exports = {
  log,
};
