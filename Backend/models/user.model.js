const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minLength: [3, 'first name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minLength: [3, 'last name must be at least 3 characters long'],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'email must be atleast 5 characters long']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String,
    }
});

// generate token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
};

// compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// FIXED: hash password
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
