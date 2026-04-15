import { useMemo } from "react";
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
import { toAssetUrl } from "../services/api";

function ReportList({ reports, filters, onFilterChange }) {
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

  return (
    <section className="panel">
      <h2 className="panel-title">Monitoring Data Penyakit</h2>

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

      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-5">
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
