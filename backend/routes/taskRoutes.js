import authMiddleware from '../middlewares/authMiddleaWare.js';
import express from 'express';
import {
  createTask,
  deleteCompletedTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/tasks', createTask);
router.get('/tasks', getTasks);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.delete('/tasks/completed', deleteCompletedTask);

export default router;
