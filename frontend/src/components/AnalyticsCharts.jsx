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
    <div className="glass rounded-lg p-5">
      <h2 className="mb-4 text-lg font-black">Task health</h2>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="label" innerRadius={55} outerRadius={90} paddingAngle={4}>
                {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={priorityData}>
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: item.color }} />
            <span>{item.label}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
