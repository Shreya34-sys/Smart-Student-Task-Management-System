import { Download, Loader2, Mail, Rows3, Search, SquareKanban, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api } from "../api/axios";
import { createTask, deleteTask as removeTask, fetchTasks, updateTask } from "../api/api";
import KanbanBoard from "../components/KanbanBoard";
import Skeleton from "../components/Skeleton";
import TaskForm from "../components/TaskForm";
import TaskTable from "../components/TaskTable";
import { useToast } from "../context/ToastContext";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "all", priority: "all", sortBy: "dueDate" });
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView] = useState("table");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const { showToast } = useToast();

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTasks(filters);
      setTasks(data.tasks);
    } catch (error) {
      showToast(error.message || "Could not load tasks", "error");
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    const timeout = setTimeout(loadTasks, 250);
    return () => clearTimeout(timeout);
  }, [loadTasks]);

  useEffect(() => {
    async function loadTeams() {
      try {
        const { data } = await api.get("/teams");
        setTeams(data.teams);
      } catch {
        setTeams([]);
      }
    }

    loadTeams();
  }, []);

  const saveTask = async (payload) => {
    setSaving(true);
    try {
      if (selectedTask) {
        await updateTask(selectedTask._id, payload);
        showToast("Task updated");
      } else {
        await createTask(payload);
        showToast("Task created");
      }
      setSelectedTask(null);
      await loadTasks();
    } catch (error) {
      showToast(error.message || "Could not save task", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      await removeTask(id);
      showToast("Task deleted");
      setTasks((current) => current.filter((task) => task._id !== id));
    } catch (error) {
      showToast(error.message || "Could not delete task", "error");
    }
  };

  const updateStatus = async (task, status) => {
    try {
      const data = await updateTask(task._id, { status });
      setTasks((current) => current.map((item) => (item._id === task._id ? data.task : item)));
      showToast("Status updated");
    } catch (error) {
      showToast(error.message || "Could not update status", "error");
    }
  };

  const uploadFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !selectedTask) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post(`/tasks/${selectedTask._id}/attachments`, formData);
      showToast("File uploaded");
      await loadTasks();
    } catch (error) {
      showToast(error.response?.data?.message || "Upload failed", "error");
    }
  };

  const exportPdf = async () => {
    setExporting(true);
    try {
      const { data } = await api.get("/tasks/export/pdf", { responseType: "blob", params: filters });
      const blob = data instanceof Blob ? data : new Blob([data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "tasks.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showToast("PDF exported");
    } catch (error) {
      showToast(error.response?.data?.message || "Could not export PDF. Make sure the backend server is running.", "error");
    } finally {
      setExporting(false);
    }
  };

  const emailSummary = async () => {
    setEmailing(true);
    try {
      await api.post("/tasks/email-summary");
      showToast("Email summary sent or logged");
    } catch (error) {
      showToast(error.response?.data?.message || "Could not send email", "error");
    } finally {
      setEmailing(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr] animate-fade-in">
      <div className="space-y-4">
        <TaskForm selectedTask={selectedTask} onSubmit={saveTask} onCancel={() => setSelectedTask(null)} saving={saving} teams={teams} />
        {selectedTask && (
          <label className="btn-secondary w-full cursor-pointer">
            <Upload className="h-4 w-4" />
            Upload attachment
            <input className="hidden" type="file" onChange={uploadFile} />
          </label>
        )}
      </div>
      <section className="space-y-4">
        <div className="glass rounded-lg p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_150px_150px_150px]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className="input pl-9" placeholder="Search tasks or subjects" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
            </label>
            <select className="input" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
              <option value="all">All statuses</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
            <select className="input" value={filters.priority} onChange={(event) => setFilters({ ...filters, priority: event.target.value })}>
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select className="input" value={filters.sortBy} onChange={(event) => setFilters({ ...filters, sortBy: event.target.value })}>
              <option value="dueDate">Sort by due date</option>
              <option value="createdAt">Sort by newest</option>
              <option value="priority">Sort by priority</option>
              <option value="title">Sort by title</option>
            </select>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => setView(view === "table" ? "kanban" : "table")} type="button">
              {view === "table" ? <SquareKanban className="h-4 w-4" /> : <Rows3 className="h-4 w-4" />}
              {view === "table" ? "Kanban" : "Table"}
            </button>
            <button className="btn-secondary" disabled={exporting} onClick={exportPdf} type="button">
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {exporting ? "Exporting..." : "Export PDF"}
            </button>
            <button className="btn-secondary" disabled={emailing} onClick={emailSummary} type="button">
              {emailing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              {emailing ? "Sending..." : "Email summary"}
            </button>
          </div>
        </div>
        {loading ? (
          <Skeleton className="h-96" />
        ) : view === "kanban" ? (
          <KanbanBoard tasks={tasks} onMove={updateStatus} />
        ) : (
          <TaskTable tasks={tasks} onEdit={setSelectedTask} onDelete={deleteTask} onStatus={updateStatus} />
        )}
      </section>
    </div>
  );
}
