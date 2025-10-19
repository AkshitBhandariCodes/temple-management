// Donations Routes
const express = require('express');
const router = express.Router();
const {
  getDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
  getDonationStats
} = require('../controllers/donations');
const { body } = require('express-validator');

// Validation rules
const donationValidation = [
  body('receipt_number')
    .isLength({ min: 1 })
    .withMessage('Receipt number is required')
    .trim(),
  body('transaction_id')
    .isLength({ min: 1 })
    .withMessage('Transaction ID is required')
    .trim(),
  body('gross_amount')
    .isNumeric()
    .withMessage('Gross amount must be a number')
    .isFloat({ min: 0 })
    .withMessage('Gross amount must be positive'),
  body('net_amount')
    .isNumeric()
    .withMessage('Net amount must be a number')
    .isFloat({ min: 0 })
    .withMessage('Net amount must be positive'),
  body('source')
    .isIn(['web', 'hundi', 'in-temple', 'bank-transfer'])
    .withMessage('Invalid source'),
  body('provider')
    .isIn(['stripe', 'razorpay', 'manual', 'other'])
    .withMessage('Invalid provider'),
  body('payment_method')
    .isIn(['card', 'upi', 'netbanking', 'wallet', 'cash', 'cheque'])
    .withMessage('Invalid payment method'),
  body('donor_name')
    .optional()
    .trim(),
  body('donor_email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('donor_phone')
    .optional()
    .trim()
];

// Routes
router.get('/', getDonations);
router.get('/stats', getDonationStats);
router.get('/:id', getDonationById);
router.post('/', donationValidation, createDonation);
router.put('/:id', donationValidation, updateDonation);
router.delete('/:id', deleteDonation);

module.exports = router;
