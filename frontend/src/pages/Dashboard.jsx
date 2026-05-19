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
      <section className="grid gap-5 lg:grid-cols-3">
        <div className="glass rounded-lg p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <CalendarClock className="h-5 w-5 text-teal-600" />
            <h2 className="text-xl font-black">Today at a glance</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Todo" value={analytics.todo} />
            <StatCard label="High priority" value={analytics.highPriority} tone="rose" />
            <StatCard label="Completion rate" value={`${analytics.total ? Math.round((analytics.completed / analytics.total) * 100) : 0}%`} tone="sky" />
          </div>
        </div>
        <div className="glass rounded-lg p-6">
          <div className="mb-4 flex items-center gap-3">
            <Quote className="h-5 w-5 text-teal-600" />
            <h2 className="text-xl font-black">Focus quote</h2>
          </div>
          <p className="text-lg font-semibold leading-relaxed text-slate-700 dark:text-neutral-200">{quote?.text || "Loading inspiration..."}</p>
          <p className="mt-4 text-sm font-bold text-teal-700 dark:text-teal-400">{quote?.author}</p>
        </div>
      </section>
      <section className="grid gap-5 lg:grid-cols-2">
        <AnalyticsCharts analytics={analytics} />
        <AssistantPanel />
      </section>
      <section className="glass rounded-lg p-5">
        <h2 className="mb-4 text-lg font-black">Recent activity</h2>
        <div className="space-y-3 text-sm">
          {activities.length ? activities.map((activity) => (
            <div className="rounded-lg bg-white/70 p-3 dark:bg-neutral-800" key={activity._id}>
              <p className="font-semibold">{activity.action.replaceAll("_", " ")}</p>
              <p className="text-slate-500 dark:text-neutral-400">{new Date(activity.createdAt).toLocaleString()}</p>
            </div>
          )) : <p className="text-slate-500 dark:text-neutral-400">No activity yet.</p>}
        </div>
      </section>
    </motion.div>
  );
}
