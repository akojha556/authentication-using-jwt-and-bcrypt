import express from "express";
import { createUser, loginUser, changePassword, forgetPassword, resetPassword, getMe } from "../controller/user-controller.js";
import { protect } from "../middleware/auth-middleware.js";

export const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/change-password", protect, changePassword);
userRouter.post("/forget-password", forgetPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.get("/me", protect, getMe);