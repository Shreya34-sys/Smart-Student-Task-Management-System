import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, checkingAuth } = useAuth();

  if (checkingAuth) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 text-white">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.18),transparent_28%),linear-gradient(135deg,#020617,#0f172a_48%,#111827)]" />
        <div className="glass relative z-10 rounded-lg p-6 text-sm font-semibold text-slate-200">Checking session...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
