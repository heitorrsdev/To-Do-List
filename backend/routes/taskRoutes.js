import authMiddleware from '../middlewares/authMiddleaWare.js';
import express from 'express';
import {
  createTask,
  deleteAllTasks,
  deleteCompletedTasks,
  deleteTask,
  getTasks,
  updateTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/tasks', createTask);
router.get('/tasks', getTasks);
router.delete('/tasks/completed', deleteCompletedTasks);
router.delete('/tasks/all', deleteAllTasks);
// Rotas com parâmetro dinâmicos devem ser definidas após as rotas estáticas
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;
