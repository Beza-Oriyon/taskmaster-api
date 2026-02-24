import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();// Load environment variables from .env file

connectDB();// Connect to the database
const app = express();

app.get("/", (req, res) => {
    res.send('Welcome to the TaskMaster API')
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`); })