import jwt from "jsonwebtoken";
import User from "../model/user-model.js";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
     let token;

     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
          try {
               //Get token
               token = req.headers.authorization.split(" ")[1];

               //Decode payload
               const decode = jwt.verify(token, process.env.JWT_SECRET);

               //Get the user
               req.user = await User.findById(decode.id).select("-password");

               next();
          } catch (error) {
               res.status(401);
               throw new Error("Unauthorised!");
          }
     };

     if (!token) {
          res.status(401);
          throw new Error("Unauthorised!, No token!");
     };
});