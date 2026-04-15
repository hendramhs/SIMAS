import { useEffect, useMemo, useState } from "react";
import ReportForm from "./components/ReportForm";
import ReportList from "./components/ReportList";
import StatsPanel from "./components/StatsPanel";
import { fetchDiseases, fetchReports, fetchStats } from "./services/api";

const pages = {
  report: {
    title: "Form Laporan",
    subtitle: "Input laporan kasus baru dari lapangan.",
  },
  monitoring: {
    title: "Monitoring Laporan",
    subtitle: "Pantau data laporan dengan filter wilayah dan penyakit.",
  },
  stats: {
    title: "Statistik Penyakit",
    subtitle: "Lihat ringkasan jumlah kasus per penyakit.",
  },
};

function App() {
  const [activePage, setActivePage] = useState("report");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [diseases, setDiseases] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState([]);
  const [filters, setFilters] = useState({ wilayah_code: "", disease_id: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(
    () => ({
      wilayah_code: filters.wilayah_code,
      disease_id: filters.disease_id,
      limit: 50,
      page: 1,
    }),
    [filters],
  );

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [diseaseRes, reportRes, statsRes] = await Promise.all([
        fetchDiseases(),
        fetchReports(query),
        fetchStats({ wilayah_code: filters.wilayah_code }),
      ]);

      setDiseases(diseaseRes.data || []);
      setReports(reportRes.data || []);
      setStats(statsRes.data || []);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [query]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const currentPage = pages[activePage];

  return (
    <main
      className={
        sidebarOpen ? "app-shell sidebar-open" : "app-shell sidebar-closed"
      }
    >
      <aside className={sidebarOpen ? "sidebar open" : "sidebar closed"}>
        <div className="sidebar-brand">
          <h1>HealthTrack</h1>
          <p>Dashboard pelaporan penyakit</p>
        </div>

        <nav className="sidebar-nav" aria-label="Navigasi halaman">
          <button
            type="button"
            className={activePage === "report" ? "nav-link active" : "nav-link"}
            onClick={() => handleNavigate("report")}
          >
            Form Laporan
          </button>
          <button
            type="button"
            className={
              activePage === "monitoring" ? "nav-link active" : "nav-link"
            }
            onClick={() => handleNavigate("monitoring")}
          >
            Monitoring
          </button>
          <button
            type="button"
            className={activePage === "stats" ? "nav-link active" : "nav-link"}
            onClick={() => handleNavigate("stats")}
          >
            Statistik
          </button>
        </nav>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Tutup sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <section className="content-area">
        <div className="content-topbar">
          <button
            type="button"
            className={sidebarOpen ? "sidebar-toggle open" : "sidebar-toggle"}
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
          >
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </button>
        </div>

        <header className="hero">
          <h2>{currentPage.title}</h2>
          <p>{currentPage.subtitle}</p>
        </header>

        {error && <p className="error">{error}</p>}
        {loading && <p className="loading">Memuat data...</p>}

        {activePage === "report" && (
          <ReportForm diseases={diseases} onSuccess={loadData} />
        )}
        {activePage === "monitoring" && (
          <ReportList
            reports={reports}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        )}
        {activePage === "stats" && <StatsPanel stats={stats} />}
      </section>
    </main>
  );
}

export default App;
