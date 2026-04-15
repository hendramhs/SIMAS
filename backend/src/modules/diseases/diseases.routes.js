const express = require("express");
const pool = require("../../config/db");

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, code FROM diseases ORDER BY name ASC",
    );

    res.json({ data: rows });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
