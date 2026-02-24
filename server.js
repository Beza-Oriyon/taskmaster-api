import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
dotenv.config();// Load environment variables from .env file

connectDB();// Connect to the database
const app = express();

app.use(express.json());// Allows express app to accept JSON data from requests!. Without this req.body will be undefined.
app.use('/api/tasks', taskRoutes);// Tells the app to use those routes for any URL that starts with /api/tasks


app.get("/", (req, res) => {
    res.send('Welcome to the TaskMaster API')
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`); })