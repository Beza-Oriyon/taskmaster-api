import Task from '../models/Task.js';

// @desc   Get all tasks
// @route  GET /api/tasks
const getTasks = async (req, res) => {
    try{
        const tasks = await Task.find();
        res.status(200).json({success: true, count :tasks.length, data: tasks});
    }
    catch (error){
        res.status(500).json({success: false, error: 'Server Error'});
    }
};

// @desc  Create a new task
// @route POST /api/tasks

const createTask = async (req, res) => {
    try {
        // req.body contains the data the user sent us (title, description)
        const task = await Task.create(req.body); // Tells MongoDB to save it
        
        // 201 means "Created successfully"
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        // If they forget a required field like 'title', MongoDB throws an error
        res.status(400).json({ success: false, message: error.message });
    }
};
 
export {getTasks, createTask};