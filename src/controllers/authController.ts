const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

export const registerUser = async (req: any, res: any) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is required" });
        }

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save(); // <-- VERY IMPORTANT

        const token = jwt.sign(
            { userid: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const loginUser = async (req: any, res: any) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is required" });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userid: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
};
