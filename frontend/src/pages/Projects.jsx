import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!name.trim()) return;
    try {
      setCreating(true);
      setError("");
      const res = await API.post("/projects", { name, description });
      setProjects((prev) => [...prev, res.data]);
      setName("");
      setDescription("");
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project.");
    } finally {
      setCreating(false);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setName("");
    setDescription("");
    setError("");
  };

  
  const avatarColor = (name) => {
    const colors = [
      "bg-blue-500", "bg-violet-500", "bg-emerald-500",
      "bg-orange-500", "bg-pink-500", "bg-cyan-500",
    ];
    return colors[name?.charCodeAt(0) % colors.length] || "bg-blue-500";
  };

  // Loading 
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading projects...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Page Header  */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-500 mt-1">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm"
          >
            <span className="text-lg leading-none">+</span>
            New Project
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            <span>✕</span> {error}
          </div>
        )}

        {/* Create Project Modal  */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">

              <h2 className="text-xl font-bold text-gray-900 mb-1">New Project</h2>
              <p className="text-sm text-gray-500 mb-5">
                Give your project a name and optional description.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    autoFocus
                    placeholder="e.g. Marketing Website"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createProject()}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    placeholder="What is this project about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={cancelForm}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={createProject}
                  disabled={creating || !name.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-3xl">
              📋
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No projects yet</h3>
            <p className="text-sm text-gray-500 mb-6">
              Create your first project to start managing tasks.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
            >
              + New Project
            </button>
          </div>
        )}

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all duration-200"
            >
              {/* Project avatar */}
              <div className={`w-10 h-10 rounded-xl ${avatarColor(project.name)} flex items-center justify-center text-white font-bold text-lg mb-4`}>
                {project.name?.charAt(0).toUpperCase()}
              </div>

              <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {project.name}
              </h3>

              {project.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="flex items-center gap-1 mt-4 text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                <span>Open project</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}