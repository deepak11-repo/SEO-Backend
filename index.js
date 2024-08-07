const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;

const optimzationRoutes = require("./routes/optimization");
const reportRoutes = require("./routes/report");

// Configure CORS
const corsOptions = {
  origin: 'https://seo-frontend-two.vercel.app', // Your frontend domain
  methods: ['GET', 'POST'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Include credentials like cookies in requests
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions)); // Enable preflight for all routes


// Middleware
app.use(express.json()); // Built-in middleware for JSON parsing
app.use(express.urlencoded({ extended: false })); // Built-in middleware for URL-encoded bodies

// Logging middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://seo-frontend-two.vercel.app');
    console.log('CORS headers set');
  next();
});

// Routes
app.get("/", (req, res) => {
  res.status(200).json("Server is up and running");
});

app.use("/api/optimize", optimzationRoutes);
app.use("/api/report", reportRoutes);



// Set view engine
app.set("view engine", "ejs");

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

