import { Save } from "lucide-react";
import { useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const colors = ["#14b8a6", "#0ea5e9", "#f43f5e", "#f59e0b", "#8b5cf6"];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || "",
    course: user?.course || "",
    avatarColor: user?.avatarColor || colors[0]
  });

  const submit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.patch("/auth/profile", form);
      updateUser(data.user);
      showToast("Profile updated");
    } catch (error) {
      showToast(error.response?.data?.message || "Could not update profile", "error");
    }
  };

  return (
    <form className="glass max-w-2xl rounded-lg p-6 animate-fade-in" onSubmit={submit}>
      <div className="mb-6 flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-lg text-xl font-black text-white" style={{ background: form.avatarColor }}>
          {form.name?.slice(0, 2).toUpperCase() || "ST"}
        </div>
        <div>
          <h2 className="text-2xl font-black">Profile</h2>
          <p className="text-sm text-slate-500 dark:text-neutral-400">{user?.email} - {user?.role || "student"}</p>
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-sm font-semibold">
          Name
          <input className="input mt-1" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </label>
        <label className="text-sm font-semibold">
          Course
          <input className="input mt-1" value={form.course} onChange={(event) => setForm({ ...form, course: event.target.value })} />
        </label>
        <div>
          <p className="mb-2 text-sm font-semibold">Avatar color</p>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                className={`h-9 w-9 rounded-full border-2 ${form.avatarColor === color ? "border-slate-950 dark:border-white" : "border-transparent"}`}
                style={{ background: color }}
                onClick={() => setForm({ ...form, avatarColor: color })}
                aria-label={`Choose ${color}`}
              />
            ))}
          </div>
        </div>
      </div>
      <button className="btn-primary mt-6">
        <Save className="h-4 w-4" />
        Save profile
      </button>
    </form>
  );
}
