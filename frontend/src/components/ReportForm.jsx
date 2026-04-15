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
    <section className="panel">
      <h2 className="panel-title">Laporan Penyakit</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 md:grid-cols-2"
      >
        <label className="field-label">
          Jenis Penyakit
          <select
            className="input-control"
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

        <label className="field-label">
          Kode Wilayah
          <input
            className="input-control"
            name="wilayah_code"
            value={form.wilayah_code}
            onChange={handleChange}
            placeholder="contoh: 31.74"
            required
          />
        </label>

        <label className="field-label">
          Label Wilayah
          <input
            className="input-control"
            name="wilayah_label"
            value={form.wilayah_label}
            onChange={handleChange}
            placeholder="contoh: Jakarta Selatan"
          />
        </label>

        <label className="field-label">
          Lokasi Detail
          <input
            className="input-control"
            name="lokasi_detail"
            value={form.lokasi_detail}
            onChange={handleChange}
            placeholder="Kelurahan / jalan"
          />
        </label>

        <label className="field-label">
          Kasus Baru
          <input
            className="input-control"
            type="number"
            min="0"
            name="kasus_baru"
            value={form.kasus_baru}
            onChange={handleChange}
          />
        </label>

        <label className="field-label">
          Kasus Meninggal
          <input
            className="input-control"
            type="number"
            min="0"
            name="kasus_meninggal"
            value={form.kasus_meninggal}
            onChange={handleChange}
          />
        </label>

        <label className="field-label md:col-span-2">
          Deskripsi
          <textarea
            className="input-control"
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            rows="3"
            required
          />
        </label>

        <label className="field-label md:col-span-2">
          Foto
          <input
            className="input-control"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setPhoto(event.target.files?.[0] || null)}
          />
        </label>

        <button
          className="btn-primary"
          disabled={!canSubmit || isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
        </button>
      </form>
      {feedback && <p className="status-success">{feedback}</p>}
    </section>
  );
}

export default ReportForm;
