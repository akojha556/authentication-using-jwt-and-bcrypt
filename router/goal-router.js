import express from "express";
import { getGoals, setGoals, updateGoals, deleteGoals } from "../controller/goal-controller.js";
import { protect } from "../middleware/auth-middleware.js";

export const goalRouter = express.Router();

goalRouter.route("/").get(protect, getGoals).post(protect, setGoals);
goalRouter.route("/:id").put(protect, updateGoals).delete(protect, deleteGoals);