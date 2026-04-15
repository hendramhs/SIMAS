const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const env = require("./env");

async function ensureDirExists(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

function createFilename(originalName) {
  const ext = path.extname(originalName || "").toLowerCase();
  const safeExt = ext || ".jpg";
  return `${Date.now()}-${crypto.randomUUID()}${safeExt}`;
}

async function saveToLocal(file) {
  const reportsDir = path.join(env.uploadDir, "reports");
  await ensureDirExists(reportsDir);

  const filename = createFilename(file.originalname);
  const absolutePath = path.join(reportsDir, filename);
  await fs.writeFile(absolutePath, file.buffer);

  return {
    key: `reports/${filename}`,
    publicUrl: `/uploads/reports/${filename}`,
  };
}

async function saveReportPhoto(file) {
  if (!file) {
    return { key: null, publicUrl: null };
  }

  if (env.storageDriver === "local") {
    return saveToLocal(file);
  }

  throw new Error(
    "S3 storage is not enabled yet. Set STORAGE_DRIVER=local for MVP.",
  );
}

module.exports = {
  saveReportPhoto,
};
