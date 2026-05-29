import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { forgotPassword } from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      showToast("Please enter your email", "error");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword({ email });
      setSubmitted(true);
      showToast("Password reset link sent! Check your email.", "success");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      showToast(error.message || "Failed to send reset link", "error");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 text-white">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.18),transparent_28%),linear-gradient(135deg,#020617,#0f172a_48%,#111827)]" />
        <div className="glass relative z-10 w-full max-w-md rounded-2xl p-6 shadow-2xl text-center">
          <div className="mb-6">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-teal-500/20 p-3">
                <Mail className="h-8 w-8 text-teal-400" />
              </div>
            </div>
            <p className="text-sm font-semibold text-teal-200">Smart Student Tasks</p>
            <h1 className="text-2xl font-black text-white">Check your email</h1>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-xs text-slate-400">
              The link expires in 15 minutes. If you don't see the email, check your spam folder.
            </p>
            <div className="rounded-lg bg-blue-500/10 p-3">
              <p className="text-xs text-blue-300">
                <strong>💡 Tip:</strong> If you didn't receive an email, make sure you entered the correct email address.
              </p>
            </div>
          </div>
          <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm text-teal-200 hover:text-teal-100">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.18),transparent_28%),linear-gradient(135deg,#020617,#0f172a_48%,#111827)]" />
      <form className="glass relative z-10 w-full max-w-md rounded-2xl p-6 shadow-2xl" onSubmit={handleSubmit}>
        <div className="mb-6">
          <p className="text-sm font-semibold text-teal-200">Smart Student Tasks</p>
          <h1 className="text-3xl font-black text-white">Forgot password?</h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>
        <div className="space-y-4">
          <label className="text-sm font-semibold">
            Email address
            <input
              className="input mt-1"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </label>
        </div>
        <button className="btn-primary mt-6 w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Send reset link
        </button>
        <p className="mt-4 text-center text-sm text-slate-300">
          Remember your password? <Link className="font-bold text-teal-200" to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}
