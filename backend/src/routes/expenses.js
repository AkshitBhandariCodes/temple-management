// Expenses Routes
const express = require('express');
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  approveExpense,
  rejectExpense,
  deleteExpense,
  getExpenseStats
} = require('../controllers/expenses');
const { body } = require('express-validator');

// Validation rules
const expenseValidation = [
  body('description')
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters')
    .trim(),
  body('vendor_name')
    .isLength({ min: 1, max: 200 })
    .withMessage('Vendor name must be between 1 and 200 characters')
    .trim(),
  body('receipt_number')
    .isLength({ min: 1, max: 100 })
    .withMessage('Receipt number must be between 1 and 100 characters')
    .trim(),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 0 })
    .withMessage('Amount must be positive'),
  body('category')
    .isIn(['maintenance', 'utilities', 'salaries', 'materials', 'events', 'other'])
    .withMessage('Invalid category'),
  body('expense_date')
    .isISO8601()
    .withMessage('Valid expense date is required')
];

// Routes
router.get('/', getExpenses);
router.get('/stats', getExpenseStats);
router.get('/:id', getExpenseById);
router.post('/', expenseValidation, createExpense);
router.put('/:id', expenseValidation, updateExpense);
router.post('/:id/approve', approveExpense);
router.post('/:id/reject', rejectExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
