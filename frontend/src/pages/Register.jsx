import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { CheckCircle2, Loader2, MessageCircle, UserPlus } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { firebaseAuth, isFirebaseConfigured } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { passwordStrength } from "../utils/passwordStrength";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", course: "", phone: "", password: "", confirmPassword: "" });
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);
  const recaptchaVerifierRef = useRef(null);
  const { register, googleLogin, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const strength = useMemo(() => passwordStrength(form.password), [form.password]);
  const passwordsMatch = form.password && form.password === form.confirmPassword;

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (name === "phone") {
      setPhoneVerified(false);
      setConfirmationResult(null);
      setOtp("");
    }
  };

  const getRecaptchaVerifier = () => {
    if (!firebaseAuth) {
      throw new Error("Firebase phone authentication is not configured");
    }

    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(firebaseAuth, "register-recaptcha-container", {
        size: "invisible"
      });
    }

    return recaptchaVerifierRef.current;
  };

  const sendSmsCode = async () => {
    const phone = form.phone.trim();
    if (!isFirebaseConfigured || !firebaseAuth) {
      showToast("Firebase phone authentication is not configured", "error");
      return;
    }

    if (!phone.startsWith("+") || phone.length < 8) {
      showToast("Enter phone number with country code, for example +919876543210", "error");
      return;
    }

    setSmsLoading(true);
    try {
      const verifier = getRecaptchaVerifier();
      const result = await signInWithPhoneNumber(firebaseAuth, phone, verifier);
      setConfirmationResult(result);
      showToast("Verification code sent");
    } catch (error) {
      showToast(error.message || "Could not send SMS verification code", "error");
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    } finally {
      setSmsLoading(false);
    }
  };

  const verifySmsCode = async () => {
    if (!confirmationResult) {
      showToast("Send an SMS code first", "error");
      return;
    }

    if (!otp.trim()) {
      showToast("Enter the verification code", "error");
      return;
    }

    setSmsLoading(true);
    try {
      await confirmationResult.confirm(otp.trim());
      setPhoneVerified(true);
      showToast("Phone number verified");
    } catch (error) {
      showToast(error.message || "Invalid verification code", "error");
    } finally {
      setSmsLoading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!passwordsMatch) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (!phoneVerified) {
      showToast("Verify your phone number before creating an account", "error");
      return;
    }

    try {
      await register({ ...form, phoneVerified });
      showToast("Account created");
      navigate("/app");
    } catch (error) {
      const message = error.response?.data?.message || (error.request ? "Backend server is not running. Start the API and try again." : "Registration failed");
      showToast(message, "error");
    }
  };

  const handleGoogle = async (profile) => {
    try {
      await googleLogin(profile);
      showToast("Account created with Google");
      navigate("/app");
    } catch (error) {
      const message = error.response?.data?.message || (error.request ? "Network error while contacting the server" : "Google signup failed");
      showToast(message, "error");
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
          <div className="space-y-3 sm:col-span-2">
            <label className="text-sm font-semibold">
              Phone number
              <input className="input mt-1" type="tel" name="phone" value={form.phone} onChange={update} placeholder="+919876543210" required />
            </label>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <input
                className="input"
                inputMode="numeric"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                placeholder="Enter SMS code"
                disabled={!confirmationResult || phoneVerified}
              />
              {phoneVerified ? (
                <span className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified
                </span>
              ) : confirmationResult ? (
                <button className="btn-secondary" type="button" onClick={verifySmsCode} disabled={smsLoading}>
                  {smsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Verify
                </button>
              ) : (
                <button className="btn-secondary" type="button" onClick={sendSmsCode} disabled={smsLoading || !form.phone.trim()}>
                  {smsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                  Send OTP
                </button>
              )}
            </div>
            <div id="register-recaptcha-container" />
          </div>
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
        <button className="btn-primary mt-6 w-full" disabled={loading || !passwordsMatch || !phoneVerified}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Create account
        </button>
        <div className="mt-5">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-600/60" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-600/60" />
          </div>
          <div className="mt-4">
            <GoogleAuthButton
              onSuccess={handleGoogle}
              onError={(msg) => showToast(msg, "error")}
              disabled={loading}
            />
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-slate-300">
          Already registered? <Link className="font-bold text-teal-200" to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}
