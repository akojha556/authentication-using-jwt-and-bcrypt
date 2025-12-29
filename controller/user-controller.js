import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user-model.js";
import expressAsyncHandler from "express-async-handler";

//Register user
export const registerUser = expressAsyncHandler(async (req, res) => {
     const { name, email, password } = req.body || {};

     if (!name || !email || !password) {
          res.status(400);
          throw new Error("Invalid user data");
     };

     //Check if user exists or not
     const user = await User.findOne({ email });

     if (user) {
          res.status(409);
          throw new Error("User already exists");
     };

     // Hashing password
     const salt = await bcrypt.genSalt(12);
     const hashedPassword = await bcrypt.hash(password, salt);

     const newUser = await User.create({
          name,
          email,
          password: hashedPassword
     });

     if (newUser) {
          res.status(201).json({
               _id: newUser.id,
               name: newUser.name,
               email: newUser.email
          });
     } else {
          res.status(400);
          throw new Error("Invalid user-data");
     }
});

//Login user
export const loginUser = expressAsyncHandler(async (req, res) => {
     const { email, password } = req.body || {};

     if (!email || !password) {
          res.status(400);
          throw new Error("Invalid user data");
     };

     //Check user exists or not
     const userExists = await User.findOne({ email });

     if (userExists && (await bcrypt.compare(password, userExists.password))) {
          res.status(200).json({
               _id: userExists.id,
               name: userExists.name,
               email: userExists.email
          });
     } else {
          res.status(400);
          throw new Error("Invalid credentials");
     }
});

//Get me
export const getMe = expressAsyncHandler(async (req, res) => {
     res.status(200).json({ message: "Get me" });
});