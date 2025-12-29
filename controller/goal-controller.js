import expressAsyncHandler from "express-async-handler";
import Goal from "../model/goal-model.js";
import mongoose, { mongo } from "mongoose";

//Get goals
export const getGoals = expressAsyncHandler(async (req, res) => {
     const goals = await Goal.find();
     res.status(200).json(goals);
});

//Set goals
export const setGoals = expressAsyncHandler(async (req, res) => {
     const { text } = req.body || "";

     if (!text) {
          res.status(404);
          throw new Error("Invalid Format");
     }

     const goal = await Goal.create({ text: text });
     res.status(201).json(goal);
});

//Update goals
export const updateGoals = expressAsyncHandler(async (req, res) => {
     const id = req.params.id;

     if (!mongoose.Types.ObjectId.isValid(id)) {
          res.status(400);
          throw new Error("The ID is invalid!");
     }

     const updatedGoal = await Goal.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

     if (!updatedGoal) {
          res.status(404);
          throw new Error("Goal not available");
     }

     res.status(200).json(updatedGoal);
});

//Delete goals
export const deleteGoals = expressAsyncHandler(async (req, res) => {
     const id = req.params.id;

     if (!mongoose.Types.ObjectId.isValid(id)) {
          res.status(400);
          throw new Error("The ID is invalid!");
     }

     const deleteGoal = await Goal.findByIdAndDelete(id);

     if (!deleteGoal) {
          res.status(404);
          throw new Error("Goal not available");
     }

     res.status(200).json(id);
});