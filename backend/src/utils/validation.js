function toNullableInt(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function validateCreateReportPayload(body) {
  const errors = [];

  if (!body.disease_id) {
    errors.push("disease_id is required");
  }

  if (!body.wilayah_code) {
    errors.push("wilayah_code is required");
  }

  if (!body.deskripsi) {
    errors.push("deskripsi is required");
  }

  const diseaseId = toNullableInt(body.disease_id);
  if (!diseaseId) {
    errors.push("disease_id must be a valid integer");
  }

  const kasusBaru = toNullableInt(body.kasus_baru) ?? 0;
  const kasusMeninggal = toNullableInt(body.kasus_meninggal) ?? 0;

  if (kasusBaru < 0 || kasusMeninggal < 0) {
    errors.push("kasus_baru and kasus_meninggal must be >= 0");
  }

  return {
    errors,
    value: {
      diseaseId,
      wilayahCode: String(body.wilayah_code || "").trim(),
      wilayahLabel: String(body.wilayah_label || "").trim() || null,
      lokasiDetail: String(body.lokasi_detail || "").trim() || null,
      deskripsi: String(body.deskripsi || "").trim(),
      kasusBaru,
      kasusMeninggal,
    },
  };
}

module.exports = {
  toNullableInt,
  validateCreateReportPayload,
};
