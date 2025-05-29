import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please enter a username"],
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    },
    avatar: {
        type: {
            url: String,
            localPath: String
        },
        default: {
            url: "public/images/default-profile.png",
            localPath: ""
        }
    }
}, {timestamps: true});



export const User = mongoose.model("User", userSchema)