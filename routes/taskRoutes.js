import express from 'express';
import { createTask, getTasks, getTask, updateTask, deleteTask} from '../controllers/taskController.js';

const router =  express.Router();

router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

export default router;