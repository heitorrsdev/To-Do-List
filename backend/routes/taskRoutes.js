import express from "express";
import {
  createTask,
  getTasksByUser,
  updateTask,
  deleteTask
} from "../controllers/taskController.js";

const router = express.Router();

// Adicionar o middleware de autenticação

router.post("/tasks", createTask);
router.get("/tasks", getTasksByUser);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;
