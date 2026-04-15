USE healthtrack;

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

INSERT INTO master_locations (
  city_code,
  city_name,
  area_code,
  area_name,
  latitude,
  longitude
)
VALUES
  ('31.74', 'Jakarta Selatan', '31.74.01', 'Kebayoran Baru', -6.2440000, 106.8000000),
  ('31.74', 'Jakarta Selatan', '31.74.02', 'Kebayoran Lama', -6.2523000, 106.7811000),
  ('31.74', 'Jakarta Selatan', '31.74.03', 'Pancoran', -6.2557000, 106.8421000),
  ('31.74', 'Jakarta Selatan', '31.74.04', 'Mampang Prapatan', -6.2449000, 106.8232000),
  ('31.74', 'Jakarta Selatan', '31.74.05', 'Pasar Minggu', -6.2841000, 106.8397000),
  ('31.74', 'Jakarta Selatan', '31.74.06', 'Jagakarsa', -6.3348000, 106.8167000),
  ('31.74', 'Jakarta Selatan', '31.74.07', 'Cilandak', -6.2903000, 106.7993000),
  ('31.74', 'Jakarta Selatan', '31.74.08', 'Tebet', -6.2247000, 106.8557000),
  ('31.74', 'Jakarta Selatan', '31.74.09', 'Setiabudi', -6.2083000, 106.8339000),
  ('31.74', 'Jakarta Selatan', '31.74.10', 'Pesanggrahan', -6.2477000, 106.7609000)
ON DUPLICATE KEY UPDATE
  city_name = VALUES(city_name),
  area_name = VALUES(area_name),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude);
