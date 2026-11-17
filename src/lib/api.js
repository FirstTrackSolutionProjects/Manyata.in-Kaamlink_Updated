const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
let refreshInFlight = null;

async function request(path, options, token) {
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

async function refreshAccessToken() {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const { token, refreshToken } = getSession();
      if (!refreshToken && !token) {
        const error = new Error("Your session expired. Please sign in again.");
        error.status = 401;
        throw error;
      }

      const response = refreshToken
        ? await request("/auth/refresh", { method: "POST", body: JSON.stringify({ refreshToken }) })
        : await request("/auth/refresh/bootstrap", { method: "POST" }, token);
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false || !result.data?.accessToken) {
        const error = new Error(result.message || "Your session expired. Please sign in again.");
        error.status = response.status || 401;
        throw error;
      }
      saveSession(result.data);
      return result.data.accessToken;
    })().catch((error) => {
      if (error.status === 401 || error.status === 403) clearSession();
      throw error;
    }).finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

export async function apiRequest(path, { token, ...options } = {}) {
  let response;
  // /auth/me is a protected resource and must use the same refresh/retry flow
  // as other protected endpoints when the short-lived access token expires.
  const isAuthEndpoint = /^\/auth\/(?:login|signup|refresh(?:\/bootstrap)?|logout)$/.test(path);
  let currentToken = token || (!isAuthEndpoint ? getSession().token : null);
  if (currentToken && !isAuthEndpoint && !getSession().refreshToken) {
    currentToken = await refreshAccessToken();
  }
  try {
    response = await request(path, options, currentToken);
  } catch {
    throw new Error("Manyata service is unavailable right now. Please try again shortly.");
  }

  if (response.status === 401 && currentToken && !isAuthEndpoint) {
    try {
      const freshToken = await refreshAccessToken();
      try {
        response = await request(path, options, freshToken);
      } catch {
        throw new Error("Manyata service is unavailable right now. Please try again shortly.");
      }
    } catch (refreshError) {
      const error = new Error(refreshError.message || "Your session expired. Please sign in again.");
      error.status = refreshError.status || 503;
      throw error;
    }
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
  if (data.refreshToken) localStorage.setItem("manyata.refreshToken", data.refreshToken);
  localStorage.setItem("manyata.user", JSON.stringify(data.user));
}

export function getSession() {
  try {
    return {
      token: localStorage.getItem("manyata.accessToken"),
      refreshToken: localStorage.getItem("manyata.refreshToken"),
      user: JSON.parse(localStorage.getItem("manyata.user") || "null"),
    };
  } catch {
    return { token: null, refreshToken: null, user: null };
  }
}

export function clearSession() {
  localStorage.removeItem("manyata.accessToken");
  localStorage.removeItem("manyata.refreshToken");
  localStorage.removeItem("manyata.user");
}

export function logoutSession() {
  const { refreshToken } = getSession();
  clearSession();
  if (!refreshToken) return;
  request("/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }) }, null).catch(() => {});
}
