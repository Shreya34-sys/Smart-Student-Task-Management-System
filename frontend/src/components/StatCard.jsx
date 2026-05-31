import { AlertCircle, CheckCircle2, CircleDashed, Flame, ListTodo, Timer, TrendingUp } from "lucide-react";

export default function StatCard({ label, value, tone = "teal" }) {
  const tones = {
    teal: "text-teal-600 bg-teal-50 dark:text-teal-300 dark:bg-teal-500/20",
    rose: "text-rose-600 bg-rose-50 dark:text-rose-300 dark:bg-rose-500/20",
    amber: "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/20",
    sky: "text-sky-600 bg-sky-50 dark:text-sky-300 dark:bg-sky-500/20"
  };

  const getIcon = (labelText) => {
    const map = {
      "total tasks": ListTodo,
      completed: CheckCircle2,
      "in progress": Timer,
      overdue: AlertCircle,
      todo: CircleDashed,
      "high priority": Flame,
      "completion rate": TrendingUp
    };
    return map[labelText.toLowerCase()] || ListTodo;
  };

  const Icon = getIcon(label);
  
  // Placeholder mock trend for UI demonstration
  const trendPositive = ["completed", "total tasks", "completion rate"].includes(label.toLowerCase());

  return (
    <div className="glass group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-teal-900/20">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-white/40 to-transparent blur-2xl transition group-hover:scale-150 dark:from-white/5" />
      
      <div className="flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${trendPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'}`}>
          <TrendingUp className={`h-3 w-3 ${trendPositive ? '' : 'rotate-180'}`} />
          <span>{trendPositive ? '+12%' : '-2%'}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
