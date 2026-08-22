const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authroutes");
const practitionerRoutes = require("./routes/practitionerroutes");
const adminRoutes = require("./routes/adminroutes");

const errorMiddleware = require("./middleware/errormiddleware");

const app = express();

/*
 * ----------------------------------------------------
 * Global Middleware
 * ----------------------------------------------------
 */

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/*
 * ----------------------------------------------------
 * Uploaded Documents
 * ----------------------------------------------------
 *
 * Allows uploaded practitioner documents to be accessed
 * through /uploads/...
 */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/*
 * ----------------------------------------------------
 * Health Check
 * ----------------------------------------------------
 */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Nurova backend API is running",
  });
});

/*
 * ----------------------------------------------------
 * API Routes
 * ----------------------------------------------------
 */

app.use("/api/auth", authRoutes);

app.use("/api/practitioners", practitionerRoutes);

app.use("/api/admin", adminRoutes);

/*
 * ----------------------------------------------------
 * 404 Handler
 * ----------------------------------------------------
 */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/*
 * ----------------------------------------------------
 * Global Error Handler
 * ----------------------------------------------------
 */

app.use(errorMiddleware);

module.exports = app;