const pool = require('../config/db');

// checks if user is admin of the project
const isProjectAdmin = async (req, res, next) => {
  const projectId = req.params.id || req.body.project_id;
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?',
      [projectId, userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: 'Not a member of this project' });
    }

    if (rows[0].role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { isProjectAdmin };