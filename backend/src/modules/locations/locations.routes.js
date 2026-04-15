const express = require("express");
const pool = require("../../config/db");

const router = express.Router();

router.get("/cities", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT city_code, city_name, COUNT(*) AS total_areas
       FROM master_locations
       GROUP BY city_code, city_name
       ORDER BY city_name ASC`,
    );

    res.json({ data: rows });
  } catch (error) {
    next(error);
  }
});

router.get("/areas", async (req, res, next) => {
  try {
    const cityCode = String(req.query.city_code || "").trim();

    if (!cityCode) {
      res.status(400).json({ message: "city_code is required" });
      return;
    }

    const [rows] = await pool.query(
      `SELECT
        area_code,
        area_name,
        city_code,
        city_name,
        latitude,
        longitude
      FROM master_locations
      WHERE city_code = ?
      ORDER BY area_name ASC`,
      [cityCode],
    );

    res.json({ data: rows });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
