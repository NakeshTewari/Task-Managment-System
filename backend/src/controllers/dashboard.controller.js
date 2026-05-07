const pool = require("../config/db");

const getDashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get all stats in a single, more efficient query
    const [stats] = await pool.query(
      `SELECT
        COUNT(*) AS totalTasks,
        SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS completedTasks,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS inProgressTasks,
        SUM(CASE WHEN due_date < CURDATE() AND status != 'done' THEN 1 ELSE 0 END) AS overdueTasks
       FROM tasks
       WHERE project_id IN (SELECT project_id FROM project_members WHERE user_id = ?)`,
      [userId],
    );

    // recent 5 tasks
    const [recentTasks] = await pool.query(
      `SELECT t.id, t.title, t.status, t.priority, t.due_date, p.name as project_name
       FROM tasks t
       INNER JOIN projects p ON t.project_id = p.id
       WHERE t.assigned_to = ?
       ORDER BY t.created_at DESC
       LIMIT 5`,
      [userId],
    );

    res.json({
      totalTasks: stats[0].totalTasks || 0,
      completedTasks: stats[0].completedTasks || 0,
      inProgressTasks: stats[0].inProgressTasks || 0,
      overdueTasks: stats[0].overdueTasks || 0,
      recentTasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboard };
