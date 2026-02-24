import User from '../models/Users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//@desc  Register a new user
//@route  POST /api/auth/register

const register = async (req, res) =>
{
    try{
        const{name,email, password}= req.body;

        //1.Check if user already exists

        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(400).json({ success: false, message: 'User already exists'});s
        }

        //2.hash the password(scramble it)

        const salt = await bcrypt.genSalt(10);// Generates random characters
        const hashedPassword = await bcrypt.hash(password, salt)//Mixes password and salt

        //3. Create the user in the database with the hashed password
       const user = await User.create({
        name,email, password: hashedPassword
       }); 
       //4. Create the VIP wristband (JWT token)

       const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, {expiresIn:'30d'});

       res.status(201).json({ success : true, token });
    }
    catch (error){
        res.status(500).json({ success : false, message : error.message});
    }
};

//@desc  Login  a user
//@route  POST /api/auth/login

const login = async (req, res) =>
{
    try{
        const {email, password} = req.body;

        //1. Find the user by email
        const user = await User.findOne( {email});
        if(!user){
            return res.status(401).json({ success: false, message: ' Invalid credentials'});
        }

        //2. Check is passwords match (bcrypt un-scrambles and compares)

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
             return res.status(401).json({ success: false, message: "Invalid credentials"});
        }

        //3. Create the VIP wristband (JWT token)
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET,{expiresIn: '30d'});

        res.status(200).json({ success: true, token });   
    }
    catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
};

export {register, login};