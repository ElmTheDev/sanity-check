const { log } = require("./logger");

if (process.env.SANITY_CHECK_EXPRESS === "true") {
  const express = require("express");

  const app = express();

  app.get("/", (req, res) => {
    // Check if request is authorized
    if (
      process.env.SANITY_CHECK_EXPRESS_AUTHORIZATION &&
      process.env.SANITY_CHECK_EXPRESS_AUTHORIZATION !==
        req.header("x-authorization")
    ) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    if (typeof process.__sanity === "undefined") {
      return res.status(501).json({
        success: false,
        msg: "Sanity check is not initialized",
      });
    }

    if (!process.__sanity.is_sane) {
      res.status(422);
    }

    res.json(process.__sanity);
  });

  app.listen(
    process.env.SANITY_CHECK_EXPRESS_PORT || 25022,
    process.env.SANITY_CHECK_EXPRESS_HOST || "0.0.0.0",
    () => {
      log(`Express server started`);
    }
  );
}
