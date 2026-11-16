const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export async function apiRequest(path, { token, ...options } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Manyata service is unavailable right now. Please try again shortly.");
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success === false) {
    const error = new Error(result.message || "We couldn't complete your request. Please try again.");
    error.status = response.status;
    throw error;
  }
  return result.data;
}

export function saveSession(data) {
  localStorage.setItem("manyata.accessToken", data.accessToken);
  localStorage.setItem("manyata.user", JSON.stringify(data.user));
}

export function getSession() {
  try {
    return {
      token: localStorage.getItem("manyata.accessToken"),
      user: JSON.parse(localStorage.getItem("manyata.user") || "null"),
    };
  } catch {
    return { token: null, user: null };
  }
}

export function clearSession() {
  localStorage.removeItem("manyata.accessToken");
  localStorage.removeItem("manyata.user");
}
