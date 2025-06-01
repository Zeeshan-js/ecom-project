import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Cart } from "./cart.model.js";

const userSchema = new Schema(
  {
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
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: "public/images/default-profile.png",
        localPath: "",
      },
    },
  },
  { timestamps: true }
);

userSchema.post("save", async function (user, next) {
    const cart = await Cart.findOne({ owner: user._id})

    if (!cart) {
      await Cart.create({
        owner: user._id,
        items: []
      })
    }
    next();
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );
};

export const User = mongoose.model("User", userSchema);
