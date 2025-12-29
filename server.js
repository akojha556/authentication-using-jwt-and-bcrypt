import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import goalRouter from "./router/goal-router.js";
import errorHandler from "./middleware/error-middleware.js";
import userRouter from "./router/user-router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

await connectDB();

app.get("/", (req, res) => {
     res.status(200).json({ message: "Hello World" });
});

app.use("/api/goals", goalRouter);
app.use("/api/users", userRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
     console.log(`Server is running at PORT ${PORT}`);
});