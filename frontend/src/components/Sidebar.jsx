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
      <div className={`fixed inset-0 z-40 bg-slate-950/20 dark:bg-slate-950/40 lg:hidden ${open ? "block" : "hidden"}`} onClick={onClose} />
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200/80 bg-slate-50 p-5 transition dark:border-white/10 dark:bg-slate-950/90 lg:static lg:block lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-10 flex items-center justify-between">
          <AppLogo size="sm" />
          <button className="rounded-xl border border-slate-200/80 p-2 hover:bg-slate-200/50 dark:border-white/10 dark:hover:bg-white/10 lg:hidden" onClick={onClose} aria-label="Close navigation">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1">
          {visibleLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition group relative overflow-hidden ${
                  isActive ? "bg-white text-teal-600 shadow-sm ring-1 ring-slate-200/80 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-400/30" : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-teal-500 dark:bg-teal-400" />}
                  <Icon className={`h-5 w-5 transition ${isActive ? "text-teal-500 dark:text-teal-300" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
