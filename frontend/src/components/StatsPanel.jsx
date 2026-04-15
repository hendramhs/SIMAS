function StatsPanel({ stats }) {
  return (
    <section className="panel">
      <h2 className="panel-title">Statistik Penyakit</h2>
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
            {stats.length === 0 && (
              <tr>
                <td className="table-empty" colSpan="5">
                  Belum ada statistik.
                </td>
              </tr>
            )}
            {stats.map((item) => (
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
