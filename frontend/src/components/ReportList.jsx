import { toAssetUrl } from "../services/api";

function ReportList({ reports, filters, onFilterChange }) {
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
