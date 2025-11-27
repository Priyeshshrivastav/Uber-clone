const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");

const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');

const app = express();

// Connect DB
connectToDb();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS WITH CREDENTIALS — REQUIRED FOR COOKIES
app.use(cors({
    origin: "http://localhost:3000",  // frontend URL
    credentials: true
}));

// COOKIE PARSER — REQUIRED FOR LOGOUT
app.use(cookieParser());


// Routes
app.get('/', (req, res) => {
    res.send("hello world");
});

app.use('/users', userRoutes);

module.exports = app;
