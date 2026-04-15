function StatsPanel({ stats }) {
  return (
    <section className="card">
      <h2>Statistik Penyakit</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Penyakit</th>
              <th>Total Laporan</th>
              <th>Total Kasus Baru</th>
              <th>Total Kasus Meninggal</th>
              <th>Laporan Terakhir</th>
            </tr>
          </thead>
          <tbody>
            {stats.length === 0 && (
              <tr>
                <td colSpan="5">Belum ada statistik.</td>
              </tr>
            )}
            {stats.map((item) => (
              <tr key={item.disease_id}>
                <td>{item.disease_name}</td>
                <td>{item.total_reports}</td>
                <td>{item.total_kasus_baru}</td>
                <td>{item.total_kasus_meninggal}</td>
                <td>
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
