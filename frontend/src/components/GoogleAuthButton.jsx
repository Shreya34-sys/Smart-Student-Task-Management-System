import { GoogleAuthProvider, getRedirectResult, signInWithPopup } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { firebaseAuth, googleProvider, isFirebaseConfigured } from "../config/firebase";

export default function GoogleAuthButton({ onSuccess, onError, label = "Continue with Google", disabled = false }) {
  const [loading, setLoading] = useState(false);

  // Handle redirect result when the page reloads after Google sign-in
  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth) return;

    let cancelled = false;
    getRedirectResult(firebaseAuth)
      .then((result) => {
        if (!result || cancelled) return;
        const { displayName, email, photoURL, uid } = result.user;
        if (!email) return;

        const credential = GoogleAuthProvider.credentialFromResult(result);
        const googleAccessToken = credential?.accessToken || null;

        onSuccess({
          name: displayName || email.split("@")[0],
          email,
          avatar: photoURL || "",
          accessToken: googleAccessToken,
          firebaseUid: uid
        });
      })
      .catch(() => {
        // Silently ignore — user may not have come from a redirect
      });

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = async () => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      onError?.("Firebase Google authentication is not configured");
      return;
    }

    setLoading(true);
    try {
      // Try popup first; fall back to redirect if COOP blocks it
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const { displayName, email, photoURL, uid } = result.user;

      if (!email) {
        throw new Error("Your Google account did not share an email address");
      }

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const googleAccessToken = credential?.accessToken || null;

      await onSuccess({
        name: displayName || email.split("@")[0],
        email,
        avatar: photoURL || "",
        accessToken: googleAccessToken,
        firebaseUid: uid
      });
    } catch (error) {
      // If popup is blocked by COOP or browser, the error will surface here.
      // Common COOP-related codes: auth/popup-blocked, auth/popup-closed-by-user
      const messages = {
        "auth/popup-closed-by-user": "Google sign-in popup was closed",
        "auth/cancelled-popup-request": "Google sign-in was cancelled",
        "auth/popup-blocked": "Google sign-in popup was blocked by the browser",
        "auth/network-request-failed": "Network error while signing in with Google",
        "auth/unauthorized-domain": "This domain is not authorized for Firebase Google sign-in",
        "auth/account-exists-with-different-credential": "An account already exists with a different sign-in method"
      };

      onError?.(messages[error.code] || error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={handleClick}
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

