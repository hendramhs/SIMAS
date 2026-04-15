const pool = require("../../config/db");

async function getDiseaseStats(req, res, next) {
  try {
    const whereClauses = [];
    const whereValues = [];

    if (req.query.wilayah_code) {
      whereClauses.push("r.wilayah_code = ?");
      whereValues.push(req.query.wilayah_code);
    }

    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `SELECT
        d.id AS disease_id,
        d.name AS disease_name,
        d.code AS disease_code,
        COUNT(r.id) AS total_reports,
        COALESCE(SUM(r.kasus_baru), 0) AS total_kasus_baru,
        COALESCE(SUM(r.kasus_meninggal), 0) AS total_kasus_meninggal,
        MAX(r.reported_at) AS last_reported_at
      FROM diseases d
      LEFT JOIN reports r ON r.disease_id = d.id
      ${whereSql}
      GROUP BY d.id, d.name, d.code
      ORDER BY total_kasus_baru DESC, d.name ASC`,
      whereValues,
    );

    res.json({ data: rows });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDiseaseStats,
};
