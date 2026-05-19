import { BarChart3, ClipboardList, ShieldCheck, UsersRound, UserRound, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLogo from "./AppLogo";

const links = [
  { to: "/app", label: "Dashboard", icon: BarChart3 },
  { to: "/app/tasks", label: "Tasks", icon: ClipboardList },
  { to: "/app/teams", label: "Teams", icon: UsersRound },
  { to: "/app/profile", label: "Profile", icon: UserRound }
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const visibleLinks = user?.role === "admin" ? [...links, { to: "/app/admin", label: "Admin", icon: ShieldCheck }] : links;

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-slate-950/40 lg:hidden ${open ? "block" : "hidden"}`} onClick={onClose} />
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-slate-950/80 p-4 backdrop-blur-2xl transition lg:static lg:block lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 flex items-center justify-between">
          <AppLogo size="sm" />
          <button className="rounded-lg border border-white/10 p-2 hover:bg-white/10 lg:hidden" onClick={onClose} aria-label="Close navigation">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-2">
          {visibleLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  isActive ? "bg-teal-300 text-slate-950 shadow-lg shadow-teal-500/20" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
