import { useGoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import { useState } from "react";

/**
 * Custom-styled "Continue with Google" button.
 * Uses useGoogleLogin hook (implicit flow) to get an access token,
 * then fetches the user's profile from Google's userinfo endpoint
 * and passes the profile data to the parent via onSuccess.
 *
 * @param {Object} props
 * @param {function} props.onSuccess - Called with { accessToken, profile } on success
 * @param {function} props.onError - Called with error message on failure
 * @param {string} [props.label] - Button label (default: "Continue with Google")
 * @param {boolean} [props.disabled] - Whether button is disabled
 */
export default function GoogleAuthButton({ onSuccess, onError, label = "Continue with Google", disabled = false }) {
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // Fetch user profile using the access token
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch Google profile");

        const profile = await res.json();
        onSuccess({
          accessToken: tokenResponse.access_token,
          profile
        });
      } catch (err) {
        onError?.(err.message || "Google login failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      onError?.("Google login was cancelled");
    }
  });

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={() => googleLogin()}
      className="group relative flex w-full items-center justify-center gap-3 rounded-xl
                 border border-slate-600/50 bg-slate-800/60 px-5 py-3.5
                 text-sm font-semibold text-slate-200
                 shadow-lg shadow-black/10 backdrop-blur-sm
                 transition-all duration-300 ease-out
                 hover:border-teal-400/50 hover:bg-slate-700/70 hover:text-white hover:shadow-teal-500/10
                 focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:ring-offset-2 focus:ring-offset-slate-950
                 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {/* Gradient glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
           style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.06), rgba(56,189,248,0.06))" }} />

      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-teal-300" />
      ) : (
        /* Google "G" logo SVG */
        <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      )}

      <span className="relative z-10">{loading ? "Connecting..." : label}</span>
    </button>
  );
}
