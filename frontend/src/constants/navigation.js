export const pages = {
  report: {
    title: "Form Laporan Kasus",
    subtitle:
      "Input laporan kasus baru dari lapangan secara cepat dan terstruktur.",
  },
  monitoring: {
    title: "Monitoring Laporan",
    subtitle: "Pantau data kasus dengan filter wilayah dan jenis penyakit.",
  },
  stats: {
    title: "Statistik Penyakit",
    subtitle: "Analitik ringkas jumlah kasus berdasarkan laporan masuk.",
  },
};

export const navItems = [
  { key: "report", label: "Laporan" },
  { key: "monitoring", label: "Monitoring" },
  { key: "stats", label: "Statistik" },
];

export const pagePaths = {
  report: "/laporan",
  monitoring: "/monitoring",
  stats: "/statistik",
};

export function getPageFromPath(pathname) {
  const path = String(pathname || "").toLowerCase();

  if (path.includes("stat")) {
    return "stats";
  }

  if (path.includes("monitor")) {
    return "monitoring";
  }

  if (path.includes("lapor")) {
    return "report";
  }

  return "report";
}
