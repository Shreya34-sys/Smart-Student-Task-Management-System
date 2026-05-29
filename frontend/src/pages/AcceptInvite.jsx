import { Loader2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { acceptInvite, fetchInvite } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function AcceptInvite() {
  const { token } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    async function loadInvite() {
      try {
        const data = await fetchInvite(token);
        setInvite(data.invite);
      } catch (error) {
        showToast(error.message || "Invite not found", "error");
      } finally {
        setLoading(false);
      }
    }

    loadInvite();
  }, [showToast, token]);

  const accept = async () => {
    if (!user) {
      showToast("Log in with the invited email before accepting", "error");
      navigate("/login");
      return;
    }

    setAccepting(true);
    try {
      await acceptInvite(token);
      showToast("Invite accepted");
      navigate("/app/teams");
    } catch (error) {
      showToast(error.message || "Could not accept invite", "error");
    } finally {
      setAccepting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.18),transparent_28%),linear-gradient(135deg,#020617,#0f172a_48%,#111827)]" />
      <section className="glass relative z-10 w-full max-w-lg rounded-lg p-6 text-center shadow-2xl">
        {loading ? (
          <div className="flex items-center justify-center gap-2 font-semibold">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading invite...
          </div>
        ) : invite ? (
          <>
            <p className="text-sm font-semibold text-teal-200">Smart Student Tasks</p>
            <h1 className="mt-2 text-3xl font-black">Join {invite.project?.name}</h1>
            <p className="mt-3 text-sm text-slate-300">
              {invite.invitedBy?.name || "A teammate"} invited {invite.email} to collaborate.
            </p>
            <p className="mt-2 text-sm text-slate-400">Status: {invite.status}</p>
            {invite.status === "pending" ? (
              <button className="btn-primary mt-6 w-full" disabled={accepting} onClick={accept} type="button">
                {accepting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                {accepting ? "Accepting..." : "Accept invite"}
              </button>
            ) : (
              <Link className="btn-primary mt-6 inline-flex" to="/login">Go to login</Link>
            )}
          </>
        ) : (
          <>
            <h1 className="text-2xl font-black">Invite unavailable</h1>
            <Link className="btn-primary mt-6 inline-flex" to="/">Go home</Link>
          </>
        )}
      </section>
    </main>
  );
}
