import { Clock, Mail, UserPlus, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { api } from "../api/axios";
import { fetchTeamInvites } from "../api/api";
import InviteTeammateModal from "../components/InviteTeammateModal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

/** Avatar circle — shows Google profile picture or initials with a fallback color */
function MemberAvatar({ member }) {
  const user = member.user || {};
  const name = user.name || "?";
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const color = user.avatarColor || "#14b8a6";

  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={name}
        className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-white/10"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

/** Status badge for invite status */
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-400/15 dark:text-amber-300 dark:border-amber-400/30",
    accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-400/15 dark:text-emerald-300 dark:border-emerald-400/30",
    expired: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-400/15 dark:text-slate-400 dark:border-slate-400/30"
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${styles[status] || styles.pending}`}>
      {status === "pending" && <Clock className="h-3 w-3" />}
      {status}
    </span>
  );
}

/** Role badge for team members */
function RoleBadge({ role, isOwner }) {
  if (isOwner) {
    return <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-teal-600 border border-teal-500/20 dark:bg-teal-400/15 dark:text-teal-300 dark:border-teal-400/30">Owner</span>;
  }
  if (role === "lead") {
    return <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 border border-blue-500/20 dark:bg-blue-400/15 dark:text-blue-300 dark:border-blue-400/30">Lead</span>;
  }
  return <span className="rounded-full bg-slate-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 border border-slate-500/20 dark:bg-slate-400/15 dark:text-slate-400 dark:border-slate-400/30">Member</span>;
}

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [selectedTeam, setSelectedTeam] = useState("");
  const [creating, setCreating] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [pendingInvites, setPendingInvites] = useState([]);
  const { user } = useAuth();
  const { showToast } = useToast();

  const loadTeams = async () => {
    try {
      const { data } = await api.get("/teams");
      setTeams(data.teams);
      if (!selectedTeam && data.teams[0]) setSelectedTeam(data.teams[0]._id);
      if (selectedTeam && !data.teams.some((team) => team._id === selectedTeam)) {
        setSelectedTeam(data.teams[0]?._id || "");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Could not load teams", "error");
    }
  };

  const loadInvites = useCallback(async (teamId) => {
    if (!teamId) return;
    try {
      const data = await fetchTeamInvites(teamId);
      setPendingInvites(data.invites || []);
    } catch {
      setPendingInvites([]);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    loadInvites(selectedTeam);
  }, [selectedTeam, loadInvites]);

  const createTeam = async (event) => {
    event.preventDefault();
    setCreating(true);
    try {
      const { data } = await api.post("/teams", form);
      setForm({ name: "", description: "" });
      setSelectedTeam(data.team?._id || "");
      showToast("Team created");
      await loadTeams();
    } catch (error) {
      showToast(error.response?.data?.message || "Could not create team", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleInviteSent = () => {
    setInviteOpen(false);
    loadInvites(selectedTeam);
  };

  return (
    <motion.div className="grid gap-6 lg:grid-cols-[360px_1fr]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <section className="space-y-4">
        <form className="glass rounded-lg p-5" onSubmit={createTeam}>
          <div className="mb-4 flex items-center gap-3">
            <UsersRound className="h-5 w-5 text-teal-600" />
            <h2 className="text-lg font-black">Create team</h2>
          </div>
          <label className="text-sm font-semibold">
            Team name
            <input className="input mt-1" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label className="mt-3 block text-sm font-semibold">
            Description
            <textarea className="input mt-1 min-h-24" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </label>
          <button className="btn-primary mt-4" disabled={creating} type="submit">
            {creating ? "Creating..." : "Create team"}
          </button>
        </form>
        <div className="glass rounded-lg p-5">
          <div className="mb-4 flex items-center gap-3">
            <UserPlus className="h-5 w-5 text-teal-600" />
            <h2 className="text-lg font-black">Invite member</h2>
          </div>
          <select
            className="input mb-3"
            disabled={!teams.length}
            value={selectedTeam}
            onChange={(event) => setSelectedTeam(event.target.value)}
          >
            {!teams.length && <option value="">Create a team first</option>}
            {teams.map((team) => <option key={team._id} value={team._id}>{team.name}</option>)}
          </select>
          {!teams.length && (
            <p className="mb-3 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-800 dark:text-cyan-100">
              Create a team first, then choose it here to invite a teammate by email.
            </p>
          )}
          <button className="btn-primary mt-4" disabled={!teams.length} onClick={() => setInviteOpen(true)} type="button">
            <UserPlus className="h-4 w-4" />
            Invite teammate
          </button>
        </div>

        {/* Pending Invites Section */}
        {pendingInvites.length > 0 && (
          <div className="glass rounded-lg p-5">
            <div className="mb-4 flex items-center gap-3">
              <Mail className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-black">Sent invites</h2>
            </div>
            <div className="space-y-2">
              {pendingInvites.map((invite) => (
                <div className="flex items-center justify-between rounded-lg bg-black/5 dark:bg-white/5 p-3 text-sm" key={invite._id}>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{invite.email}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      by {invite.invitedBy?.name || "Unknown"} · {new Date(invite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={invite.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {teams.map((team) => (
          <article className="glass rounded-lg p-5" key={team._id}>
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-xl font-black">{team.name}</h3>
              <span className="rounded-full bg-teal-500/10 dark:bg-teal-400/10 px-2.5 py-0.5 text-xs font-bold text-teal-600 dark:text-teal-300">
                {(team.members?.length || 0)} {team.members?.length === 1 ? "member" : "members"}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">{team.description || "No description"}</p>
            <div className="mt-4 space-y-2">
              {team.members?.map((member) => (
                <div className="flex items-center gap-3 rounded-lg bg-black/5 dark:bg-white/5 p-3 text-sm" key={member.user?._id || member.user}>
                  <MemberAvatar member={member} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{member.user?.name || "Member"}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{member.user?.email}</p>
                  </div>
                  <RoleBadge role={member.role} isOwner={team.owner === member.user?._id || team.owner?._id === member.user?._id} />
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
      <InviteTeammateModal
        open={inviteOpen}
        teams={teams}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
        onClose={handleInviteSent}
      />
    </motion.div>
  );
}

