const express = require("express");
const { uploadReportPhoto } = require("../../middleware/upload");
const {
  createReport,
  listReports,
  getReportById,
} = require("./reports.controller");

const router = express.Router();

router.post("/", uploadReportPhoto, createReport);
router.get("/", listReports);
router.get("/:id", getReportById);

module.exports = router;
