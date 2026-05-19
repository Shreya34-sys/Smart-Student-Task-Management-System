import { Loader2, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";

const initial = {
  title: "",
  subject: "",
  description: "",
  dueDate: "",
  priority: "medium",
  status: "todo",
  team: ""
};

export default function TaskForm({ selectedTask, onSubmit, onCancel, saving, teams = [] }) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (selectedTask) {
      setForm({
        title: selectedTask.title || "",
        subject: selectedTask.subject || "",
        description: selectedTask.description || "",
        dueDate: selectedTask.dueDate?.slice(0, 10) || "",
        priority: selectedTask.priority || "medium",
        status: selectedTask.status || "todo",
        team: selectedTask.team?._id || selectedTask.team || ""
      });
    } else {
      setForm(initial);
    }
  }, [selectedTask]);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    if (form.title.trim().length < 3) return;
    onSubmit(form);
  };

  return (
    <form className="glass rounded-lg p-5" onSubmit={submit}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">{selectedTask ? "Edit task" : "Create task"}</h2>
        {selectedTask && (
          <button type="button" className="text-sm font-semibold text-slate-500 hover:text-teal-600" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold">
          Title
          <input className="input mt-1" name="title" value={form.title} onChange={update} minLength={3} required />
        </label>
        <label className="text-sm font-semibold">
          Subject
          <input className="input mt-1" name="subject" value={form.subject} onChange={update} placeholder="Mathematics" />
        </label>
        <label className="text-sm font-semibold">
          Due date
          <input className="input mt-1" type="date" name="dueDate" value={form.dueDate} onChange={update} required />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold">
            Priority
            <select className="input mt-1" name="priority" value={form.priority} onChange={update}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            Status
            <select className="input mt-1" name="status" value={form.status} onChange={update}>
              <option value="todo">Todo</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </div>
        <label className="text-sm font-semibold md:col-span-2">
          Team
          <select className="input mt-1" name="team" value={form.team} onChange={update}>
            <option value="">Personal task</option>
            {teams.map((team) => <option key={team._id} value={team._id}>{team.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold md:col-span-2">
          Description
          <textarea className="input mt-1 min-h-24" name="description" value={form.description} onChange={update} />
        </label>
      </div>
      <button className="btn-primary mt-5" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : selectedTask ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {selectedTask ? "Update task" : "Add task"}
      </button>
    </form>
  );
}
