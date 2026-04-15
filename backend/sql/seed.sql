USE healthtrack;

INSERT INTO diseases (name, code)
VALUES
  ('Demam Berdarah Dengue', 'DBD'),
  ('Malaria', 'MAL'),
  ('Tuberkulosis', 'TBC'),
  ('COVID-19', 'CVD'),
  ('Tifoid', 'TFD')
ON DUPLICATE KEY UPDATE
  name = VALUES(name);
