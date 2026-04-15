import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchDiseases, fetchReports, fetchStats } from "../services/api";

function useDashboardData() {
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

  const loadData = useCallback(async () => {
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
  }, [query, filters.wilayah_code]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const totals = useMemo(() => {
    const totalReports = stats.reduce(
      (sum, item) => sum + Number(item.total_reports || 0),
      0,
    );
    const totalKasusBaru = stats.reduce(
      (sum, item) => sum + Number(item.total_kasus_baru || 0),
      0,
    );
    const totalKasusMeninggal = stats.reduce(
      (sum, item) => sum + Number(item.total_kasus_meninggal || 0),
      0,
    );
    const regions = new Set(
      reports
        .map((item) => item.wilayah_code)
        .filter(
          (value) => value !== null && value !== undefined && value !== "",
        ),
    );

    return {
      totalReports,
      totalKasusBaru,
      totalKasusMeninggal,
      totalWilayah: regions.size,
    };
  }, [reports, stats]);

  return {
    diseases,
    reports,
    stats,
    filters,
    loading,
    error,
    totals,
    loadData,
    handleFilterChange,
  };
}

export default useDashboardData;
