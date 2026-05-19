import { BarChart3, CheckCircle2, Github, LayoutDashboard, LockKeyhole, Mail, Menu, Smartphone, Twitter, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AppLogo from "../components/AppLogo";

const features = [
  {
    icon: CheckCircle2,
    title: "Task Management",
    description: "Create, organize, filter, and complete student tasks with a clean workflow."
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track progress with focused dashboard stats and visual productivity insights."
  },
  {
    icon: LockKeyhole,
    title: "Secure Login",
    description: "JWT authentication keeps private tasks and profile data protected."
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Use the platform comfortably on desktop, tablet, and mobile screens."
  }
];

function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl animate-fade-in">
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-teal-400/20 via-sky-500/20 to-violet-500/20 blur-3xl" />
      <div className="relative rounded-[1.5rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl">
        <div className="rounded-[1.1rem] bg-slate-950/90 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <span className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-bold text-teal-200">Live dashboard</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Total", "24"],
              ["Done", "16"],
              ["Overdue", "03"]
            ].map(([label, value]) => (
              <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3" key={label}>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-1 text-2xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["Todo", "In Progress", "Completed"].map((column, index) => (
              <div className="min-h-44 rounded-xl border border-white/10 bg-white/[0.04] p-3" key={column}>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">{column}</p>
                {Array.from({ length: index + 1 }).map((_, taskIndex) => (
                  <div className="mb-3 rounded-lg bg-slate-900 p-3 shadow-lg transition hover:-translate-y-1 hover:bg-slate-800" key={taskIndex}>
                    <div className="mb-2 h-1.5 rounded-full bg-gradient-to-r from-teal-300 to-sky-400" />
                    <p className="text-xs font-semibold text-white">{["Math assignment", "Science notes", "Project review"][taskIndex]}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.28),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.22),transparent_30%),linear-gradient(135deg,#020617,#0f172a_45%,#111827)]" />

      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <Link className="flex items-center gap-3" to="/">
          <AppLogo />
        </Link>
        <div className="hidden items-center gap-8 text-sm font-semibold text-slate-300 md:flex">
          <a className="transition hover:text-white" href="#home">Home</a>
          <a className="transition hover:text-white" href="#features">Features</a>
          <a className="transition hover:text-white" href="#contact">Contact</a>
        </div>
        <div className="hidden md:block">
          <Link className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-bold text-white backdrop-blur-xl transition hover:border-teal-300 hover:bg-teal-300 hover:text-slate-950" to="/login">
            Login
          </Link>
        </div>
        <button className="rounded-lg border border-white/10 p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="relative z-20 mx-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:hidden">
          <a className="block rounded-lg px-3 py-2 text-slate-200" href="#home">Home</a>
          <a className="block rounded-lg px-3 py-2 text-slate-200" href="#features">Features</a>
          <a className="block rounded-lg px-3 py-2 text-slate-200" href="#contact">Contact</a>
          <Link className="mt-2 block rounded-lg bg-teal-300 px-3 py-2 text-center font-bold text-slate-950" to="/login">Login</Link>
        </div>
      )}

      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 pb-24 pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center" id="home">
        <div className="animate-fade-in">
          <p className="mb-4 inline-flex rounded-full border border-teal-300/25 bg-teal-300/10 px-4 py-2 text-sm font-semibold text-teal-100">
            Student productivity, simplified
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Smart Student Task Management System
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Plan assignments, manage deadlines, track progress, and stay focused with a secure modern productivity dashboard built for students.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-300 px-6 py-3 font-black text-slate-950 shadow-lg shadow-teal-500/20 transition hover:-translate-y-1 hover:bg-teal-200" to="/register">
              Get Started
              <LayoutDashboard className="h-4 w-4" />
            </Link>
            <a className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-xl transition hover:-translate-y-1 hover:border-sky-300" href="#features">
              Explore Features
            </a>
          </div>
        </div>
        <DashboardMockup />
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-20" id="features">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-200">Features</p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">Everything students need to stay organized.</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <article className="group rounded-2xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-teal-300/50 hover:bg-white/[0.14]" key={title}>
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-teal-300 to-sky-400 text-slate-950 shadow-lg shadow-teal-500/20 transition group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-20">
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-200">About</p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">Built for better academic focus.</h2>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Smart Student Task Management System helps students turn scattered assignments, projects, and reminders into a clear daily workflow. The platform combines secure accounts, task tracking, analytics, and responsive design in one simple dashboard.
          </p>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-4 py-10" id="contact">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <AppLogo />
            <p className="mt-3 text-sm text-slate-400">© 2026 Smart Student Task Management System. All rights reserved.</p>
          </div>
          <div className="flex gap-3">
            <a className="rounded-full border border-white/10 bg-white/10 p-3 text-slate-300 transition hover:-translate-y-1 hover:text-white" href="https://github.com" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
            <a className="rounded-full border border-white/10 bg-white/10 p-3 text-slate-300 transition hover:-translate-y-1 hover:text-white" href="https://twitter.com" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a className="rounded-full border border-white/10 bg-white/10 p-3 text-slate-300 transition hover:-translate-y-1 hover:text-white" href="mailto:hello@smartstudent.local" aria-label="Email">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
