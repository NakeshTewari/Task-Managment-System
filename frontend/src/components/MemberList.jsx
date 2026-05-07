import { useEffect, useState } from "react";
import API from "../api/axios";
import useAuth from "../hooks/useAuth";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
];

const avatarColor = (name) =>
  AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

export default function MemberList({
  projectId,
  initialMembers,
  onMembersUpdate,
}) {
  const { user } = useAuth();

  const [members, setMembers] = useState(initialMembers || []);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = members.find((m) => m.user_id === user?.id)?.role === "admin";

  useEffect(() => {
    setMembers(initialMembers || []);
  }, [initialMembers]);

  const updateMembers = (updated) => {
    setMembers(updated);
    onMembersUpdate?.(updated);
  };

  const addMember = async () => {
    if (!email.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await API.post(`/projects/${projectId}/members`, { email });
      updateMembers([...members, res.data]);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member.");
    } finally {
      setAdding(false);
    }
  };

  const removeMember = async (userId) => {
    try {
      await API.delete(`/projects/${projectId}/members/${userId}`);
      updateMembers(members.filter((m) => m.user_id !== userId));
    } catch {
      setError("Failed to remove member.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Member (admin only)*/}
      {isAdmin && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              placeholder="User email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMember()}
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            <button
              onClick={addMember}
              disabled={adding || !email.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {adding ? "..." : "Add"}
            </button>
          </div>

          {/* Inline error */}
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>
      )}

      {/* Members list */}
      {members.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          No members yet.
        </p>
      ) : (
        <div className="space-y-1">
          {members.map((member) => (
            <div
              key={member.user_id}
              className="flex items-center justify-between px-2 py-2 rounded-xl hover:bg-gray-50 transition group"
            >
              {/* Avatar + name + role */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full ${avatarColor(member.name)} text-white flex items-center justify-center text-sm font-bold shrink-0`}
                >
                  {member.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {member.name}
                    {member.user_id === user?.id && (
                      <span className="ml-1.5 text-xs text-gray-400 font-normal">
                        (you)
                      </span>
                    )}
                  </p>
                  <p
                    className={`text-xs capitalize font-medium ${member.role === "admin" ? "text-blue-500" : "text-gray-400"}`}
                  >
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Remove button — admin only, not self */}
              {isAdmin && member.user_id !== user?.id && (
                <button
                  onClick={() => removeMember(member.user_id)}
                  className="text-xs text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
