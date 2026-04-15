import { useEffect, useMemo, useState } from "react";
import ReportForm from "./components/ReportForm";
import ReportList from "./components/ReportList";
import StatsPanel from "./components/StatsPanel";
import { fetchDiseases, fetchReports, fetchStats } from "./services/api";

function App() {
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

  return (
    <main className="container">
      <header className="hero">
        <h1>HealthTrack</h1>
        <p>
          Pelaporan dan pemantauan kasus penyakit untuk puskesmas dan dinas
          kesehatan.
        </p>
      </header>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Memuat data...</p>}

      <ReportForm diseases={diseases} onSuccess={loadData} />
      <ReportList
        reports={reports}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <StatsPanel stats={stats} />
    </main>
  );
}

export default App;
