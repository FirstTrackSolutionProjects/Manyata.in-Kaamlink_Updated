import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, clearSession, getSession } from "../../lib/api";

export default function useAdminSection(endpoint) {
  const navigate = useNavigate();
  const { token } = getSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleError = useCallback((requestError) => {
    if (requestError.status === 401) {
      clearSession();
      navigate("/admin/login", { replace: true });
      return;
    }
    setError(requestError.message);
  }, [navigate]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      setData(await apiRequest(endpoint, { token }));
    } catch (requestError) {
      handleError(requestError);
    } finally {
      setLoading(false);
    }
  }, [endpoint, handleError, token]);

  useEffect(() => { void Promise.resolve().then(load); }, [load]);

  const mutate = useCallback(async (path, method, body) => {
    setError("");
    setNotice("");
    try {
      await apiRequest(path, { token, method, body: JSON.stringify(body) });
      setNotice("Saved successfully.");
      await load();
      return true;
    } catch (requestError) {
      handleError(requestError);
      return false;
    }
  }, [handleError, load, token]);

  return { data, loading, error, notice, load, mutate };
}
