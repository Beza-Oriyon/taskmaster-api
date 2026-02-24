import express from 'express';
import { createTask, getTasks} from '../controllers/taskController.js';

const router =  express.Router();

router.route('/').get(getTasks).post(createTask);

export default router;