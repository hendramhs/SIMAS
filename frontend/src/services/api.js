const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

async function parseJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || "Request failed";
    const error = new Error(message);
    error.details = data?.errors;
    throw error;
  }
  return data;
}

export async function fetchDiseases() {
  const response = await fetch(`${API_BASE_URL}/diseases`);
  return parseJson(response);
}

export async function fetchCities() {
  const response = await fetch(`${API_BASE_URL}/locations/cities`);
  return parseJson(response);
}

export async function fetchAreasByCity(cityCode) {
  const searchParams = new URLSearchParams();
  if (cityCode) {
    searchParams.set("city_code", cityCode);
  }

  const queryString = searchParams.toString();
  const response = await fetch(
    `${API_BASE_URL}/locations/areas${queryString ? `?${queryString}` : ""}`,
  );

  return parseJson(response);
}

export async function fetchReports(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/reports${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);
  return parseJson(response);
}

export async function fetchStats(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/stats${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);
  return parseJson(response);
}

export async function createReport(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: "POST",
    body: formData,
  });

  return parseJson(response);
}

export function toAssetUrl(path) {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_ORIGIN}${path}`;
}
