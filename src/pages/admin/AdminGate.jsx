import { Navigate } from "react-router-dom";
import { getSession } from "../../lib/api";

export default function AdminGate({ children }) {
  const { token, user } = getSession();
  if (!token || user?.role !== "admin") return <Navigate to="/admin/login" replace />;
  return children;
}
