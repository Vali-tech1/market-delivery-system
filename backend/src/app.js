const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

console.log("APP.JS I RI U STARTUA");

app.use(cors());
app.use(express.json());

// Test route për databazë
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Backend connected successfully",
      time: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// API routes kryesore
// API routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/orders-test", (req, res) => {
  res.json({
    message: "Direct GET orders test works"
  });
});

app.post("/api/orders-test", (req, res) => {
  res.json({
    message: "Direct POST orders test works",
    body: req.body
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
