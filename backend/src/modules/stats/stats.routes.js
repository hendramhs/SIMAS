const express = require("express");
const { getDiseaseStats } = require("./stats.controller");

const router = express.Router();

router.get("/", getDiseaseStats);

module.exports = router;
