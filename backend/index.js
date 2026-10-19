const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/products", productRoutes);
app.use("/auth", authRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "NovaStore API", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`NovaStore Server running on port ${PORT}`);
});
