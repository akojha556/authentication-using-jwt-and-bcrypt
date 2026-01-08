import User from "../model/user-model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Create user
export const createUser = asyncHandler(async (req, res) => {
     const { name, email, password } = req.body || {};

     //Check if empty
     if (!name || !email || !password) {
          res.status(400);
          throw new Error("The filed should not be empty.");
     }

     //Check user is already available?
     const user = await User.findOne({ email });

     if (user) {
          res.status(409);
          throw new Error("User is aready available! try login!");
     }

     //Hash the password using bcrypt
     const saltRounds = await bcrypt.genSalt(12);
     const hashedPassword = await bcrypt.hash(password, saltRounds);

     //Creating User
     const newUser = await User.create({
          name,
          email,
          password: hashedPassword,
     });

     if (newUser) {
          res.status(200).json({
               _id: newUser.id,
               name: newUser.name,
               email: newUser.email,
               token: generateToken(newUser._id),
          });
     } else {
          res.status(400);
          throw new Error("Invalid Data!");
     }
});

//Login user
export const loginUser = asyncHandler(async (req, res) => {
     const { email, password } = req.body || {};

     //Validate field
     if (!email || !password) {
          res.status(400);
          throw new Error("The filed should not be empty.");
     }

     const user = await User.findOne({ email });

     if (user && await (bcrypt.compare(password, user.password))) {
          return res.status(200).json({
               _id: user.id,
               name: user.name,
               email: user.email,
               token: generateToken(user._id),
          });
     } else {
          res.status(400);
          throw new Error("Invalid credentials!");
     }
});

//Changing the password 
export const changePassword = asyncHandler(async (req, res) => {
     const { currentPassword, newPassword } = req.body || {};

     if(!currentPassword || !newPassword) {
          res.status(400);
          throw new Error("Fields should not be empty!");
     }

     //Check user authorization
     const user = await User.findById(req.user.id);

     if (!user) {
          res.status(401);
          throw new Error("Unauthorised Action!");
     }

     //check correct current password or not and update
     if (user && await (bcrypt.compare(currentPassword, user.password))) {

          //Hash the new password
          const saltRounds = await bcrypt.genSalt(12);
          const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

          const newUser = await User.findByIdAndUpdate(user.id, {
               email: user.email,
               password: hashedPassword
          }, { new: true });

          res.status(201).json({
               message: "Your password updated successfully."
          });
     } else {
          res.status(401);
          throw new Error("Invalid Credentials! Try again.");
     }
});

//Get me
export const getMe = asyncHandler(async (req, res) => {
     res.status(200).json(req.user);
});

//Generate Token
const generateToken = (id) => {
     return jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: "1d"
     })
};