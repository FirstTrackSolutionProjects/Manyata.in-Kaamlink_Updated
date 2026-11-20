import { Navigate } from "react-router-dom";
import { getSession } from "../../lib/api";

export default function AdminGate({ children }) {
  const { token, user } = getSession();
  if (!token || !["admin", "employee"].includes(user?.role)) return <Navigate to="/admin/login" replace />;
  return children;
}
