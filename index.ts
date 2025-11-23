require("dotenv").config();
import express from "express";
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

require("dotenv").config();
const app = express();

app.use("/api/auth", authRoutes);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(" MongoDB connected"))
  .catch((err:any) => console.error("DB error:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
