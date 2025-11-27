const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    try {
        let token;

        // 1. Check Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // 2. Check cookies if you use cookies
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        // No token found
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const isBlacklisted=await userModel.findOne({toke:token});
        if(isBlacklisted){
            return res.status(401).json({message:"Unauthorized: Token is blacklisted"});
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id || decoded._id);
        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
