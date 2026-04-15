const provinceCentroids = {
  11: [5.55, 95.32],
  12: [2.12, 99.55],
  13: [-0.95, 100.35],
  14: [0.51, 101.45],
  15: [-1.59, 103.61],
  16: [-3.32, 102.87],
  17: [-3.8, 102.27],
  18: [-5.45, 105.26],
  19: [-2.13, 106.11],
  21: [1.05, 104.03],
  31: [-6.2, 106.82],
  32: [-6.91, 107.61],
  33: [-7.0, 110.43],
  34: [-7.8, 110.37],
  35: [-7.25, 112.75],
  36: [-6.12, 106.15],
  51: [-8.65, 115.22],
  52: [-8.58, 116.1],
  53: [-10.18, 123.58],
  61: [-0.02, 109.34],
  62: [-2.21, 113.92],
  63: [-3.32, 114.59],
  64: [-0.5, 117.15],
  65: [2.84, 117.37],
  71: [1.49, 124.84],
  72: [-0.9, 119.87],
  73: [-5.14, 119.41],
  74: [-3.99, 122.52],
  75: [0.54, 123.06],
  76: [-2.68, 118.89],
  81: [-3.7, 128.17],
  82: [0.79, 127.38],
  91: [-2.53, 140.72],
  92: [-0.87, 134.08],
};

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export function resolveReportCoordinates(report, index = 0) {
  const latCandidate =
    toNumber(report.latitude) ??
    toNumber(report.lat) ??
    toNumber(report.lintang);
  const lngCandidate =
    toNumber(report.longitude) ??
    toNumber(report.lng) ??
    toNumber(report.bujur);

  if (latCandidate !== null && lngCandidate !== null) {
    return [latCandidate, lngCandidate];
  }

  const wilayahCode = String(report.wilayah_code || "");
  const provinceCode = wilayahCode.slice(0, 2);
  const centroid = provinceCentroids[provinceCode];

  if (!centroid) {
    return null;
  }

  const spread = ((index % 6) - 3) * 0.01;
  return [centroid[0] + spread, centroid[1] - spread];
}
