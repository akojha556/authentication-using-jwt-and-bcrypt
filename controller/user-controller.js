import User from "../model/user-model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

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

     if (!currentPassword || !newPassword) {
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

//Forget password controller
export const forgetPassword = asyncHandler(async (req, res) => {
     const { email } = req.body || "";
     //check email field!
     if (!email) {
          res.status(400);
          throw new Error("Email Required!");
     }
     //find email in db
     const user = await User.findOne({ email }).select("-password");

     if (!user) {
          res.status(400);
          throw new Error("This email is not available!");
     }

     //Generate token using crypto
     const resetToken = crypto.randomBytes(32).toString("hex");
     console.log(user);
     user.resetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
     user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

     await user.save();
     const resetUrl = `http://localhost:3000/api/users/reset-password/${resetToken}`;

     await sendEmail(
          user.email,
          "Password Reset",
          `Click here to reset your password ${resetUrl}`
     );
     res.status(200).json({ message: "We have sent a password reset link to your mail." });
});

//Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
     const { token } = req.params;
     const { newPassword } = req.body || {};

     //has token and match
     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
     const user = await User.findOne({
          resetToken: hashedToken
     });

     if (!user) {
          res.status(400).json({ message: "Sorry! Unauthorised!" });
     }

     console.log(hashedToken);
     console.log(user.resetToken);


     //Check token expiry
     if (user.resetTokenExpire > Date.now() + 15 * 60 * 1000) {
          res.status(400).json({ message: "Token Expired! Try Again resetting the password!" });
     }

     //Hash password and save
     const saltRounds = await bcrypt.genSalt(12);
     user.password = await bcrypt.hash(newPassword, saltRounds);

     //Then save the new password
     await user.save();
     res.status(201).json({ message: "Password updated." });
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