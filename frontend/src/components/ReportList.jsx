import { useRef, useState, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ReportCaseMap from "./ReportCaseMap";
import { toAssetUrl } from "../services/api";
import { exportElementToPdf, exportElementToPng } from "../utils/chartExport";
import { resolveReportCoordinates } from "../utils/locationResolver";

function ReportList({ reports, filters, onFilterChange }) {
  const chartRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [mapMode, setMapMode] = useState("heatmap");
  const [baseMapStyle, setBaseMapStyle] = useState("standard");

  const trendData = useMemo(() => {
    const grouped = reports.reduce((acc, item) => {
      const date = new Date(item.reported_at);
      const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      if (!acc[isoDate]) {
        acc[isoDate] = { date: isoDate, laporan: 0, kasusBaru: 0 };
      }

      acc[isoDate].laporan += 1;
      acc[isoDate].kasusBaru += Number(item.kasus_baru || 0);
      return acc;
    }, {});

    return Object.values(grouped)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-14)
      .map((item) => ({
        ...item,
        label: new Date(item.date).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        }),
      }));
  }, [reports]);

  const diseaseSummaryData = useMemo(() => {
    const grouped = reports.reduce((acc, item) => {
      const key = item.disease_name || "Tidak diketahui";
      if (!acc[key]) {
        acc[key] = { disease: key, laporan: 0, kasusBaru: 0 };
      }

      acc[key].laporan += 1;
      acc[key].kasusBaru += Number(item.kasus_baru || 0);
      return acc;
    }, {});

    return Object.values(grouped)
      .sort((a, b) => b.kasusBaru - a.kasusBaru)
      .slice(0, 8)
      .map((item) => ({
        ...item,
        disease:
          item.disease.length > 16
            ? `${item.disease.slice(0, 16)}...`
            : item.disease,
      }));
  }, [reports]);

  const hasTrendData = trendData.length > 0;
  const hasDiseaseData = diseaseSummaryData.length > 0;

  const mapMarkers = useMemo(
    () =>
      reports
        .map((item, index) => {
          const position = resolveReportCoordinates(item, index);
          if (!position) {
            return null;
          }

          return {
            id: item.id,
            position,
            diseaseName: item.disease_name,
            region: item.wilayah_label || item.wilayah_code,
            kasusBaru: Number(item.kasus_baru || 0),
            kasusMeninggal: Number(item.kasus_meninggal || 0),
            reportedAt: new Date(item.reported_at).toLocaleString("id-ID"),
          };
        })
        .filter(Boolean),
    [reports],
  );

  const regionalPoints = useMemo(() => {
    if (mapMarkers.length === 0) {
      return [];
    }

    const grouped = mapMarkers.reduce((acc, item) => {
      const key = item.region || "Tidak diketahui";
      if (!acc[key]) {
        acc[key] = {
          key,
          region: key,
          totalKasusBaru: 0,
          totalKasusMeninggal: 0,
          count: 0,
          sumLat: 0,
          sumLng: 0,
        };
      }

      acc[key].totalKasusBaru += item.kasusBaru;
      acc[key].totalKasusMeninggal += item.kasusMeninggal;
      acc[key].count += 1;
      acc[key].sumLat += item.position[0];
      acc[key].sumLng += item.position[1];
      return acc;
    }, {});

    const regions = Object.values(grouped).map((item) => ({
      id: item.key,
      region: item.region,
      position: [item.sumLat / item.count, item.sumLng / item.count],
      totalKasus: item.totalKasusBaru + item.totalKasusMeninggal,
      totalKasusBaru: item.totalKasusBaru,
      totalKasusMeninggal: item.totalKasusMeninggal,
      totalLaporan: item.count,
    }));

    const maxTotalKasus = Math.max(
      ...regions.map((item) => item.totalKasus),
      0,
    );

    return regions.map((item) => {
      if (maxTotalKasus <= 0) {
        return { ...item, risk: "low" };
      }

      const ratio = item.totalKasus / maxTotalKasus;
      if (ratio >= 0.67) {
        return { ...item, risk: "high" };
      }

      if (ratio >= 0.34) {
        return { ...item, risk: "medium" };
      }

      return { ...item, risk: "low" };
    });
  }, [mapMarkers]);

  const handleExport = async (format) => {
    setIsExporting(true);
    setExportError("");

    try {
      if (format === "png") {
        await exportElementToPng(chartRef.current, "monitoring-penyakit.png");
      } else {
        await exportElementToPdf(chartRef.current, "monitoring-penyakit.pdf");
      }
    } catch (error) {
      setExportError(error.message || "Gagal melakukan export chart.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="panel">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="panel-title mb-0">Monitoring Data Penyakit</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-[10px] border border-line bg-panel px-3 py-2 text-sm font-semibold text-ink transition hover:bg-panelSoft disabled:cursor-not-allowed disabled:opacity-55"
            onClick={() => handleExport("png")}
            disabled={isExporting}
          >
            Export PNG
          </button>
          <button
            type="button"
            className="btn-primary px-3 py-2 text-sm"
            onClick={() => handleExport("pdf")}
            disabled={isExporting}
          >
            Export PDF
          </button>
        </div>
      </div>

      {exportError && (
        <p className="mb-3 rounded-[10px] border border-dangerLine bg-dangerSoft px-3 py-2 text-sm text-danger">
          {exportError}
        </p>
      )}

      <div className="mb-3 flex flex-col gap-2 md:flex-row">
        <input
          className="input-control w-full md:w-[240px]"
          placeholder="Filter kode wilayah"
          value={filters.wilayah_code}
          onChange={(event) =>
            onFilterChange("wilayah_code", event.target.value)
          }
        />
        <input
          className="input-control w-full md:w-[240px]"
          placeholder="Filter ID penyakit"
          value={filters.disease_id}
          onChange={(event) => onFilterChange("disease_id", event.target.value)}
        />
      </div>

      <article className="mb-4 rounded-xl border border-line bg-panelSoft p-3">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="m-0 text-sm font-semibold text-ink">
            Peta Sebaran Laporan
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-line bg-panel p-1">
              <button
                type="button"
                onClick={() => setMapMode("marker")}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  mapMode === "marker"
                    ? "bg-blue-600 text-white"
                    : "text-muted hover:bg-panelSoft"
                }`}
              >
                Marker
              </button>
              <button
                type="button"
                onClick={() => setMapMode("heatmap")}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  mapMode === "heatmap"
                    ? "bg-blue-600 text-white"
                    : "text-muted hover:bg-panelSoft"
                }`}
              >
                Heatmap
              </button>
              <button
                type="button"
                onClick={() => setMapMode("region")}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  mapMode === "region"
                    ? "bg-blue-600 text-white"
                    : "text-muted hover:bg-panelSoft"
                }`}
              >
                Wilayah
              </button>
            </div>

            <select
              className="input-control !py-1.5 text-xs"
              value={baseMapStyle}
              onChange={(event) => setBaseMapStyle(event.target.value)}
              aria-label="Pilih jenis basemap"
            >
              <option value="standard">Basemap: Standard</option>
              <option value="satellite">Basemap: Satellite</option>
              <option value="terrain">Basemap: Terrain</option>
            </select>
          </div>
        </div>
        <ReportCaseMap
          markers={mapMarkers}
          regions={regionalPoints}
          mode={mapMode}
          basemap={baseMapStyle}
        />
      </article>

      <div
        ref={chartRef}
        className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-5"
      >
        <article className="rounded-xl border border-line bg-panelSoft p-3 xl:col-span-3">
          <p className="mb-2 text-sm font-semibold text-ink">
            Tren 14 Hari Terakhir
          </p>
          {!hasTrendData ? (
            <p className="rounded-lg border border-dashed border-line bg-panel px-3 py-8 text-center text-sm text-muted">
              Belum ada data tren untuk ditampilkan.
            </p>
          ) : (
            <div className="h-[290px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 8, right: 12, left: 0, bottom: 12 }}
                >
                  <CartesianGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#475467", fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#475467", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      borderColor: "#d0d5dd",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="laporan"
                    name="Jumlah Laporan"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="kasusBaru"
                    name="Kasus Baru"
                    stroke="#0f9f6e"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>

        <article className="rounded-xl border border-line bg-panelSoft p-3 xl:col-span-2">
          <p className="mb-2 text-sm font-semibold text-ink">
            Top Penyakit Berdasarkan Kasus Baru
          </p>
          {!hasDiseaseData ? (
            <p className="rounded-lg border border-dashed border-line bg-panel px-3 py-8 text-center text-sm text-muted">
              Belum ada ringkasan penyakit untuk divisualisasikan.
            </p>
          ) : (
            <div className="h-[290px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={diseaseSummaryData}
                  layout="vertical"
                  margin={{ top: 8, right: 12, left: 8, bottom: 8 }}
                >
                  <CartesianGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fill: "#475467", fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="disease"
                    width={128}
                    tick={{ fill: "#475467", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      borderColor: "#d0d5dd",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="kasusBaru"
                    name="Kasus Baru"
                    fill="#2563eb"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>
      </div>

      <div className="table-wrap">
        <table className="table-base">
          <thead className="table-head">
            <tr>
              <th className="table-head-cell">ID</th>
              <th className="table-head-cell">Penyakit</th>
              <th className="table-head-cell">Wilayah</th>
              <th className="table-head-cell">Kasus Baru</th>
              <th className="table-head-cell">Meninggal</th>
              <th className="table-head-cell">Foto</th>
              <th className="table-head-cell">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 && (
              <tr>
                <td className="table-empty" colSpan="7">
                  Belum ada data laporan.
                </td>
              </tr>
            )}
            {reports.map((item) => (
              <tr key={item.id}>
                <td className="table-cell">{item.id}</td>
                <td className="table-cell">{item.disease_name}</td>
                <td className="table-cell">
                  {item.wilayah_label || item.wilayah_code}
                </td>
                <td className="table-cell">{item.kasus_baru}</td>
                <td className="table-cell">{item.kasus_meninggal}</td>
                <td className="table-cell">
                  {item.photo_url ? (
                    <a
                      className="link-action"
                      href={toAssetUrl(item.photo_url)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Lihat
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="table-cell">
                  {new Date(item.reported_at).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ReportList;
