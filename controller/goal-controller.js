import expressAsyncHandler from "express-async-handler";
import Goal from "../model/goal-model.js";
import User from "../model/user-model.js";
import mongoose from "mongoose";

//Get goals
export const getGoals = expressAsyncHandler(async (req, res) => {
     const goals = await Goal.find({ user: req.user.id });
     res.status(200).json({
          message: "Goals by " + req.user.name,
          goals
     });
});

//Set goals
export const setGoals = expressAsyncHandler(async (req, res) => {
     const { text } = req.body || "";

     if (!text) {
          res.status(404);
          throw new Error("Invalid Format");
     }

     const goal = await Goal.create({
          user: req.user.id,
          text: text
     });
     res.status(201).json({
          message: "Goal created by " + req.user.name,
          goal
     });
});

//Update goals
export const updateGoals = expressAsyncHandler(async (req, res) => {
     const id = req.params.id;

     if (!mongoose.Types.ObjectId.isValid(id)) {
          res.status(400);
          throw new Error("The ID is invalid!");
     }

     //Find Goal
     const goal = await Goal.findById(id);

     if (!goal) {
          res.status(404);
          throw new Error("Goal not available");
     }

     //Find user
     const user = await User.findById(req.user.id);

     //Verify User
     if (user.id !== goal.user.toString()) {
          res.status(401);
          throw new Error("Unauthorised!");
     }

     const updatedGoal = await Goal.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
     res.status(200).json(updatedGoal);
});

//Delete goals
export const deleteGoals = expressAsyncHandler(async (req, res) => {
     const id = req.params.id;

     if (!mongoose.Types.ObjectId.isValid(id)) {
          res.status(400);
          throw new Error("The ID is invalid!");
     }

     //Find goal
     const goal = await Goal.findById(id);

     //Find and verify user
     const user = await User.findById(req.user.id);

     if (goal.user.toString() !== user.id) {
          res.status(401);
          throw new Error("Unauthorised!");
     }

     await Goal.findByIdAndDelete(id);

     res.status(200).json(`The goal contained ID ${id} is removed successfully.`);
});