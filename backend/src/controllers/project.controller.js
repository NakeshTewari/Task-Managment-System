const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// get all projects for logged in user
const getProjects = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.* FROM projects p
       INNER JOIN project_members pm ON p.id = pm.project_id
       WHERE pm.user_id = ?`,
      [req.user.id],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get single project
const getProjectById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.* FROM projects p
       INNER JOIN project_members pm ON p.id = pm.project_id
       WHERE p.id = ? AND pm.user_id = ?`,
      [req.params.id, req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create project
const createProject = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Project name is required" });
  }

  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      "INSERT INTO projects (id, name, description, owner_id) VALUES (?, ?, ?, ?)",
      [null, name, description || null, userId],
    );

    const projectId = result.insertId;

    // creator becomes admin automatically
    await pool.query(
      "INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)",
      [projectId, userId, "admin"],
    );

    const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [
      projectId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete project
const deleteProject = async (req, res) => {
  try {
    await pool.query("DELETE FROM projects WHERE id = ?", [req.params.id]);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get members
const getMembers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id as user_id, u.name, u.email, pm.role
       FROM project_members pm
       INNER JOIN users u ON pm.user_id = u.id
       WHERE pm.project_id = ?`,
      [req.params.id],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// add member by email
const addMember = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const [users] = await pool.query(
      "SELECT id, name, email FROM users WHERE email = ?",
      [email],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const newUser = users[0];

    // check already a member
    const [existing] = await pool.query(
      "SELECT * FROM project_members WHERE project_id = ? AND user_id = ?",
      [req.params.id, newUser.id],
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already a member" });
    }

    await pool.query(
      "INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)",
      [req.params.id, newUser.id, "member"],
    );

    res.status(201).json({
      user_id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: "member",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// remove member
const removeMember = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM project_members WHERE project_id = ? AND user_id = ?",
      [req.params.id, req.params.userId],
    );
    res.json({ message: "Member removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  deleteProject,
  getMembers,
  addMember,
  removeMember,
};
