import { timeStamp } from "console";
import { mongo } from "mongoose";

const mongoose = require('mongoose');
const Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true

        },
    },
    {timeStamp: true}
);
const User = mongoose.model('User', Schema);
module.exports = User;