import Task from '../models/Task.js';
import { TASK_TITLE_MAX_LENGTH } from '../constants.js';

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, status } = req.body;
    if (!title || !status) {
      return res.status(400).json({ message: 'Title and status are required' });
    }
    if (title.length > TASK_TITLE_MAX_LENGTH) {
      return res.status(400).json({ message: `Title must be less than ${TASK_TITLE_MAX_LENGTH} characters` });
    }

    const userId = req.user.id; // definido no middleware de autenticação

    const newTask = new Task({
      title,
      status,
      user: userId
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating task' });
  }
};

// Get all tasks for a user
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ user: userId });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;
    const userId = req.user.id;

    // Busca a tarefa e verifica se pertence ao usuário
    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    if (task.title === title || task.status === status) {
      return res.status(400).json({ message: 'No changes detected' });
    }

    // Atualiza apenas os campos enviados
    if (title) task.title = title;
    if (status) task.status = status;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating task' });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedTask = await Task.findOneAndDelete({ _id: id, user: userId });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting task' });
  }
};

// Delete all completed tasks for a user
export const deleteCompletedTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Task.deleteMany({ status: 'completed', user: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No completed tasks found' });
    }

    res.status(200).json({ message: `${result.deletedCount} completed tasks deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting completed tasks' });
  }
};

// Delete all tasks for a user
export const deleteAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Task.deleteMany({ user: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }

    res.status(200).json({ message: `${result.deletedCount} tasks deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting all tasks' });
  }
};
