const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel=require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        console.log(req.body);

        const { fullname, email, password } = req.body;

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({
            fullname,
            email,
            password: hashedPassword
        });

        const token = user.generateAuthToken();

        res.status(201).json({ token, user });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();

  // ⭐⭐⭐ COOKIE SET KARO (THIS IS THE MAIN PART YOU MISSED)
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,      // localhost ke liye FALSE
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json({
    message: "Login successful",
    user,
  });
};




module.exports.getUserProfile=async (req,res,next)=>{
    res.status(200).json(req.user);

}

module.exports.logoutUser = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "No token found" });
    }

    await blacklistTokenModel.create({ token });

    res.clearCookie("token");

    res.status(200).json({ message: "Logged out successfully" });
};


