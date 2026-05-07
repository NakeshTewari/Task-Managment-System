const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { isProjectAdmin } = require("../middleware/role.middleware");
const {
  getProjects,
  createProject,
  getProjectById,
  deleteProject,
  addMember,
  removeMember,
  getMembers,
} = require("../controllers/project.controller");

router.get("/", auth, getProjects);
router.post("/", auth, createProject);
router.get("/:id", auth, getProjectById);
router.delete("/:id", auth, isProjectAdmin, deleteProject);

// members
router.get("/:id/members", auth, getMembers);
router.post("/:id/members", auth, isProjectAdmin, addMember);
router.delete("/:id/members/:userId", auth, isProjectAdmin, removeMember);

module.exports = router;
