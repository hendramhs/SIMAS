function toNullableInt(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function toNullableFloat(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
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
  const latitude = toNullableFloat(body.latitude);
  const longitude = toNullableFloat(body.longitude);

  if (kasusBaru < 0 || kasusMeninggal < 0) {
    errors.push("kasus_baru and kasus_meninggal must be >= 0");
  }

  if (
    body.latitude !== undefined &&
    body.latitude !== "" &&
    latitude === null
  ) {
    errors.push("latitude must be a valid number");
  }

  if (
    body.longitude !== undefined &&
    body.longitude !== "" &&
    longitude === null
  ) {
    errors.push("longitude must be a valid number");
  }

  if (latitude !== null && (latitude < -90 || latitude > 90)) {
    errors.push("latitude must be between -90 and 90");
  }

  if (longitude !== null && (longitude < -180 || longitude > 180)) {
    errors.push("longitude must be between -180 and 180");
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
      latitude,
      longitude,
    },
  };
}

module.exports = {
  toNullableInt,
  toNullableFloat,
  validateCreateReportPayload,
};
