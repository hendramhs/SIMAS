import { useEffect, useMemo, useState } from "react";
import ReportForm from "./components/ReportForm";
import ReportList from "./components/ReportList";
import StatsPanel from "./components/StatsPanel";
import { fetchDiseases, fetchReports, fetchStats } from "./services/api";

const pages = {
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

const navItems = [
  { key: "report", label: "Laporan" },
  { key: "monitoring", label: "Monitoring" },
  { key: "stats", label: "Statistik" },
];

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

function NavIcon({ type }) {
  if (type === "report") {
    return (
      <svg
        aria-hidden="true"
        className="h-[18px] w-[18px]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 7h6M9 11h6M9 15h4M7 3h8l4 4v14H7V3z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (type === "monitoring") {
    return (
      <svg
        aria-hidden="true"
        className="h-[18px] w-[18px]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M4 19V9M10 19V5M16 19v-8M22 19v-4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 17l5-5 3 3 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M19 9h-4V5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
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

  const totalReports = useMemo(
    () => stats.reduce((sum, item) => sum + Number(item.total_reports || 0), 0),
    [stats],
  );

  const totalKasusBaru = useMemo(
    () =>
      stats.reduce((sum, item) => sum + Number(item.total_kasus_baru || 0), 0),
    [stats],
  );

  const totalKasusMeninggal = useMemo(
    () =>
      stats.reduce(
        (sum, item) => sum + Number(item.total_kasus_meninggal || 0),
        0,
      ),
    [stats],
  );

  const totalWilayah = useMemo(() => {
    const regions = new Set(
      reports
        .map((item) => item.wilayah_code)
        .filter(
          (value) => value !== null && value !== undefined && value !== "",
        ),
    );
    return regions.size;
  }, [reports]);

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
        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-3">
          <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-sidemuted">
            SIMAS
          </p>
          <h1 className="mt-1 text-[1.35rem] font-semibold leading-tight text-white">
            Sistem Informasi
            <br />
            Masyarakat Sehat
          </h1>
          <p className="mt-2 text-xs text-sidemuted">
            Dashboard pelaporan penyakit
          </p>
        </div>

        <nav
          className="mt-[22px] grid gap-2 max-md:grid-cols-3"
          aria-label="Navigasi halaman"
        >
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`sidebar-nav-item ${
                activePage === item.key
                  ? "sidebar-nav-item-active"
                  : "sidebar-nav-item-idle"
              }`}
              onClick={() => handleNavigate(item.key)}
            >
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center max-md:mr-0 max-md:mx-auto">
                <NavIcon type={item.key} />
              </span>
              <span>{item.label}</span>
            </button>
          ))}
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
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-muted">
              SIMAS Dashboard
            </p>
            <p className="m-0 text-sm text-muted">
              Sistem Informasi Masyarakat Sehat
            </p>
          </div>
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

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-line bg-panelSoft px-3.5 py-3">
              <p className="m-0 text-xs uppercase tracking-[0.08em] text-muted">
                Total Laporan
              </p>
              <p className="mt-1 text-xl font-semibold text-ink">
                {totalReports}
              </p>
            </article>
            <article className="rounded-xl border border-line bg-panelSoft px-3.5 py-3">
              <p className="m-0 text-xs uppercase tracking-[0.08em] text-muted">
                Kasus Baru
              </p>
              <p className="mt-1 text-xl font-semibold text-ink">
                {totalKasusBaru}
              </p>
            </article>
            <article className="rounded-xl border border-line bg-panelSoft px-3.5 py-3">
              <p className="m-0 text-xs uppercase tracking-[0.08em] text-muted">
                Kasus Meninggal
              </p>
              <p className="mt-1 text-xl font-semibold text-danger">
                {totalKasusMeninggal}
              </p>
            </article>
            <article className="rounded-xl border border-line bg-panelSoft px-3.5 py-3">
              <p className="m-0 text-xs uppercase tracking-[0.08em] text-muted">
                Wilayah Aktif
              </p>
              <p className="mt-1 text-xl font-semibold text-ink">
                {totalWilayah}
              </p>
            </article>
          </div>
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
