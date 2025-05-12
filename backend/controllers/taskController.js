import Task from "../models/Task";

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const userId = req.user.id; // Assuming you have user ID from authentication middleware

        const newTask = new Task({
            title,
            description,
            status,
            user: userId
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error });
    }
};

// Get all tasks for a user
export const getTasks = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have user ID from authentication middleware
        const tasks = await Task.find({ user: userId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
    }
};

// Update a task
export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, status } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { title, description, status },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({message: "Task not found"});
        }

        res.status(200).json({message: "Task deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Error deleting task", error});
    }
};
