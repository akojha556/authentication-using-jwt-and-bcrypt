import mongoose from "mongoose";

const userSchema = mongoose.Schema({
     name: {
          type: String,
          required: [true, "Please enter a name."],
          trim: true
     },
     email: {
          type: String,
          required: [true, "Please enter a valid email."],
          trim: true,
          unique: true
     },
     password: {
          type: String,
          required: [true, "Please enter a valid password."]
     }
}, { timestamps: true });

export default mongoose.model("User", userSchema);