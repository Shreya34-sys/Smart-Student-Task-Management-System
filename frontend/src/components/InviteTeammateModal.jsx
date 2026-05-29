import { Loader2, Mail, X } from "lucide-react";
import { useState } from "react";
import { sendInvite } from "../api/api";
import { useToast } from "../context/ToastContext";

export default function InviteTeammateModal({ open, teams, selectedTeam, onTeamChange, onClose }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  if (!open) return null;

  const submit = async (event) => {
    event.preventDefault();
    if (!selectedTeam) {
      showToast("Create a team before inviting members", "error");
      return;
    }

    setSending(true);
    try {
      await sendInvite({ projectId: selectedTeam, email });
      setEmail("");
      showToast("Invite email sent");
      onClose();
    } catch (error) {
      showToast(error.message || "Could not send invite", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <form className="glass w-full max-w-md rounded-lg p-5 shadow-2xl" onSubmit={submit}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-teal-300">Smart Student Tasks</p>
            <h2 className="text-xl font-black">Invite teammate</h2>
          </div>
          <button className="btn-secondary px-2" onClick={onClose} type="button" aria-label="Close invite modal">
            <X className="h-4 w-4" />
          </button>
        </div>
        <label className="text-sm font-semibold">
          Team
          <select className="input mt-1" disabled={!teams.length} value={selectedTeam} onChange={(event) => onTeamChange(event.target.value)}>
            {!teams.length && <option value="">Create a team first</option>}
            {teams.map((team) => <option key={team._id} value={team._id}>{team.name}</option>)}
          </select>
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Teammate email
          <input className="input mt-1" type="email" placeholder="student@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <button className="btn-primary mt-5 w-full" disabled={!teams.length || sending} type="submit">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          {sending ? "Sending invite..." : "Send invite"}
        </button>
      </form>
    </div>
  );
}
