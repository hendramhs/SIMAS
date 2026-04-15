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

const pagePaths = {
  report: "/laporan",
  monitoring: "/monitoring",
  stats: "/statistik",
};

function getPageFromPath(pathname) {
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

function App() {
  const [activePage, setActivePage] = useState(() =>
    typeof window !== "undefined"
      ? getPageFromPath(window.location.pathname)
      : "report",
  );
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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handlePopState = () => {
      setActivePage(getPageFromPath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleNavigate = (page) => {
    setActivePage(page);

    if (typeof window !== "undefined") {
      const nextPath = pagePaths[page] || "/laporan";
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, "", nextPath);
      }
    }

    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const currentPage = pages[activePage];

  return (
    <main
      className={`min-h-screen transition-[grid-template-columns] duration-200 md:grid ${
        sidebarOpen ? "md:grid-cols-[280px_1fr]" : "md:grid-cols-[0_1fr]"
      }`}
    >
      <aside
        className={`h-screen overflow-hidden border-r border-slate-800 bg-sidebar px-[18px] py-6 text-sideink transition-all duration-200 max-md:fixed max-md:left-0 max-md:top-0 max-md:z-30 max-md:w-[260px] ${
          sidebarOpen
            ? "opacity-100 max-md:translate-x-0"
            : "pointer-events-none px-0 opacity-0 max-md:-translate-x-full max-md:px-[18px]"
        }`}
      >
        <div>
          <h1 className="m-0 text-[1.8rem] font-semibold leading-none tracking-[-0.02em]">
            HealthTrack
          </h1>
          <p className="mt-2 text-sm text-sidemuted">
            Dashboard pelaporan penyakit
          </p>
        </div>

        <nav
          className="mt-[22px] grid gap-2 max-md:grid-cols-3"
          aria-label="Navigasi halaman"
        >
          <button
            type="button"
            className={`sidebar-nav-item ${
              activePage === "report"
                ? "sidebar-nav-item-active"
                : "sidebar-nav-item-idle"
            }`}
            onClick={() => handleNavigate("report")}
          >
            Form Laporan
          </button>
          <button
            type="button"
            className={`sidebar-nav-item ${
              activePage === "monitoring"
                ? "sidebar-nav-item-active"
                : "sidebar-nav-item-idle"
            }`}
            onClick={() => handleNavigate("monitoring")}
          >
            Monitoring
          </button>
          <button
            type="button"
            className={`sidebar-nav-item ${
              activePage === "stats"
                ? "sidebar-nav-item-active"
                : "sidebar-nav-item-idle"
            }`}
            onClick={() => handleNavigate("stats")}
          >
            Statistik
          </button>
        </nav>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 border-0 bg-sidebar/30 md:hidden"
          aria-label="Tutup sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <section className="bg-canvas p-4 md:p-6">
        <div className="mb-3 flex justify-start">
          <button
            type="button"
            className="group inline-flex h-[42px] w-[42px] flex-col items-center justify-center gap-[5px] rounded-full border border-slate-300 bg-white p-0 shadow-soft"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
          >
            <span
              className={`h-[2px] w-[18px] rounded-full bg-ink transition ${sidebarOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`h-[2px] w-[18px] rounded-full bg-ink transition ${sidebarOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-[2px] w-[18px] rounded-full bg-ink transition ${sidebarOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>

        <header className="panel mb-[18px] p-5">
          <h2 className="m-0 text-[1.4rem] font-semibold tracking-[-0.01em]">
            {currentPage.title}
          </h2>
          <p className="mt-2 text-muted">{currentPage.subtitle}</p>
        </header>

        {error && (
          <p className="mb-[14px] rounded-[10px] border border-dangerLine bg-dangerSoft px-3 py-2.5 text-danger">
            {error}
          </p>
        )}
        {loading && (
          <p className="mb-[14px] font-medium text-muted">Memuat data...</p>
        )}

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
