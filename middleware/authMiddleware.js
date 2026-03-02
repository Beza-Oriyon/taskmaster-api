import User from '../models/Users.js';
import jwt from 'jsonwebtoken';


// 'req' is the incoming request, 'res' is the response, 'next' tells Express to move to the next function
const protect = async (req, res, next) => {
    let token;

    // Step 1: Check if the headers contain 'authorization' AND it starts with 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Step 2: Extract the token
            // req.headers.authorization looks like this: "Bearer eyJhbGci..."
            // .split(' ') turns it into an array:["Bearer", "eyJhbGci..."]
            // [1] grabs the second item (the actual token)
            token = req.headers.authorization.split(' ')[1];

            // Step 3: Un-scramble (Verify) the token using our secret signature
            // 'decoded' will now contain the payload we saved earlier: { id: "65df1a..." }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Step 4: Find the user in the database using that ID
            // .select('-password') tells MongoDB: "Get the user, but DO NOT return the password field" (For security)
            // We attach this user to the 'req' object so the controller can use it!
            req.user = await User.findById(decoded.id).select('-password');

            // Step 5: The Bouncer says "You're good!" and passes them to the controller
            next();
        } catch (error) {
            // 401 means "Unauthorized" - Token might be expired or fake
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    // Step 6: If there was no token sent at all
    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

export { protect };