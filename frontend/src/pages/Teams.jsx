import { UserPlus, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useToast } from "../context/ToastContext";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [creating, setCreating] = useState(false);
  const [inviting, setInviting] = useState(false);
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

  useEffect(() => {
    loadTeams();
  }, []);

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

  const invite = async (event) => {
    event.preventDefault();
    if (!selectedTeam) {
      showToast("Create a team before inviting members", "error");
      return;
    }
    setInviting(true);
    try {
      await api.post(`/teams/${selectedTeam}/invite`, { email: inviteEmail });
      setInviteEmail("");
      showToast("Member invited");
      await loadTeams();
    } catch (error) {
      showToast(error.response?.data?.message || "Could not invite member", "error");
    } finally {
      setInviting(false);
    }
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
        <form className="glass rounded-lg p-5" onSubmit={invite}>
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
            <p className="mb-3 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100">
              Create a team first, then choose it here to invite a registered user by email.
            </p>
          )}
          <input className="input" disabled={!teams.length} type="email" placeholder="student@example.com" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} required />
          <button className="btn-primary mt-4" disabled={!teams.length || inviting} type="submit">
            {inviting ? "Inviting..." : "Invite"}
          </button>
        </form>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {teams.map((team) => (
          <article className="glass rounded-lg p-5" key={team._id}>
            <h3 className="text-xl font-black">{team.name}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">{team.description || "No description"}</p>
            <div className="mt-4 space-y-2">
              {team.members?.map((member) => (
                <div className="rounded-lg bg-white/70 p-3 text-sm dark:bg-neutral-800" key={member.user?._id || member.user}>
                  <p className="font-bold">{member.user?.name || "Member"}</p>
                  <p className="text-slate-500 dark:text-neutral-400">{member.user?.email} - {member.role}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </motion.div>
  );
}
