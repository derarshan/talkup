import cloudinary from "../lib/cloudinary.lib.js";
import { generateToken } from "../lib/utils.lib.js";
import User from "../models/user.model.js"
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName, !email || !password) {
            return res.status(400).json({ message: "Missing required field/s" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (err) {
        console.log("Error in signup controller: ", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const unhashedPassword = await bcrypt.compare(password, user.password);
        if (!unhashedPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            profilePic: user.profilePic,
        })
    } catch (err) {
        console.error("Error in login controller: ", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Error in logout controller: ", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            res.status(400).json({ message: "Profile picture is required, it looks good you know..." });
        }

        const uploadRes = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadRes.secure_url }, { new: true });

        res.status(200).json(updatedUser);

        console.log("userId:", userId);
    } catch (err) {
        console.error("Error in updateUser controller: ", err.message, err.stack);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        console.error("Error in checkAuth controller: ", err);
        res.status(500).json({ message: "Internal server error" });
    }
};