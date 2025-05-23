import Task from '../models/Task.js';

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const userId = req.user.id; // definido no middleware de autenticação

        const newTask = new Task({
            title,
            description,
            status,
            user: userId
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
};

// Get all tasks for a user
export const getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await Task.find({ user: userId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};

// Update a task
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;
        const userId = req.user.id;

        // Busca a tarefa e verifica se pertence ao usuário
        const task = await Task.findOne({ _id: id, user: userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        // Atualiza apenas os campos enviados
        if (title) task.title = title;
        if (description) task.description = description;
        if (status) task.status = status;

        await task.save();
        res.status(200).json(task);
    } catch (error) {
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
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
};
