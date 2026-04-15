import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet.heat";

const baseMapCenter = [-2.5, 118.0];
const baseZoom = 5;

const markerIcon = L.divIcon({
  className: "",
  html: '<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#2563eb;border:2px solid #ffffff;box-shadow:0 2px 8px rgba(15,23,42,.35)"></span>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) {
      return undefined;
    }

    const maxIntensity = Math.max(
      ...points.map((item) => Number(item.intensity || 1)),
      1,
    );

    const heatLayer = L.heatLayer(
      points.map((item) => [
        item.position[0],
        item.position[1],
        item.intensity,
      ]),
      {
        radius: 28,
        blur: 22,
        maxZoom: 12,
        max: maxIntensity,
        minOpacity: 0.35,
        gradient: {
          0.25: "#7dd3fc",
          0.45: "#3b82f6",
          0.65: "#1d4ed8",
          0.85: "#1e3a8a",
          1.0: "#b42318",
        },
      },
    ).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

const basemapConfigs = {
  standard: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      "Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap",
  },
};

const riskStyles = {
  low: { color: "#0f9f6e", label: "Rendah" },
  medium: { color: "#f59e0b", label: "Sedang" },
  high: { color: "#b42318", label: "Tinggi" },
};

function ReportCaseMap({
  markers,
  regions = [],
  mode = "marker",
  basemap = "standard",
}) {
  const mapCenter = useMemo(() => {
    if (markers.length === 0) {
      return baseMapCenter;
    }

    const [sumLat, sumLng] = markers.reduce(
      (acc, item) => [acc[0] + item.position[0], acc[1] + item.position[1]],
      [0, 0],
    );

    return [sumLat / markers.length, sumLng / markers.length];
  }, [markers]);

  const heatPoints = useMemo(
    () =>
      markers.map((item) => ({
        position: item.position,
        intensity: Math.max(item.kasusBaru + item.kasusMeninggal, 1),
      })),
    [markers],
  );

  const activeBasemap = basemapConfigs[basemap] || basemapConfigs.standard;

  if (markers.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line bg-panel px-3 py-8 text-center text-sm text-muted">
        Belum ada koordinat laporan untuk ditampilkan di peta.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="h-[350px] w-full overflow-hidden rounded-xl border border-line">
        <MapContainer
          center={mapCenter}
          zoom={baseZoom}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution={activeBasemap.attribution}
            url={activeBasemap.url}
          />

          {mode === "heatmap" ? (
            <HeatmapLayer points={heatPoints} />
          ) : mode === "region" ? (
            regions.map((item) => {
              const riskStyle = riskStyles[item.risk] || riskStyles.low;
              return (
                <CircleMarker
                  key={item.id}
                  center={item.position}
                  radius={Math.min(
                    30,
                    8 + Math.sqrt(Math.max(item.totalKasus, 1)) * 2,
                  )}
                  pathOptions={{
                    color: riskStyle.color,
                    fillColor: riskStyle.color,
                    fillOpacity: 0.45,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="m-0 font-semibold text-ink">
                        {item.region}
                      </p>
                      <p className="m-0 text-muted">
                        Risiko: {riskStyle.label}
                      </p>
                      <p className="m-0 text-muted">
                        Total Kasus: {item.totalKasus}
                      </p>
                      <p className="m-0 text-muted">
                        Kasus Baru: {item.totalKasusBaru}
                      </p>
                      <p className="m-0 text-muted">
                        Kasus Meninggal: {item.totalKasusMeninggal}
                      </p>
                      <p className="m-0 text-muted">
                        Jumlah Laporan: {item.totalLaporan}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })
          ) : (
            markers.map((item) => (
              <Marker key={item.id} position={item.position} icon={markerIcon}>
                <Popup>
                  <div className="text-sm">
                    <p className="m-0 font-semibold text-ink">
                      {item.diseaseName}
                    </p>
                    <p className="m-0 text-muted">{item.region}</p>
                    <p className="m-0 text-muted">
                      Kasus baru: {item.kasusBaru}
                    </p>
                    <p className="m-0 text-muted">
                      Meninggal: {item.kasusMeninggal}
                    </p>
                    <p className="m-0 text-muted">{item.reportedAt}</p>
                  </div>
                </Popup>
              </Marker>
            ))
          )}
        </MapContainer>
      </div>

      {mode === "heatmap" && (
        <div className="rounded-lg border border-line bg-panel px-3 py-2 text-xs text-muted">
          <p className="m-0 font-medium text-ink">Legenda Intensitas Kasus</p>
          <div className="mt-2 h-2 w-full rounded-full bg-gradient-to-r from-sky-300 via-blue-500 to-red-700" />
          <div className="mt-1 flex items-center justify-between">
            <span>Rendah</span>
            <span>Tinggi</span>
          </div>
        </div>
      )}

      {mode === "region" && (
        <div className="rounded-lg border border-line bg-panel px-3 py-2 text-xs text-muted">
          <p className="m-0 font-medium text-ink">Legenda Risiko Wilayah</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0f9f6e]" /> Rendah
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" /> Sedang
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#b42318]" /> Tinggi
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportCaseMap;
