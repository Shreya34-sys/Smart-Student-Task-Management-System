import { Copy, Loader2, Mail, X } from "lucide-react";
import { useState } from "react";
import { sendInvite } from "../api/api";
import { useToast } from "../context/ToastContext";

export default function InviteTeammateModal({ open, teams, selectedTeam, onTeamChange, onClose }) {
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  if (!open) return null;

  const closeModal = () => {
    setInviteLink("");
    onClose();
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!selectedTeam) {
      showToast("Create a team before inviting members", "error");
      return;
    }

    setSending(true);
    setInviteLink("");
    try {
      const result = await sendInvite({ projectId: selectedTeam, email });
      if (result.emailSent === false && result.acceptUrl) {
        setInviteLink(result.acceptUrl);
        showToast(result.message || "Invite link created, but email was not sent", "error");
      } else {
        setEmail("");
        showToast(result.message || "Invite email sent");
        closeModal();
      }
    } catch (error) {
      showToast(error.message || "Could not send invite", "error");
    } finally {
      setSending(false);
    }
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      showToast("Invite link copied");
    } catch {
      showToast("Could not copy invite link", "error");
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
          <button className="btn-secondary px-2" onClick={closeModal} type="button" aria-label="Close invite modal">
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
        {inviteLink && (
          <div className="mt-4 rounded-lg border border-amber-300/30 bg-amber-300/10 p-3 text-sm">
            <p className="font-bold text-amber-200">Email was not sent. Share this invite link manually.</p>
            <p className="mt-2 break-all text-xs text-slate-200">{inviteLink}</p>
            <button className="btn-secondary mt-3 w-full" type="button" onClick={copyInviteLink}>
              <Copy className="h-4 w-4" />
              Copy invite link
            </button>
          </div>
        )}
        <button className="btn-primary mt-5 w-full" disabled={!teams.length || sending} type="submit">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          {sending ? "Sending invite..." : "Send invite"}
        </button>
      </form>
    </div>
  );
}
