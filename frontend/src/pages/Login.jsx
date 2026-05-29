import { Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { isGoogleOAuthConfigured } from "../config/oauth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, googleLogin, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      showToast("Welcome back");
      navigate("/app");
    } catch (error) {
      const message = error.response?.data?.message || (error.request ? "Backend server is not running. Start the API and try again." : "Login failed");
      showToast(message, "error");
    }
  };

  const handleGoogle = async ({ accessToken, profile }) => {
    try {
      await googleLogin({ accessToken, profile });
      showToast("Signed in with Google");
      navigate("/app");
    } catch (error) {
      showToast(error.response?.data?.message || "Google login failed", "error");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.18),transparent_28%),linear-gradient(135deg,#020617,#0f172a_48%,#111827)]" />
      <form className="glass relative z-10 w-full max-w-md rounded-2xl p-6 shadow-2xl" onSubmit={submit}>
        <div className="mb-6">
          <p className="text-sm font-semibold text-teal-200">Smart Student Tasks</p>
          <h1 className="text-3xl font-black text-white">Log in</h1>
        </div>
        <div className="space-y-4">
          <label className="text-sm font-semibold">
            Email
            <input className="input mt-1" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Password</label>
              <Link className="text-xs text-teal-200 hover:text-teal-100" to="/forgot-password">
                Forgot password?
              </Link>
            </div>
            <input className="input mt-1" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </div>
        </div>
        <button className="btn-primary mt-6 w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          Log in
        </button>
        {isGoogleOAuthConfigured && (
          <div className="mt-5">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-600/60" />
              <span className="text-xs font-semibold text-slate-400">or</span>
              <div className="h-px flex-1 bg-slate-600/60" />
            </div>
            <div className="mt-4">
              <GoogleAuthButton onSuccess={handleGoogle} onError={(msg) => showToast(msg, "error")} disabled={loading} />
            </div>
          </div>
        )}
        <p className="mt-4 text-center text-sm text-slate-300">
          New here? <Link className="font-bold text-teal-200" to="/register">Create an account</Link>
        </p>
      </form>
    </main>
  );
}

