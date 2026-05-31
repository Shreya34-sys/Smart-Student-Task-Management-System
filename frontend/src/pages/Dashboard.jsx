import { CalendarClock, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import AnalyticsCharts from "../components/AnalyticsCharts";
import AssistantPanel from "../components/AssistantPanel";
import Skeleton from "../components/Skeleton";
import StatCard from "../components/StatCard";
import { useToast } from "../context/ToastContext";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState({ total: 0, completed: 0, inProgress: 0, todo: 0, overdue: 0, highPriority: 0 });
  const [quote, setQuote] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const [analyticsResponse, quoteResponse, activityResponse] = await Promise.all([
          api.get("/tasks/analytics"),
          api.get("/external/quote"),
          api.get("/activity")
        ]);
        setAnalytics(analyticsResponse.data.analytics);
        setQuote(quoteResponse.data.quote);
        setActivities(activityResponse.data.activities);
      } catch (error) {
        showToast(error.response?.data?.message || "Could not load dashboard", "error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [showToast]);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading ? Array.from({ length: 4 }).map((_, index) => <Skeleton className="h-32" key={index} />) : (
          <>
            <StatCard label="Total tasks" value={analytics.total} />
            <StatCard label="Completed" value={analytics.completed} tone="sky" />
            <StatCard label="In progress" value={analytics.inProgress} tone="amber" />
            <StatCard label="Overdue" value={analytics.overdue} tone="rose" />
          </>
        )}
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="glass p-7 lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-500/10">
              <CalendarClock className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Today at a glance</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Todo" value={analytics.todo} />
            <StatCard label="High priority" value={analytics.highPriority} tone="rose" />
            <StatCard label="Completion rate" value={`${analytics.total ? Math.round((analytics.completed / analytics.total) * 100) : 0}%`} tone="sky" />
          </div>
        </div>
        <div className="glass relative overflow-hidden p-7">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-amber-200/40 to-transparent blur-3xl dark:from-amber-500/20" />
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10">
              <Quote className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Focus quote</h2>
          </div>
          <div className="relative">
            <Quote className="absolute -left-2 -top-2 h-8 w-8 text-slate-200/50 dark:text-slate-800/50" />
            <p className="relative z-10 text-lg font-bold leading-relaxed text-slate-700 dark:text-slate-200">{quote?.text || "Loading inspiration..."}</p>
            <p className="relative z-10 mt-4 text-sm font-black text-amber-600 dark:text-amber-400">— {quote?.author}</p>
          </div>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <AnalyticsCharts analytics={analytics} />
        <AssistantPanel />
      </section>
      <section className="glass p-6">
        <h2 className="mb-6 text-lg font-black text-slate-900 dark:text-white">Recent Activity Timeline</h2>
        <div className="relative border-l-2 border-slate-200/50 dark:border-white/10 ml-3 space-y-6">
          {activities.length ? activities.map((activity, i) => {
            const actionText = activity.action.replaceAll("_", " ");
            const isCreation = actionText.includes("created");
            return (
              <div className="relative pl-6" key={activity._id}>
                <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-950 ${isCreation ? 'bg-teal-500' : 'bg-blue-500'}`} />
                <div className="rounded-xl border border-slate-200/50 bg-white/60 p-4 shadow-sm transition hover:shadow-md dark:border-white/5 dark:bg-white/5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{actionText}</p>
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                      {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(activity.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            );
          }) : <p className="ml-6 text-sm font-semibold text-slate-500 dark:text-slate-400">No activity yet. Time to get started!</p>}
        </div>
      </section>
    </motion.div>
  );
}
