import { GoogleLogin } from "@react-oauth/google";
import { Loader2, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isGoogleOAuthConfigured } from "../config/oauth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { passwordStrength } from "../utils/passwordStrength";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", course: "", password: "", confirmPassword: "" });
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, googleLogin, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const strength = useMemo(() => passwordStrength(form.password), [form.password]);
  const passwordsMatch = form.password && form.password === form.confirmPassword;

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!passwordsMatch) {
      showToast("Passwords do not match", "error");
      return;
    }

    try {
      await register(form);
      showToast("Account created");
      navigate("/app");
    } catch (error) {
      const message = error.response?.data?.message || (error.request ? "Backend server is not running. Start the API and try again." : "Registration failed");
      showToast(message, "error");
    }
  };

  const handleGoogle = async (response) => {
    setGoogleLoading(true);
    try {
      await googleLogin(response.credential);
      showToast("Account created with Google");
      navigate("/app");
    } catch (error) {
      showToast(error.response?.data?.message || "Google signup is not configured", "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.18),transparent_28%),linear-gradient(135deg,#020617,#0f172a_48%,#111827)]" />
      <form className="glass relative z-10 w-full max-w-xl rounded-2xl p-6 shadow-2xl" onSubmit={submit}>
        <div className="mb-6">
          <p className="text-sm font-semibold text-teal-200">Smart Student Tasks</p>
          <h1 className="text-3xl font-black text-white">Create account</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Name
            <input className="input mt-1" name="name" value={form.name} onChange={update} minLength={2} required />
          </label>
          <label className="text-sm font-semibold">
            Email
            <input className="input mt-1" type="email" name="email" value={form.email} onChange={update} required />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Course
            <input className="input mt-1" name="course" value={form.course} onChange={update} placeholder="Computer Science" />
          </label>
          <label className="text-sm font-semibold">
            Password
            <input className="input mt-1" type="password" name="password" value={form.password} onChange={update} required />
          </label>
          <label className="text-sm font-semibold">
            Confirm password
            <input className="input mt-1" type="password" name="confirmPassword" value={form.confirmPassword} onChange={update} required />
          </label>
        </div>
        <div className="mt-3">
          <div className="h-2 rounded-full bg-slate-200 dark:bg-neutral-800">
            <div className={`h-2 rounded-full ${strength.color}`} style={{ width: `${Math.max(strength.score, 1) * 20}%` }} />
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-neutral-400">
            Password strength: {strength.label}{form.confirmPassword ? `, ${passwordsMatch ? "matches" : "does not match"}` : ""}
          </p>
        </div>
        <button className="btn-primary mt-6 w-full" disabled={loading || !passwordsMatch}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Create account
        </button>
        {isGoogleOAuthConfigured && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-xs font-semibold text-slate-300">{googleLoading ? "Connecting to Google..." : "or continue with Google"}</p>
            <GoogleLogin onSuccess={handleGoogle} onError={() => showToast("Google signup failed", "error")} />
          </div>
        )}
        <p className="mt-4 text-center text-sm text-slate-300">
          Already registered? <Link className="font-bold text-teal-200" to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}
