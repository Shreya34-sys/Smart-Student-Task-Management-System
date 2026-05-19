import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import Skeleton from "../components/Skeleton";
import { useToast } from "../context/ToastContext";

const roles = ["student", "mentor", "admin"];

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadUsers() {
      try {
        const { data } = await api.get("/admin/users");
        setUsers(data.users);
      } catch (error) {
        showToast(error.response?.data?.message || "Could not load users", "error");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [showToast]);

  const updateRole = async (userId, role) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/role`, { role });
      setUsers((current) => current.map((user) => (user._id === userId ? data.user : user)));
      showToast("Role updated");
    } catch (error) {
      showToast(error.response?.data?.message || "Could not update role", "error");
    }
  };

  return (
    <motion.section className="space-y-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-teal-600" />
        <div>
          <h2 className="text-2xl font-black">Role management</h2>
          <p className="text-sm text-slate-500 dark:text-neutral-400">Assign access levels for students, mentors, and admins.</p>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-80" />
      ) : (
        <div className="glass overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-neutral-800">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500 dark:text-neutral-400">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {users.map((user) => (
                <tr className="transition hover:bg-white/70 dark:hover:bg-neutral-800/60" key={user._id}>
                  <td className="px-4 py-4 font-bold">{user.name}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-neutral-300">{user.email}</td>
                  <td className="px-4 py-4">{user.course || "General"}</td>
                  <td className="px-4 py-4">
                    <select className="input min-w-36" value={user.role} onChange={(event) => updateRole(user._id, event.target.value)}>
                      {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.section>
  );
}
