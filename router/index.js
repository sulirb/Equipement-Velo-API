const express = require("express");

const router = express.Router();

router.use("/articles", require("../api/articles/index.js"));
router.use("/articles/latest", require("../api/articles/index.js"));
router.use("/article/:id", require("../api/articles/[id]/index.js"));
router.use("/auth/login", require("../api/auth/login.js"));
router.use("/auth/signup", require("../api/auth/signup.js"));
router.use("/images", require("../api/images/index.js"));

module.exports = router;
