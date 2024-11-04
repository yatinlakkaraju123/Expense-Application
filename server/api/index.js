// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const categoryRoutes = require('../routes/categoryRoutes');
const expenseRoutes = require('../routes/expenseRoutes');
const cors = require('cors');
// Register routes

dotenv.config();

const app = express();
app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((error) => console.error("MongoDB connection error:", error));

// Define routes here
app.get('/', (req, res) => {
    res.send("Welcome to the Expense Tracker API");
});
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
