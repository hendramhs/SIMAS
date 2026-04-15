import { useEffect, useMemo, useState } from "react";
import { createReport, fetchAreasByCity, fetchCities } from "../services/api";

const initialState = {
  disease_id: "",
  wilayah_code: "",
  wilayah_label: "",
  lokasi_detail: "",
  latitude: "",
  longitude: "",
  deskripsi: "",
  kasus_baru: 0,
  kasus_meninggal: 0,
};

function ReportForm({ diseases, onSuccess }) {
  const [form, setForm] = useState(initialState);
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [selectedAreaCode, setSelectedAreaCode] = useState("");

  const canSubmit = useMemo(() => {
    return (
      form.disease_id &&
      form.wilayah_code &&
      form.lokasi_detail &&
      form.deskripsi
    );
  }, [form]);

  useEffect(() => {
    let active = true;

    const loadCities = async () => {
      try {
        const response = await fetchCities();
        if (!active) {
          return;
        }
        setCities(response.data || []);
      } catch (error) {
        if (!active) {
          return;
        }
        setFeedback(`Gagal memuat daftar kota: ${error.message}`);
      }
    };

    loadCities();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    if (!selectedCityCode) {
      setAreas([]);
      setSelectedAreaCode("");
      setForm((prev) => ({
        ...prev,
        wilayah_code: "",
        wilayah_label: "",
        lokasi_detail: "",
        latitude: "",
        longitude: "",
      }));
      return undefined;
    }

    const selectedCity = cities.find(
      (item) => item.city_code === selectedCityCode,
    );
    setForm((prev) => ({
      ...prev,
      wilayah_code: selectedCityCode,
      wilayah_label: selectedCity?.city_name || "",
      lokasi_detail: "",
      latitude: "",
      longitude: "",
    }));
    setSelectedAreaCode("");
    setIsLoadingLocations(true);

    const loadAreas = async () => {
      try {
        const response = await fetchAreasByCity(selectedCityCode);
        if (!active) {
          return;
        }
        setAreas(response.data || []);
      } catch (error) {
        if (!active) {
          return;
        }
        setFeedback(`Gagal memuat detail wilayah: ${error.message}`);
      } finally {
        if (active) {
          setIsLoadingLocations(false);
        }
      }
    };

    loadAreas();
    return () => {
      active = false;
    };
  }, [selectedCityCode, cities]);

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

  const handleCityChange = (event) => {
    setSelectedCityCode(event.target.value);
  };

  const handleAreaChange = (event) => {
    const areaCode = event.target.value;
    setSelectedAreaCode(areaCode);

    const selectedArea = areas.find((item) => item.area_code === areaCode);
    setForm((prev) => ({
      ...prev,
      lokasi_detail: selectedArea?.area_name || "",
      latitude:
        selectedArea?.latitude !== undefined && selectedArea?.latitude !== null
          ? String(selectedArea.latitude)
          : "",
      longitude:
        selectedArea?.longitude !== undefined &&
        selectedArea?.longitude !== null
          ? String(selectedArea.longitude)
          : "",
    }));
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
          Kota / Kabupaten
          <select
            className="input-control"
            value={selectedCityCode}
            onChange={handleCityChange}
            required
          >
            <option value="">Pilih kota/kabupaten</option>
            {cities.map((item) => (
              <option key={item.city_code} value={item.city_code}>
                {item.city_name}
              </option>
            ))}
          </select>
        </label>

        <label className="field-label">
          Lokasi Detail
          <select
            className="input-control"
            value={selectedAreaCode}
            onChange={handleAreaChange}
            required
            disabled={!selectedCityCode || isLoadingLocations}
          >
            <option value="">
              {selectedCityCode
                ? isLoadingLocations
                  ? "Memuat detail wilayah..."
                  : "Pilih detail wilayah"
                : "Pilih kota terlebih dahulu"}
            </option>
            {areas.map((item) => (
              <option key={item.area_code} value={item.area_code}>
                {item.area_name}
              </option>
            ))}
          </select>
        </label>

        <input type="hidden" name="wilayah_code" value={form.wilayah_code} />
        <input type="hidden" name="wilayah_label" value={form.wilayah_label} />

        <label className="field-label">
          Latitude (otomatis)
          <input
            className="input-control"
            name="latitude"
            value={form.latitude}
            readOnly
            placeholder="Terisi otomatis dari lokasi"
          />
        </label>

        <label className="field-label">
          Longitude (otomatis)
          <input
            className="input-control"
            name="longitude"
            value={form.longitude}
            readOnly
            placeholder="Terisi otomatis dari lokasi"
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
