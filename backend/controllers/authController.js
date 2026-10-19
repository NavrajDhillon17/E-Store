const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Helper to create token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// Register
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Allow creating admin only if explicitly specified, otherwise default to user
        const userRole = role === "admin" ? "admin" : "user";

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: userRole
        });

        const token = generateToken(user);

        res.status(201).json({
            message: "Account created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const cleanEmail = email.toLowerCase().trim();
        let user = await User.findOne({ email: cleanEmail });
        if (!user && cleanEmail.includes("@haven.com")) {
            user = await User.findOne({ email: cleanEmail.replace("@haven.com", "@novastore.com") });
        } else if (!user && cleanEmail.includes("@novastore.com")) {
            user = await User.findOne({ email: cleanEmail.replace("@novastore.com", "@haven.com") });
        }

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};

// Get current user profile (verify token)
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to authenticate session", error: err.message });
    }
};

module.exports = { register, login, getMe };
