USE healthtrack;

ALTER TABLE reports
  ADD COLUMN latitude DECIMAL(10,7) NULL AFTER kasus_meninggal,
  ADD COLUMN longitude DECIMAL(10,7) NULL AFTER latitude;
