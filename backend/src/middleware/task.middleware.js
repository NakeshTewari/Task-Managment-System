const pool = require("../config/db");

// Middleware to check if user is a member of the project a task belongs to
const isProjectMemberOfTask = async (req, res, next) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  try {
    const [taskRows] = await pool.query(
      `SELECT project_id FROM tasks WHERE id = ?`,
      [taskId],
    );

    if (taskRows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const projectId = taskRows[0].project_id;

    const [memberRows] = await pool.query(
      `SELECT 1 FROM project_members WHERE project_id = ? AND user_id = ?`,
      [projectId, userId],
    );

    if (memberRows.length === 0) {
      return res.status(403).json({
        message:
          "Forbidden: You are not a member of the project this task belongs to.",
      });
    }

    // Attach projectId to request for further use if needed
    req.projectId = projectId;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Middleware to check if the user is assigned to the task OR is an admin of the task's project
const isTaskAssignedOrAdmin = async (req, res, next) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  try {
    // Get task details and its project_id
    const [taskRows] = await pool.query(
      `SELECT project_id, assigned_to FROM tasks WHERE id = ?`,
      [taskId],
    );

    if (taskRows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = taskRows[0];
    const projectId = task.project_id;

    // Check if the user is assigned to the task
    if (task.assigned_to === userId) {
      return next();
    }

    // Check if the user is an admin of the project
    const [memberRows] = await pool.query(
      `SELECT role FROM project_members WHERE project_id = ? AND user_id = ?`,
      [projectId, userId],
    );

    if (memberRows.length > 0 && memberRows[0].role === "admin") {
      return next();
    }

    return res.status(403).json({
      message: "Forbidden: You are not authorized to modify this task.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Middleware to check if the user is an admin of the project the task belongs to
const canDeleteTask = async (req, res, next) => {
  // Renamed from isTaskAdmin
  const taskId = req.params.id;
  const userId = req.user.id;

  try {
    const [taskRows] = await pool.query(
      `SELECT project_id FROM tasks WHERE id = ?`,
      [taskId],
    );

    if (taskRows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const projectId = taskRows[0].project_id;

    // Allow if user is the assigned user
    if (taskRows[0].assigned_to === userId) {
      return next();
    }

    // Allow if user is an admin of the project
    const [memberRows] = await pool.query(
      `SELECT role FROM project_members WHERE project_id = ? AND user_id = ?`,
      [projectId, userId],
    );

    if (memberRows.length > 0 && memberRows[0].role === "admin") {
      return next();
    }

    return res
      .status(403)
      .json({
        message: "Forbidden: You are not authorized to delete this task.",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  isTaskAssignedOrAdmin,
  isProjectMemberOfTask,
  canDeleteTask,
}; // Export renamed middleware
