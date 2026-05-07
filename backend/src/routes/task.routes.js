const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
  isTaskAssignedOrAdmin,
  isProjectMemberOfTask,
  canDeleteTask, // Renamed isTaskAdmin
} = require("../middleware/task.middleware"); // Import new task-specific middlewares
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

router.get("/", auth, getTasks); // getTasks will handle project membership check internally. No specific task ID, so no isProjectMemberOfTask needed here.
router.get("/:id", auth, isProjectMemberOfTask, getTaskById); // Ensure user is member of project before getting task
router.post("/", auth, createTask);
router.put("/:id", auth, isTaskAssignedOrAdmin, updateTask); // Only assigned user or project admin can update
router.delete("/:id", auth, canDeleteTask, deleteTask); // Only assigned user or project admin can delete

module.exports = router;
