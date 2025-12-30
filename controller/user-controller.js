import bcrypt from "bcryptjs";
import User from "../model/user-model.js";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

//Register user
export const registerUser = expressAsyncHandler(async (req, res) => {
     const { name, email, password } = req.body || {};

     //check if name, email and pw available or not
     if (!name || !email || !password) {
          res.status(400);
          throw new Error("Invalid user data");
     };

     //check user already exists?
     const user = await User.findOne({ email });
     if (user) {
          res.status(409);
          throw new Error("User already exists");
     };

     //Before creating user first hash the pw
     const saltRounds = await bcrypt.genSalt(12);
     const hashedPassword = await bcrypt.hash(password, saltRounds);

     //Then creating new user with hashed password
     const newUser = await User.create({
          name,
          email,
          password: hashedPassword
     });

     if (newUser) {
          res.status(201).json({
               _id: newUser.id,
               name: newUser.name,
               email: newUser.email,
               token: generateToken(newUser._id),
          });
     } else {
          res.status(400);
          throw new Error("Invalid user data.")
     }
});

//Login user
export const loginUser = expressAsyncHandler(async (req, res) => {
     const { email, password } = req.body || {};

     //Check if email and pw available or not
     if (!email || !password) {
          res.status(400);
          throw new Error("Invalid credentials");
     };

     const user = await User.findOne({ email });

     if (user && (await bcrypt.compare(password, user.password))) {
          res.status(200).json({
               _id: user.id,
               name: user.name,
               email: user.email,
               token: generateToken(user._id),
          });
     } else {
          res.status(404);
          throw new Error("invalid credentials");
     };
});

//Get me user
export const getMe = expressAsyncHandler(async (req, res) => {
     const { _id, name, email } = await User.findById(req.user.id);
     res.status(200).json({
          id: _id,
          name,
          email,
     });
});

//Generate token
const generateToken = (id) => {
     return jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: "1h"
     });
};