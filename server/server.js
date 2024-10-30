import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import authRoutes from "./routes/AuthRoute.js";
import contactRoutes from "./routes/ContactRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin:[process.env.ORIGIN], 
  methods:["GET", "POST", "PUT", "DELETE"],
  credentials:true,      // to enable cookies
}));

app.use("/uploads/profiles", express.static("uploads/profiles")); // to serve static files

app.use(cookieParser())
app.use(express.json());    // to parse incoming requests with JSON payloads
app.use("/api/auth", authRoutes)
app.use("/api/contacts", contactRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
