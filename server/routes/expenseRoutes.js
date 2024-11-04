const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Create a new expense
router.post('/', async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all expenses for a specific month/year
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
