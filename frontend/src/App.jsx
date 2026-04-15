import { Suspense, lazy, useEffect, useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import ReportForm from "./components/ReportForm";
import SidebarNav from "./components/SidebarNav";
import {
  getPageFromPath,
  navItems,
  pagePaths,
  pages,
} from "./constants/navigation";
import useDashboardData from "./hooks/useDashboardData";

const ReportList = lazy(() => import("./components/ReportList"));
const StatsPanel = lazy(() => import("./components/StatsPanel"));

function App() {
  const [activePage, setActivePage] = useState(() =>
    typeof window !== "undefined"
      ? getPageFromPath(window.location.pathname)
      : "report",
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    diseases,
    reports,
    stats,
    filters,
    loading,
    error,
    totals,
    loadData,
    handleFilterChange,
  } = useDashboardData();

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
    <main className="min-h-screen md:grid md:grid-cols-[280px_1fr]">
      <SidebarNav
        navItems={navItems}
        activePage={activePage}
        sidebarOpen={sidebarOpen}
        onNavigate={handleNavigate}
        onClose={() => setSidebarOpen(false)}
      />

      <section className="bg-canvas p-4 md:p-6">
        <DashboardHeader
          currentPage={currentPage}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          totals={totals}
        />

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
          <Suspense
            fallback={
              <p className="mb-[14px] font-medium text-muted">
                Memuat visualisasi monitoring...
              </p>
            }
          >
            <ReportList
              reports={reports}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </Suspense>
        )}
        {activePage === "stats" && (
          <Suspense
            fallback={
              <p className="mb-[14px] font-medium text-muted">
                Memuat visualisasi statistik...
              </p>
            }
          >
            <StatsPanel stats={stats} />
          </Suspense>
        )}
      </section>
    </main>
  );
}

export default App;
