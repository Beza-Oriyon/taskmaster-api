import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
dotenv.config();// Load environment variables from .env file

connectDB();// Connect to the database
const app = express();

app.use(express.json());// Allows express app to accept JSON data from requests!. Without this req.body will be undefined.

// --- 2. EQUIP THE SECURITY MIDDLEWARE ---

// Helmet adds extra security headers to our responses to hide server info from hackers
app.use(helmet());

// CORS allows frontend applications (like React/Vue) to communicate with our API
app.use(cors());

// MongoSanitize scrubs incoming data to prevent NoSQL Injection attacks
app.use((req, res, next) => {
    Object.defineProperty(req, 'query', {
        value: { ...req.query },
        writable: true,
        configurable: true,
        enumerable: true,
    });
    next();
});
app.use(mongoSanitize());

// Rate Limiting: Prevent spam/brute force attacks
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 100 requests per 10 minutes
    message: { success: false, message: 'Too many requests, please try again later.' }
});
// Apply the rate limiter to all routes
app.use(limiter);


app.use('/api/tasks', taskRoutes);// Tells the app to use those routes for any URL that starts with /api/tasks
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
    res.send('Welcome to the TaskMaster API')
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`); })