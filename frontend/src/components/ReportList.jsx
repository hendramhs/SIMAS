import { toAssetUrl } from "../services/api";

function ReportList({ reports, filters, onFilterChange }) {
  return (
    <section className="card">
      <h2>Monitoring Data Penyakit</h2>

      <div className="filter-row">
        <input
          placeholder="Filter kode wilayah"
          value={filters.wilayah_code}
          onChange={(event) =>
            onFilterChange("wilayah_code", event.target.value)
          }
        />
        <input
          placeholder="Filter ID penyakit"
          value={filters.disease_id}
          onChange={(event) => onFilterChange("disease_id", event.target.value)}
        />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Penyakit</th>
              <th>Wilayah</th>
              <th>Kasus Baru</th>
              <th>Meninggal</th>
              <th>Foto</th>
              <th>Waktu</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 && (
              <tr>
                <td colSpan="7">Belum ada data laporan.</td>
              </tr>
            )}
            {reports.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.disease_name}</td>
                <td>{item.wilayah_label || item.wilayah_code}</td>
                <td>{item.kasus_baru}</td>
                <td>{item.kasus_meninggal}</td>
                <td>
                  {item.photo_url ? (
                    <a
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
                <td>{new Date(item.reported_at).toLocaleString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ReportList;
