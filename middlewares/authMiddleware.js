const { User } = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
    const  token  = req.headers.authorization;

    if (!token)
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });

    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token",
            });
        }
    });
    next();
};