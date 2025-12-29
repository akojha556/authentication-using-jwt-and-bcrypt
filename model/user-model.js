import mongoose from "mongoose";

const userSchema = mongoose.Schema({
     name: {
          type: String,
          required: [true, "Please enter a valid name"],
          trim: true
     },
     email: {
          type: String,
          required: [true, "Please enter a valid email id"],
          unique: true,
          trim: true
     },
     password: {
          type: String,
          required: [true, "Please eneter a password"],
     }
}, { timestamps: true });

export default mongoose.model("User", userSchema);