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

// @desc    Get a single task
// @route   GET /api/tasks/:id
const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id); // Search DB by the ID in the URL

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error or Invalid ID format' });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
    try {
        // Find by ID and update it with the new data in req.body
        // { new: true } tells Mongoose to return the updated version, not the old one
        // { runValidators: true } forces it to check our blueprint rules again!
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
export {getTasks, createTask, getTask, updateTask, deleteTask};