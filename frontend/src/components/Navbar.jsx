import { LogOut, Menu, Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AppLogo from "./AppLogo";

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [themeOpen, setThemeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const themeRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (themeRef.current && !themeRef.current.contains(event.target)) setThemeOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor }
  ];

  const ActiveIcon = themeOptions.find((opt) => opt.value === theme)?.icon || Monitor;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/70 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/65">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button className="rounded-xl border border-slate-200/80 p-2 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10 lg:hidden" onClick={onMenu} aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden sm:block lg:hidden">
            <AppLogo size="sm" />
          </div>
          <div className="sm:hidden">
            <AppLogo showText={false} size="sm" />
          </div>

          <div className="hidden lg:block">
            <h1 className="text-lg font-black text-slate-900 dark:text-white">
              Good morning{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! <span className="text-xl">👋</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Dropdown */}
          <div className="relative" ref={themeRef}>
            <button
              className="btn-secondary px-2.5 shadow-none dark:border-white/10"
              onClick={() => setThemeOpen(!themeOpen)}
              aria-label="Select theme"
            >
              <ActiveIcon className="h-4 w-4" />
            </button>
            {themeOpen && (
              <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl border border-slate-200/80 bg-white/95 p-1.5 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 dark:shadow-slate-950/50 z-50 animate-fade-in">
                {themeOptions.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => { setTheme(value); setThemeOpen(false); }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                      theme === value
                        ? "bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/50 p-1.5 pr-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-white/5"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white shadow-inner" style={{ background: user?.avatarColor || "#14b8a6" }}>
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
              <span className="hidden sm:block">{user?.name}</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-200/80 bg-white/95 p-1.5 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 dark:shadow-slate-950/50 z-50 animate-fade-in">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Account</div>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
