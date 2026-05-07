import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import KanbanBoard from "../components/KanbanBoard";
import useAuth from "../hooks/useAuth";
import MemberList from "../components/MemberList";

const PRIORITY_BADGE = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

export default function ProjectDetail() {
  const { user } = useAuth();
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  // new task form
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
  });

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [tasksRes, membersRes] = await Promise.all([
        API.get(`/tasks?project_id=${id}`),
        API.get(`/projects/${id}/members`),
      ]);
      setTasks(tasksRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      setError("Failed to load project data.");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const prev = [...tasks];
    setTasks((t) =>
      t.map((x) =>
        x.id.toString() === taskId ? { ...x, status: newStatus } : x,
      ),
    );
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
    } catch {
      setTasks(prev);
      setError("Failed to update task status.");
    }
  };

  const createTask = async () => {
    if (!form.title.trim()) return;
    try {
      const res = await API.post("/tasks", {
        title: form.title,
        description: form.description || null,
        project_id: id,
        status: "todo",
        priority: form.priority,
        due_date: form.due_date || null,
      });
      setTasks((prev) => [...prev, res.data]);
      setForm({ title: "", description: "", priority: "medium", due_date: "" });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task.");
    }
  };

  const saveTask = async () => {
    setSaving(true);
    try {
      await API.put(`/tasks/${selectedTask.id}`, selectedTask);
      const assignee = members.find(
        (m) => m.user_id === selectedTask.assigned_to,
      );
      setTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id
            ? { ...selectedTask, assigned_name: assignee?.name }
            : t,
        ),
      );
      setSelectedTask(null);
    } catch (err) {
      setError("Failed to save task.");
    } finally {
      setSaving(false);
    }
  };

  const handleTaskClick = (task) => {
    const currentUserIsAdmin = members.some(
      (member) => member.user_id === user?.id && member.role === "admin",
    );

    if (task.assigned_to === user?.id || currentUserIsAdmin) {
      setSelectedTask(task);
    } else {
      setError(
        "You can only edit/delete tasks assigned to you or if you are a project admin.",
      );
    }
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading board...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/*  Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/projects"
              className="text-sm text-gray-400 hover:text-gray-700 transition"
            >
              ← Projects
            </Link>
            <span className="text-gray-300">/</span>
            <h1 className="text-xl font-bold text-gray-900">Project Board</h1>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Add Task
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
            <span className="font-bold">!</span> {error}
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Kanban — 3 cols */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <KanbanBoard
              tasks={tasks}
              onDragEnd={updateTaskStatus}
              onTaskClick={handleTaskClick}
            />
          </div>

          {/* Members sidebar */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-widest mb-4">
              Members
            </h3>
            <MemberList
              projectId={id}
              initialMembers={members}
              onMembersUpdate={setMembers}
            />
          </div>
        </div>
      </div>

      {/*  CREATE TASK MODAL*/}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">New Task</h2>
            <p className="text-sm text-gray-500 mb-5">
              Add a task to this project board.
            </p>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  autoFocus
                  placeholder="What needs to be done?"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && createTask()}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>
                  Description{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="Add details..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className={inputCls + " resize-none"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                    className={inputCls}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Due Date</label>
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(e) =>
                      setForm({ ...form, due_date: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  setForm({
                    title: "",
                    description: "",
                    priority: "medium",
                    due_date: "",
                  });
                }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={createTask}
                disabled={!form.title.trim()}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TASK MODAL*/}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            {/* Modal header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Task</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${PRIORITY_BADGE[selectedTask.priority]}`}
                  >
                    {selectedTask.priority}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className={labelCls}>Title</label>
                <input
                  value={selectedTask.title}
                  onChange={(e) =>
                    setSelectedTask({ ...selectedTask, title: e.target.value })
                  }
                  className={inputCls}
                />
              </div>

              {/* Description */}
              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  value={selectedTask.description || ""}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      description: e.target.value,
                    })
                  }
                  placeholder="Add a description..."
                  rows={3}
                  className={inputCls + " resize-none"}
                />
              </div>

              {/* Status + Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Status</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        status: e.target.value,
                      })
                    }
                    className={inputCls}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Priority</label>
                  <select
                    value={selectedTask.priority}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        priority: e.target.value,
                      })
                    }
                    className={inputCls}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Due Date + Assignee */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Due Date</label>
                  <input
                    type="date"
                    value={
                      selectedTask.due_date
                        ? new Date(selectedTask.due_date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        due_date: e.target.value || null,
                      })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Assignee</label>
                  <select
                    value={selectedTask.assigned_to || ""}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        assigned_to: e.target.value || null,
                      })
                    }
                    className={inputCls}
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.user_id} value={m.user_id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedTask(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveTask}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
