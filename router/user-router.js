import express from "express";
import { createUser, loginUser, changePassword, getMe } from "../controller/user-controller.js";
import { protect } from "../middleware/auth-middleware.js";

export const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/change-password", protect, changePassword);
userRouter.get("/me", protect, getMe);