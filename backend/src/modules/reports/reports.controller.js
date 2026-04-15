const pool = require("../../config/db");
const { saveReportPhoto } = require("../../config/storage");
const {
  toNullableInt,
  validateCreateReportPayload,
} = require("../../utils/validation");

async function createReport(req, res, next) {
  try {
    const { errors, value } = validateCreateReportPayload(req.body);
    if (errors.length > 0) {
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    const uploadResult = await saveReportPhoto(req.file);

    const [result] = await pool.query(
      `INSERT INTO reports (
        disease_id,
        wilayah_code,
        wilayah_label,
        lokasi_detail,
        deskripsi,
        kasus_baru,
        kasus_meninggal,
        latitude,
        longitude,
        photo_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        value.diseaseId,
        value.wilayahCode,
        value.wilayahLabel,
        value.lokasiDetail,
        value.deskripsi,
        value.kasusBaru,
        value.kasusMeninggal,
        value.latitude,
        value.longitude,
        uploadResult.publicUrl,
      ],
    );

    res.status(201).json({
      message: "Report created",
      data: {
        id: result.insertId,
        photo_url: uploadResult.publicUrl,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function listReports(req, res, next) {
  try {
    const page = Math.max(toNullableInt(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(toNullableInt(req.query.limit) || 20, 1),
      100,
    );
    const offset = (page - 1) * limit;

    const whereClauses = [];
    const whereValues = [];

    if (req.query.wilayah_code) {
      whereClauses.push("r.wilayah_code = ?");
      whereValues.push(req.query.wilayah_code);
    }

    if (req.query.disease_id) {
      const diseaseId = toNullableInt(req.query.disease_id);
      if (!diseaseId) {
        res.status(400).json({ message: "disease_id must be a valid integer" });
        return;
      }
      whereClauses.push("r.disease_id = ?");
      whereValues.push(diseaseId);
    }

    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `SELECT
        r.id,
        r.wilayah_code,
        r.wilayah_label,
        r.lokasi_detail,
        r.deskripsi,
        r.kasus_baru,
        r.kasus_meninggal,
        r.latitude,
        r.longitude,
        r.photo_url,
        r.reported_at,
        d.id AS disease_id,
        d.name AS disease_name,
        d.code AS disease_code
      FROM reports r
      INNER JOIN diseases d ON d.id = r.disease_id
      ${whereSql}
      ORDER BY r.reported_at DESC
      LIMIT ? OFFSET ?`,
      [...whereValues, limit, offset],
    );

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total
      FROM reports r
      ${whereSql}`,
      whereValues,
    );

    res.json({
      data: rows,
      meta: {
        page,
        limit,
        total: countRows[0].total,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getReportById(req, res, next) {
  try {
    const id = toNullableInt(req.params.id);
    if (!id) {
      res.status(400).json({ message: "id must be a valid integer" });
      return;
    }

    const [rows] = await pool.query(
      `SELECT
        r.id,
        r.wilayah_code,
        r.wilayah_label,
        r.lokasi_detail,
        r.deskripsi,
        r.kasus_baru,
        r.kasus_meninggal,
        r.latitude,
        r.longitude,
        r.photo_url,
        r.reported_at,
        d.id AS disease_id,
        d.name AS disease_name,
        d.code AS disease_code
      FROM reports r
      INNER JOIN diseases d ON d.id = r.disease_id
      WHERE r.id = ?`,
      [id],
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Report not found" });
      return;
    }

    res.json({ data: rows[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createReport,
  listReports,
  getReportById,
};
