const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const env = require("./env");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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

async function saveToS3(file) {
  const filename = createFilename(file.originalname);
  const key = `reports/${filename}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return {
    key,
    publicUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
  };
}

async function saveReportPhoto(file) {
  if (!file) {
    return { key: null, publicUrl: null };
  }

  if (env.storageDriver === "local") {
    return saveToLocal(file);
  }

  if (env.storageDriver === "s3") {
    return saveToS3(file);
  }

  throw new Error("Invalid STORAGE_DRIVER");
}

module.exports = {
  saveReportPhoto,
};