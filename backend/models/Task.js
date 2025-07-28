import mongoose from 'mongoose';
import { TASK_TITLE_MAX_LENGTH } from '../constants.js';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: TASK_TITLE_MAX_LENGTH
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
