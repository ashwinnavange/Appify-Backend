const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(202).json({
            success: false,
            message: "User already exists",
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword });

    jwt.sign({ _id: user._id }, process.env.JWT_SECRET, (err, token) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
        res.status(201).json({
            success: true,
            message: "User Created",
            token: token,
            name: user.name,
        })
    });
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    //checking if user has givne password and email both

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter email and password",
        });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(202).json({
            success: false,
            message: "Invalid email or password",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(202).json({
            success: false,
            message: "Invalid Password",
        });
    }
    jwt.sign({ _id: user._id }, process.env.JWT_SECRET, (err, token) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
        res.status(200).json({
            success: true,
            message: "Login Successful",
            token: token,
            name: user.name,
        })
    });
};

exports.getUser = async (req, res) => {
    const user = await User.findById(req.params._id);
    if (user) {
        return res.status(200).json({
            ...user.toObject(),
        });
    }
    return res.status(202).json({
        success: false,
        message: "User not found",
    });

};