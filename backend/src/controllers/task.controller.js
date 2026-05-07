const pool = require("../config/db");

// Helper function to format date from ISO string to YYYY-MM-DD
const formatDateForDB = (dateString) => {
  if (!dateString) return null;
  // Handle ISO 8601 format (2026-05-22T00:00:00.000Z) and regular date format
  if (typeof dateString === "string") {
    return dateString.split("T")[0]; // Extract only the date part
  }
  return dateString;
};

// get tasks by project
const getTasks = async (req, res) => {
  const { project_id } = req.query;

  if (!project_id) {
    return res.status(400).json({ message: "project_id is required" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT t.*, u.name as assigned_name
       FROM tasks t 
       INNER JOIN project_members pm ON t.project_id = pm.project_id
       LEFT JOIN users u ON t.assigned_to = u.id 
       WHERE t.project_id = ? AND pm.user_id = ?
       ORDER BY t.created_at DESC`,
      [project_id, req.user.id],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get single task
const getTaskById = async (req, res) => {
  // req.projectId is set by isProjectMemberOfTask middleware
  const projectId = req.projectId;
  try {
    const [rows] = await pool.query(
      `SELECT t.*, u.name as assigned_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.id = ? AND t.project_id = ?`,
      [req.params.id, projectId],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create task
const createTask = async (req, res) => {
  const {
    title,
    description,
    project_id,
    assigned_to,
    priority,
    due_date,
    status,
  } = req.body;

  if (!title || !project_id) {
    return res
      .status(400)
      .json({ message: "Title and project_id are required" });
  }

  try {
    // Format due_date to YYYY-MM-DD
    const formattedDueDate = formatDateForDB(due_date);

    const [result] = await pool.query(
      `INSERT INTO tasks 
       (id, title, description, project_id, created_by, assigned_to, priority, due_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        null,
        title,
        description || null,
        project_id,
        req.user.id,
        assigned_to || null,
        priority || "medium",
        formattedDueDate,
        status || "todo",
      ],
    );

    const taskId = result.insertId;

    const [rows] = await pool.query(
      `SELECT t.*, u.name as assigned_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.id = ?`,
      [taskId],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update task
const updateTask = async (req, res) => {
  const { title, description, status, priority, due_date, assigned_to } =
    req.body;

  try {
    // Format due_date to YYYY-MM-DD
    const formattedDueDate = formatDateForDB(due_date);

    await pool.query(
      `UPDATE tasks SET
       title = COALESCE(?, title),
       description = COALESCE(?, description),
       status = COALESCE(?, status),
       priority = COALESCE(?, priority),
       due_date = COALESCE(?, due_date),
       assigned_to = COALESCE(?, assigned_to)
       WHERE id = ?`,
      [
        title,
        description,
        status,
        priority,
        formattedDueDate,
        assigned_to,
        req.params.id,
      ],
    );

    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [
      req.params.id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete task
const deleteTask = async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
