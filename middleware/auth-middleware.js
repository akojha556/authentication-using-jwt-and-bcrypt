import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../model/user-model.js";

export const protect = asyncHandler(async (req, res, next) => {
     let token;

     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
          try {
               //get token
               token = req.headers.authorization.split(" ")[1];

               //Verify the token
               const decode = jwt.verify(token, process.env.JWT_SECRET);

               //Get the user from the token
               req.user = await User.findById(decode.id).select("-password");

               next();
          } catch (error) {
               console.log(error);
               res.status(401);
               throw new Error("Unauthorised!");
          }
     }

     if (!token) {
          res.status(401);
          throw new Error("Unauthorised, no token");
     }
});