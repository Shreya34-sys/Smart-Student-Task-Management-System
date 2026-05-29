import { useState, useEffect } from "react";
import { Lock, Loader2, ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { resetPassword } from "../api/api";

function PasswordStrengthIndicator({ password }) {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength();
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-teal-500", "bg-green-500"];

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i < strength ? strengthColors[strength - 1] : "bg-slate-700"}`}
          />
        ))}
      </div>
      {password && (
        <p className={`text-xs ${strength < 2 ? "text-red-400" : strength < 4 ? "text-yellow-400" : "text-green-400"}`}>
          Password strength: <strong>{strengthLabels[strength]}</strong>
        </p>
      )}
    </div>
  );
}

function PasswordRequirements({ password }) {
  const requirements = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Mix of uppercase and lowercase", met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: "At least one number", met: /\d/.test(password) },
    { label: "At least one special character", met: /[^a-zA-Z\d]/.test(password) }
  ];

  return (
    <div className="space-y-2">
      {requirements.map((req) => (
        <div key={req.label} className="flex items-center gap-2 text-sm">
          {req.met ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <X className="h-4 w-4 text-slate-500" />
          )}
          <span className={req.met ? "text-green-400" : "text-slate-400"}>
            {req.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      showToast("Invalid reset link", "error");
      navigate("/login");
    }
  }, [token, navigate, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters long", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        token,
        password,
        confirmPassword
      });
      showToast("Password reset successfully! Redirecting to login...", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      showToast(error.message || "Failed to reset password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.18),transparent_28%),linear-gradient(135deg,#020617,#0f172a_48%,#111827)]" />
      <form className="glass relative z-10 w-full max-w-md rounded-2xl p-6 shadow-2xl" onSubmit={handleSubmit}>
        <div className="mb-6">
          <p className="text-sm font-semibold text-teal-200">Smart Student Tasks</p>
          <h1 className="text-3xl font-black text-white">Create new password</h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter a strong password to secure your account.
          </p>
        </div>

        <div className="space-y-4">
          {/* New Password */}
          <label className="text-sm font-semibold">
            New password
            <div className="relative mt-1">
              <input
                className="input pr-10"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {/* Confirm Password */}
          <label className="text-sm font-semibold">
            Confirm password
            <div className="relative mt-1">
              <input
                className="input pr-10"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
        </div>

        {/* Password Requirements */}
        {password && (
          <div className="mt-4 space-y-3 rounded-lg bg-slate-800/50 p-3">
            <PasswordStrengthIndicator password={password} />
            <PasswordRequirements password={password} />
          </div>
        )}

        {/* Match Indicator */}
        {password && confirmPassword && (
          <div className={`mt-3 rounded p-2 text-sm ${password === confirmPassword ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
            {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
          </div>
        )}

        <button className="btn-primary mt-6 w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          Reset password
        </button>

        <p className="mt-4 text-center text-sm text-slate-300">
          <Link className="inline-flex items-center gap-1 font-bold text-teal-200 hover:text-teal-100" to="/login">
            <ArrowLeft className="h-3 w-3" />
            Back to login
          </Link>
        </p>
      </form>
    </main>
  );
}
