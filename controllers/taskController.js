import Task from '../models/Task.js';

// @desc   Get all tasks
// @route  GET /api/tasks
// @desc    Get ALL tasks (with filtering, sorting, and pagination)
// @route   GET /api/tasks
const getTasks = async (req, res) => {
    try {
        // STEP 1: FILTERING
        // We make a copy of the query parameters from the URL (e.g., ?status=Done)
        // We immediately inject the logged-in user's ID so they can NEVER see someone else's tasks!
        let queryObj = { ...req.query, user: req.user.id };

        // Some words are reserved for sorting/pagination, not for filtering data.
        // We must delete them from our filter object before we ask the database.
        const excludedFields = ['sort', 'page', 'limit'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Start building the MongoDB search query (Notice there is no 'await' yet!)
        // We are just setting up the rules.
        let query = Task.find(queryObj);

        // STEP 2: SORTING
        if (req.query.sort) {
            // If the URL has ?sort=priority
            // Mongoose uses spaces for multiple sorts, so if they pass ?sort=priority,status
            // we change the comma to a space: "priority status"
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            // Default sort: '-createdAt' means newest tasks show up first (Descending order)
            query = query.sort('-createdAt');
        }

        // STEP 3: PAGINATION
        // Base 10 parsing. If no page is provided, default to page 1.
        const page = parseInt(req.query.page, 10) || 1; 
        // Default to showing 10 tasks per page.
        const limit = parseInt(req.query.limit, 10) || 10; 
        // Math to figure out how many tasks to skip. 
        // Example: Page 3, Limit 10 -> (3 - 1) * 10 = Skip the first 20 tasks!
        const skip = (page - 1) * limit;

        // Apply pagination rules to our query
        query = query.skip(skip).limit(limit);

        // STEP 4: EXECUTE THE QUERY
        // Now that we have added all our rules (filters, sorts, limits), we finally run it!
        const tasks = await query;

        // Bonus: Send back the total pages data so the frontend can build "Next Page" buttons
        const totalTasks = await Task.countDocuments(queryObj);
        const totalPages = Math.ceil(totalTasks / limit);

        res.status(200).json({ 
            success: true, 
            count: tasks.length, 
            pagination: { page, limit, totalPages, totalTasks },
            data: tasks 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc  Create a new task
// @route POST /api/tasks

const createTask = async (req, res) => {
    try {
        // req.body contains the data the user sent us (title, description)
        req.body.user = req.user.id; // Set the user field to the logged-in user's ID
        
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
         // SECURITY CHECK: Make sure the logged-in user owns this task
        // task.user is a MongoDB ObjectId, so we MUST convert it to a string to compare it!
        if (task.user.toString() !== req.user.id) {
            // 403 means "Forbidden" (You are logged in, but not allowed here)
            return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
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
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // SECURITY CHECK: Make sure the logged-in user owns this task
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // SECURITY CHECK: Make sure the logged-in user owns this task
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
export {getTasks, createTask, getTask, updateTask, deleteTask};