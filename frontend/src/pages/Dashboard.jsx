import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const STATUS_BADGE = {
  todo: "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-emerald-100 text-emerald-700",
};

const STATUS_LABEL = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

const PRIORITY_DOT = {
  low: "bg-green-400",
  medium: "bg-yellow-400",
  high: "bg-red-400",
};

const STAT_CARDS = (stats) => [
  {
    title: "Total Tasks",
    value: stats.totalTasks,
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    title: "Completed",
    value: stats.completedTasks,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    title: "In Progress",
    value: stats.inProgressTasks,
    bg: "bg-yellow-50",
    text: "text-yellow-600",
  },
  {
    title: "Overdue",
    value: stats.overdueTasks,
    bg: "bg-red-50",
    text: "text-red-600",
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    inProgressTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard");
        setStats({
          totalTasks: res.data.totalTasks || 0,
          completedTasks: res.data.completedTasks || 0,
          overdueTasks: res.data.overdueTasks || 0,
          inProgressTasks: res.data.inProgressTasks || 0,
        });
        setRecentTasks(res.data.recentTasks || []);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Loading
  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );

  //  Error
  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3"></p>
          <p className="text-gray-700 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );

  // Error
  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3"></p>
          <p className="text-gray-700 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header  */}
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">
            Overview
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Here's what's happening with your tasks today.
          </p>
        </div>
        {/* Stat Cards  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {STAT_CARDS(stats).map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4"
            >
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className={`text-3xl font-bold ${card.text}`}>
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Recent Tasks
            </h2>
            <Link
              to="/projects"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
            >
              View all projects →
            </Link>
          </div>

          {/* Empty state */}
          {recentTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-600 font-medium">No tasks yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Go to a project and create your first task.
              </p>
              <Link
                to="/projects"
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
              >
                Go to Projects
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  {/* Left — title + project */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Priority dot */}
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[task.priority] || "bg-gray-300"}`}
                    />

                    <div className="min-w-0">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition truncate block"
                      >
                        {task.title}
                      </Link>
                      {task.project_name && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {task.project_name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right — due date + status badge */}
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {task.due_date && (
                      <span className="text-xs text-gray-400 hidden sm:block">
                        {new Date(task.due_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_BADGE[task.status] || "bg-gray-100 text-gray-500"}`}
                    >
                      {STATUS_LABEL[task.status] || task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
