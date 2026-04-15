const multer = require("multer");
const env = require("../config/env");

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.maxUploadSizeBytes,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new Error("Only JPG, PNG, and WEBP images are allowed."));
      return;
    }

    cb(null, true);
  },
});

const uploadReportPhoto = upload.single("photo");

module.exports = {
  uploadReportPhoto,
};
