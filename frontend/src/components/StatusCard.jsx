const CONFIG = {
  "Total Tasks": {  bar: "bg-blue-500",    text: "text-blue-600"   },
  "Completed":   {  bar: "bg-emerald-500", text: "text-emerald-600" },
  "In Progress": {  bar: "bg-yellow-500",  text: "text-yellow-600" },
  "Overdue":     {  bar: "bg-red-500",     text: "text-red-600"    },
};

export default function StatusCard({ title, value }) {
  const cfg = CONFIG[title] || { icon: "📌", bar: "bg-gray-400", text: "text-gray-700" };

  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden">

      {/* Top color bar */}
      <div className={`absolute top-0 left-0 w-full h-1 ${cfg.bar}`} />

      <div className="p-5 pt-6 flex items-center gap-4">
        
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`text-3xl font-bold ${cfg.text}`}>{value ?? 0}</p>
        </div>
      </div>

    </div>
  );
}