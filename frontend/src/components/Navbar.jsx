import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AppLogo from "./AppLogo";

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/65 backdrop-blur-2xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <button className="rounded-lg border border-white/10 p-2 text-slate-200 hover:bg-white/10 lg:hidden" onClick={onMenu} aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <AppLogo size="sm" />
        </div>
        <div className="sm:hidden">
          <AppLogo showText={false} size="sm" />
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary px-3" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode">
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-slate-100 backdrop-blur-xl sm:flex">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: user?.avatarColor || "#14b8a6" }} />
            {user?.name}
          </div>
          <button className="btn-secondary px-3" onClick={logout} aria-label="Log out">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
