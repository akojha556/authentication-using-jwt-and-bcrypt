import express from "express";
import { createUser, loginUser, getMe } from "../controller/user-controller.js";
import { protect } from "../middleware/auth-middleware.js";

export const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", protect, getMe);