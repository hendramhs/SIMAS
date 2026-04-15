CREATE DATABASE IF NOT EXISTS healthtrack;
USE healthtrack;

CREATE TABLE IF NOT EXISTS diseases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  disease_id INT NOT NULL,
  wilayah_code VARCHAR(20) NOT NULL,
  wilayah_label VARCHAR(120) NULL,
  lokasi_detail VARCHAR(255) NULL,
  deskripsi TEXT NOT NULL,
  kasus_baru INT NOT NULL DEFAULT 0,
  kasus_meninggal INT NOT NULL DEFAULT 0,
  photo_url VARCHAR(255) NULL,
  reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reports_disease
    FOREIGN KEY (disease_id)
    REFERENCES diseases (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  INDEX idx_reports_wilayah_code (wilayah_code),
  INDEX idx_reports_disease_id (disease_id),
  INDEX idx_reports_reported_at (reported_at),
  INDEX idx_reports_wilayah_disease_date (wilayah_code, disease_id, reported_at)
);
