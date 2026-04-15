const path = require("path");

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toInt(process.env.PORT, 5000),
  appOrigin: process.env.APP_ORIGIN || "http://localhost:5173",
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: toInt(process.env.DB_PORT, 3306),
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "",
  dbName: process.env.DB_NAME || "healthtrack",
  storageDriver: process.env.STORAGE_DRIVER || "local",
  uploadDir: path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads"),
  maxUploadSizeBytes: toInt(process.env.MAX_UPLOAD_SIZE_MB, 5) * 1024 * 1024,
};

module.exports = env;
