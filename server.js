const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

// -----------------------------
// Connect to MongoDB
// -----------------------------
connectDB();

const app = express();

// -----------------------------
// CORS Setup
// -----------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        return callback(
          new Error(`CORS policy: Origin ${origin} not allowed`),
          false
        );
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// -----------------------------
// Body Parsers
// -----------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----------------------------
// Routes
// -----------------------------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/stories", require("./routes/storyRoutes"));

// -----------------------------
// Health Check
// -----------------------------
app.get("/", (req, res) => {
  res.send("Travel Story API is running 🚀");
});

// -----------------------------
// Start Server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
