import { useState } from "react";
import { Outlet } from "react-router-dom";
import AssistantPanel from "./AssistantPanel";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.12),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.1),transparent_30%),linear-gradient(135deg,#f8fafc,#f1f5f9_48%,#e2e8f0)] dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.18),transparent_28%),linear-gradient(135deg,#020617,#0f172a_48%,#111827)] transition-all duration-300" />
      <div className="relative z-10 flex min-h-screen">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className="min-w-0 flex-1">
          <Navbar onMenu={() => setOpen(true)} />
          <div className="mx-auto max-w-7xl p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
        <AssistantPanel floating />
      </div>
    </div>
  );
}
