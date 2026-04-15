CREATE DATABASE IF NOT EXISTS healthtrack;
USE healthtrack;

CREATE TABLE IF NOT EXISTS diseases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS master_locations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  city_code VARCHAR(20) NOT NULL,
  city_name VARCHAR(120) NOT NULL,
  area_code VARCHAR(30) NOT NULL,
  area_name VARCHAR(120) NOT NULL,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_master_locations_area_code (area_code),
  INDEX idx_master_locations_city_code (city_code),
  INDEX idx_master_locations_city_area (city_code, area_name)
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
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
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
