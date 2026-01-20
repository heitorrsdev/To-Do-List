import Task from '../models/Task.js';
import { TASK_TITLE_MAX_LENGTH, TASK_STATUS } from '../constants.js';

const validateTaskPayload = ({ title, status } = {}, requiredFields = true) => {
  if (requiredFields) {
    if (!title?.trim()) return 'O título é obrigatório';
    if (!status?.trim()) return 'O status é obrigatório';
  }

  if (title?.length > TASK_TITLE_MAX_LENGTH) {
    return `O título deve ter no máximo ${TASK_TITLE_MAX_LENGTH} caracteres`;
  }

  if (status && !TASK_STATUS.includes(status)) {
    return 'Status inválido';
  }

  return null;
};

// CREATE
export const createTask = async (req, res) => {
  try {
    const error = validateTaskPayload(req.body);
    if (error) return res.status(400).json({ message: error });

    const task = await Task.create({
      title: req.body.title,
      status: req.body.status,
      user: req.user.id
    });

    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao criar tarefa' });
  }
};

// READ
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    return res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao buscar tarefas' });
  }
};

// UPDATE
export const updateTask = async (req, res) => {
  try {
    const error = validateTaskPayload(req.body, false);
    if (error) return res.status(400).json({ message: error });

    const updates = {};

    if (req.body.title !== undefined) {
      updates.title = req.body.title;
    }

    if (req.body.status !== undefined) {
      updates.status = req.body.status;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'Nenhum campo válido para atualização' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou não autorizada' });
    }

    return res.status(200).json(task);
  } catch (err) {
    console.error(err);

    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Dados inválidos' });
    }

    return res.status(500).json({ message: 'Erro ao atualizar tarefa' });
  }
};


// DELETE ONE
export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou não autorizada' });
    }

    return res.status(200).json({ message: 'Tarefa excluída com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao excluir tarefa' });
  }
};

// DELETE COMPLETED
export const deleteCompletedTasks = async (req, res) => {
  try {
    const { deletedCount } = await Task.deleteMany({
      user: req.user.id,
      status: 'completed'
    });

    if (!deletedCount) {
      return res.status(404).json({ message: 'Nenhuma tarefa concluída encontrada' });
    }

    return res
      .status(200)
      .json({ message: `${deletedCount} tarefas concluídas excluídas` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao excluir tarefas concluídas' });
  }
};

// DELETE ALL
export const deleteAllTasks = async (req, res) => {
  try {
    const { deletedCount } = await Task.deleteMany({ user: req.user.id });

    if (!deletedCount) {
      return res.status(404).json({ message: 'Nenhuma tarefa encontrada' });
    }

    return res
      .status(200)
      .json({ message: `${deletedCount} tarefas excluídas` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao excluir todas as tarefas' });
  }
};
