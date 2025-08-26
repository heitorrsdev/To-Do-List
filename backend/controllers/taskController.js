import Task from '../models/Task.js';
import { TASK_TITLE_MAX_LENGTH } from '../constants.js';

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, status } = req.body;
    if (!title || !status) {
      return res.status(400).json({ message: 'Título e status são obrigatórios' });
    }
    if (title.length > TASK_TITLE_MAX_LENGTH) {
      return res.status(400).json({ message: `O título deve ter menos de ${TASK_TITLE_MAX_LENGTH} caracteres` });
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
    res.status(500).json({ message: 'Erro ao criar tarefa' });
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
    res.status(500).json({ message: 'Erro ao buscar tarefas' });
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
      return res.status(404).json({ message: 'Tarefa não encontrada ou não autorizada' });
    }

    if (task.title === title && task.status === status) {
      return res.status(400).json({ message: 'Nenhuma alteração detectada' });
    }

    // Atualiza apenas os campos enviados
    if (title) task.title = title;
    if (status) task.status = status;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar tarefa' });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedTask = await Task.findOneAndDelete({ _id: id, user: userId });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou não autorizada' });
    }

    res.status(200).json({ message: 'Tarefa excluída com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao excluir tarefa' });
  }
};

// Delete all completed tasks for a user
export const deleteCompletedTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Task.deleteMany({ status: 'completed', user: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Nenhuma tarefa concluída encontrada' });
    }

    res.status(200).json({ message: `${result.deletedCount} tarefas concluídas excluídas com sucesso` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao excluir tarefas concluídas' });
  }
};

// Delete all tasks for a user
export const deleteAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Task.deleteMany({ user: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Nenhuma tarefa encontrada' });
    }

    res.status(200).json({ message: `${result.deletedCount} tarefas excluídas com sucesso` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao excluir todas as tarefas' });
  }
};
