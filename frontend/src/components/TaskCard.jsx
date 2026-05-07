const PRIORITY_BORDER = {
  high:   "border-l-red-500",
  medium: "border-l-yellow-400",
  low:    "border-l-green-500",
};

const PRIORITY_BADGE = {
  high:   "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low:    "bg-green-100 text-green-700",
};

const STATUS_BADGE = {
  todo:        "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  done:        "bg-emerald-100 text-emerald-700",
};

const STATUS_LABEL = {
  todo:        "To Do",
  in_progress: "In Progress",
  done:        "Done",
};

const isOverdue = (due_date, status) => {
  if (!due_date || status === "done") return false;
  return new Date(due_date) < new Date();
};

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
  });
};

export default function TaskCard({ task }) {
  const overdue = isOverdue(task.due_date, task.status);

  return (
    <div
      className={`
        bg-white rounded-xl border border-gray-200 border-l-4
        ${PRIORITY_BORDER[task.priority] || "border-l-gray-300"}
        shadow-sm hover:shadow-md hover:-translate-y-0.5
        transition-all duration-200 cursor-pointer p-4 space-y-3
      `}
    >
      {/* Title*/}
      <h4 className="text-sm font-semibold text-gray-900 leading-snug">
        {task.title || "Untitled Task"}
      </h4>

      {/* Status + Priority badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_BADGE[task.status] || "bg-gray-100 text-gray-600"}`}>
          {STATUS_LABEL[task.status] || task.status}
        </span>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${PRIORITY_BADGE[task.priority] || "bg-gray-100 text-gray-600"}`}>
          {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)} priority
        </span>
      </div>

      {/* Footer — assignee + due date */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">

        {/* Assignee */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
            {task.assigned_name
              ? task.assigned_name.charAt(0).toUpperCase()
              : "?"}
          </div>
          <span className="text-xs text-gray-500">
            {task.assigned_name || "Unassigned"}
          </span>
        </div>

        {/* Due date */}
        {task.due_date && (
          <span className={`text-xs font-medium ${overdue ? "text-red-500" : "text-gray-400"}`}>
            {overdue ? "⚠ " : "📅 "}
            {formatDate(task.due_date)}
          </span>
        )}

      </div>
    </div>
  );
}