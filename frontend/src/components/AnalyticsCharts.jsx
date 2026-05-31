import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AnalyticsCharts({ analytics }) {
  const data = (analytics.statusBreakdown?.length ? analytics.statusBreakdown : [
    { name: "todo", value: analytics.todo || 0 },
    { name: "in-progress", value: analytics.inProgress || 0 },
    { name: "completed", value: analytics.completed || 0 }
  ]).map((item) => ({
    ...item,
    label: item.name === "in-progress" ? "In progress" : item.name[0].toUpperCase() + item.name.slice(1),
    color: item.name === "completed" ? "#0ea5e9" : item.name === "in-progress" ? "#f59e0b" : "#14b8a6"
  }));
  const priorityData = (analytics.priorityBreakdown || []).map((item) => ({
    ...item,
    label: item.name[0].toUpperCase() + item.name.slice(1)
  }));

  return (
    <div className="glass p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">Task Health Analytics</h2>
      </div>
      <div className="grid gap-8 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200/50 bg-white/50 p-4 dark:border-white/5 dark:bg-white/5">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status Breakdown</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="label" innerRadius={70} outerRadius={110} paddingAngle={4}>
                  {data.map((entry) => <Cell key={entry.name} fill={entry.color} stroke="transparent" />)}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tooltip-bg, #fff)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full shadow-sm" style={{ background: item.color }} />
                <span>{item.label}: <span className="font-black text-slate-900 dark:text-white">{item.value}</span></span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-xl border border-slate-200/50 bg-white/50 p-4 dark:border-white/5 dark:bg-white/5">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Priority Breakdown</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 12, fontWeight: 600 }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
