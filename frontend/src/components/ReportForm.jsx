import { useMemo, useState } from "react";
import { createReport } from "../services/api";

const initialState = {
  disease_id: "",
  wilayah_code: "",
  wilayah_label: "",
  lokasi_detail: "",
  deskripsi: "",
  kasus_baru: 0,
  kasus_meninggal: 0,
};

function ReportForm({ diseases, onSuccess }) {
  const [form, setForm] = useState(initialState);
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const canSubmit = useMemo(() => {
    return form.disease_id && form.wilayah_code && form.deskripsi;
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback("");

    try {
      await createReport({ ...form, photo });
      setForm(initialState);
      setPhoto(null);
      setFeedback("Laporan berhasil dikirim.");
      onSuccess();
    } catch (error) {
      const details = Array.isArray(error.details)
        ? ` (${error.details.join(", ")})`
        : "";
      setFeedback(`Gagal kirim laporan: ${error.message}${details}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h2>Laporan Penyakit</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Jenis Penyakit
          <select
            name="disease_id"
            value={form.disease_id}
            onChange={handleChange}
            required
          >
            <option value="">Pilih penyakit</option>
            {diseases.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.code})
              </option>
            ))}
          </select>
        </label>

        <label>
          Kode Wilayah
          <input
            name="wilayah_code"
            value={form.wilayah_code}
            onChange={handleChange}
            placeholder="contoh: 31.74"
            required
          />
        </label>

        <label>
          Label Wilayah
          <input
            name="wilayah_label"
            value={form.wilayah_label}
            onChange={handleChange}
            placeholder="contoh: Jakarta Selatan"
          />
        </label>

        <label>
          Lokasi Detail
          <input
            name="lokasi_detail"
            value={form.lokasi_detail}
            onChange={handleChange}
            placeholder="Kelurahan / jalan"
          />
        </label>

        <label>
          Kasus Baru
          <input
            type="number"
            min="0"
            name="kasus_baru"
            value={form.kasus_baru}
            onChange={handleChange}
          />
        </label>

        <label>
          Kasus Meninggal
          <input
            type="number"
            min="0"
            name="kasus_meninggal"
            value={form.kasus_meninggal}
            onChange={handleChange}
          />
        </label>

        <label className="full-width">
          Deskripsi
          <textarea
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            rows="3"
            required
          />
        </label>

        <label className="full-width">
          Foto
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setPhoto(event.target.files?.[0] || null)}
          />
        </label>

        <button disabled={!canSubmit || isSubmitting} type="submit">
          {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
        </button>
      </form>
      {feedback && <p className="feedback">{feedback}</p>}
    </section>
  );
}

export default ReportForm;
