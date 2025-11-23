const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

export const registerUser = async (req: any, res:any) => {
    try {
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        const token =jwt.sign(
            { userid: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(201).json({ 
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
         });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
export const loginUser = async (req:any, res:any) => {
    try {
        const {name, email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { userid: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ 
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }catch (error) {
        res.status(500).json({ message: "Server error" });
    };
}