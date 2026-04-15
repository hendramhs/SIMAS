import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartPalette = [
  "#2563eb",
  "#0f9f6e",
  "#f59e0b",
  "#b42318",
  "#0ea5e9",
  "#7c3aed",
  "#334155",
  "#14b8a6",
];

const numberFormatter = new Intl.NumberFormat("id-ID");

function StatsPanel({ stats }) {
  const normalizedStats = useMemo(
    () =>
      stats.map((item) => ({
        ...item,
        total_reports: Number(item.total_reports || 0),
        total_kasus_baru: Number(item.total_kasus_baru || 0),
        total_kasus_meninggal: Number(item.total_kasus_meninggal || 0),
      })),
    [stats],
  );

  const barData = useMemo(
    () =>
      normalizedStats.slice(0, 8).map((item) => ({
        name:
          item.disease_name.length > 16
            ? `${item.disease_name.slice(0, 16)}...`
            : item.disease_name,
        kasusBaru: item.total_kasus_baru,
        meninggal: item.total_kasus_meninggal,
      })),
    [normalizedStats],
  );

  const pieData = useMemo(() => {
    const ranked = [...normalizedStats].sort(
      (a, b) => b.total_kasus_baru - a.total_kasus_baru,
    );
    const top = ranked.slice(0, 5).map((item) => ({
      name: item.disease_name,
      value: item.total_kasus_baru,
    }));
    const otherValue = ranked
      .slice(5)
      .reduce((sum, item) => sum + item.total_kasus_baru, 0);

    if (otherValue > 0) {
      top.push({ name: "Lainnya", value: otherValue });
    }

    return top;
  }, [normalizedStats]);

  const hasChartData = barData.some(
    (item) => item.kasusBaru > 0 || item.meninggal > 0,
  );

  return (
    <section className="panel">
      <h2 className="panel-title">Statistik Penyakit</h2>

      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <article className="rounded-xl border border-line bg-panelSoft p-3 xl:col-span-3">
          <p className="mb-2 text-sm font-semibold text-ink">
            Perbandingan Kasus Baru dan Meninggal
          </p>
          {!hasChartData ? (
            <p className="rounded-lg border border-dashed border-line bg-panel px-3 py-8 text-center text-sm text-muted">
              Belum ada data statistik yang bisa divisualisasikan.
            </p>
          ) : (
            <div className="h-[310px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 8, right: 12, left: 0, bottom: 28 }}
                >
                  <CartesianGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={58}
                    tick={{ fill: "#475467", fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: "#475467", fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    formatter={(value) => numberFormatter.format(Number(value))}
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
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="meninggal"
                    name="Kasus Meninggal"
                    fill="#b42318"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>

        <article className="rounded-xl border border-line bg-panelSoft p-3 xl:col-span-2">
          <p className="mb-2 text-sm font-semibold text-ink">
            Distribusi Kasus Baru
          </p>
          {pieData.length === 0 ? (
            <p className="rounded-lg border border-dashed border-line bg-panel px-3 py-8 text-center text-sm text-muted">
              Belum ada distribusi kasus untuk ditampilkan.
            </p>
          ) : (
            <div className="h-[310px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={96}
                    paddingAngle={2}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={chartPalette[index % chartPalette.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => numberFormatter.format(Number(value))}
                    contentStyle={{
                      borderRadius: "10px",
                      borderColor: "#d0d5dd",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>
      </div>

      <div className="table-wrap">
        <table className="table-base">
          <thead className="table-head">
            <tr>
              <th className="table-head-cell">Penyakit</th>
              <th className="table-head-cell">Total Laporan</th>
              <th className="table-head-cell">Total Kasus Baru</th>
              <th className="table-head-cell">Total Kasus Meninggal</th>
              <th className="table-head-cell">Laporan Terakhir</th>
            </tr>
          </thead>
          <tbody>
            {normalizedStats.length === 0 && (
              <tr>
                <td className="table-empty" colSpan="5">
                  Belum ada statistik.
                </td>
              </tr>
            )}
            {normalizedStats.map((item) => (
              <tr key={item.disease_id}>
                <td className="table-cell">{item.disease_name}</td>
                <td className="table-cell">{item.total_reports}</td>
                <td className="table-cell">{item.total_kasus_baru}</td>
                <td className="table-cell">{item.total_kasus_meninggal}</td>
                <td className="table-cell">
                  {item.last_reported_at
                    ? new Date(item.last_reported_at).toLocaleDateString(
                        "id-ID",
                      )
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default StatsPanel;
