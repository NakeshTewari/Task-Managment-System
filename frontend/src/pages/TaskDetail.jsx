import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const PRIORITY_BADGE = {
  low:    "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high:   "bg-red-100 text-red-700",
};

const STATUS_BADGE = {
  todo:        "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  done:        "bg-emerald-100 text-emerald-700",
};

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchTask(); }, [id]);

  const fetchTask = async () => {
    try {
      const res = await API.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      setError("Failed to load task.");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await API.put(`/tasks/${id}`, task);
      setSuccess("Task updated successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = async () => {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;
    try {
      await API.delete(`/tasks/${id}`);
      navigate("/projects");
    } catch (err) {
      setError("Failed to delete task.");
    }
  };

  // Loading 
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading task...</p>
      </div>
    </div>
  );

  // Not found 
  if (!task) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl font-semibold text-gray-700">Task not found</p>
        <Link to="/projects" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
          ← Back to Projects
        </Link>
      </div>
    </div>
  );

  // Main
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back link  */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          ← Back to Projects
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
                Task
              </p>
              <h1 className="text-2xl font-bold text-gray-900 leading-snug">
                {task.title}
              </h1>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 shrink-0 mt-1">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_BADGE[task.status]}`}>
                {task.status === "in_progress" ? "In Progress" : task.status === "done" ? "Done" : "To Do"}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${PRIORITY_BADGE[task.priority]}`}>
                {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
              </span>
            </div>
          </div>

          {/* Form body */}
          <div className="px-8 py-6 space-y-5">

            {/* Success / Error */}
            {success && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg">
                <span>✓</span> {success}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                <span>✕</span> {error}
              </div>
            )}
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                placeholder="Task title"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={task.description || ""}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
                placeholder="Add a description..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition resize-none"
              />
            </div>

            {/* Status + Priority row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={task.status}
                  onChange={(e) => setTask({ ...task, status: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={task.priority}
                  onChange={(e) => setTask({ ...task, priority: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Due date  */}
            {task.due_date && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>📅</span>
                <span>
                  Due:{" "}
                  <span className="font-medium text-gray-700">
                    {new Date(task.due_date).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </span>
                </span>
              </div>
            )}

            {/* Assigned to  */}
            {task.assigned_name && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>👤</span>
                <span>
                  Assigned to:{" "}
                  <span className="font-medium text-gray-700">{task.assigned_name}</span>
                </span>
              </div>
            )}

          </div>

          {/* Footer buttons */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              onClick={deleteTask}
              className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition"
            >
              Delete Task
            </button>

            <div className="flex gap-3">
              <Link
                to="/projects"
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </Link>
              <button
                onClick={updateTask}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}