import { CheckCircle2, Pencil, Trash2 } from "lucide-react";

const statusLabels = {
  todo: "Todo",
  "in-progress": "In progress",
  completed: "Completed"
};

export default function TaskTable({ tasks, onEdit, onDelete, onStatus }) {
  if (!tasks.length) {
    return <div className="glass rounded-lg p-8 text-center text-sm font-semibold text-slate-500 dark:text-neutral-400">No tasks match your filters.</div>;
  }

  return (
    <div className="glass overflow-x-auto rounded-lg">
      <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-neutral-800">
        <thead>
          <tr className="text-left text-xs uppercase text-slate-500 dark:text-neutral-400">
            <th className="px-4 py-3">Task</th>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">Team</th>
            <th className="px-4 py-3">Due</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
          {tasks.map((task) => (
            <tr key={task._id} className="transition hover:bg-white/70 dark:hover:bg-neutral-800/60">
              <td className="max-w-xs px-4 py-4">
                <p className="font-bold text-slate-900 dark:text-white">{task.title}</p>
                <p className="truncate text-slate-500 dark:text-neutral-400">{task.description}</p>
              </td>
              <td className="px-4 py-4">{task.subject || "General"}</td>
              <td className="px-4 py-4">{task.team?.name || "Personal"}</td>
              <td className="px-4 py-4">{new Date(task.dueDate).toLocaleDateString()}</td>
              <td className="px-4 py-4 capitalize">{task.priority}</td>
              <td className="px-4 py-4">
                <select className="input min-w-36" value={task.status} onChange={(event) => onStatus(task, event.target.value)}>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <button className="btn-secondary px-3" onClick={() => onEdit(task)} aria-label="Edit task">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button className="btn-secondary px-3" onClick={() => onStatus(task, "completed")} aria-label="Mark complete">
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <button className="btn-secondary px-3 text-rose-600" onClick={() => onDelete(task._id)} aria-label="Delete task">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
