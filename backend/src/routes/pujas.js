// Pujas Routes
const express = require('express');
const router = express.Router();
const {
  getPujaSeries,
  getPujaSeriesById,
  createPujaSeries,
  updatePujaSeries,
  cancelPujaSeries,
  deletePujaSeries
} = require('../controllers/pujas');
const { body } = require('express-validator');

// Validation rules
const pujaSeriesValidation = [
  body('name')
    .isLength({ min: 1, max: 200 })
    .withMessage('Name must be between 1 and 200 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters')
    .trim(),
  body('type')
    .isIn(['aarti', 'havan', 'puja', 'special_ceremony', 'festival', 'other'])
    .withMessage('Invalid puja type'),
  body('community_id')
    .isMongoId()
    .withMessage('Valid community ID is required'),
  body('start_date')
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('schedule_config')
    .exists()
    .withMessage('Schedule configuration is required'),
  body('duration_minutes')
    .optional()
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration must be between 15 and 480 minutes'),
  body('max_participants')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max participants must be a positive integer'),
  body('registration_required')
    .optional()
    .isBoolean()
    .withMessage('Registration required must be a boolean')
];

// Routes
router.get('/', getPujaSeries);
router.get('/:id', getPujaSeriesById);
router.post('/', pujaSeriesValidation, createPujaSeries);
router.put('/:id', pujaSeriesValidation, updatePujaSeries);
router.post('/:id/cancel', cancelPujaSeries);
router.delete('/:id', deletePujaSeries);

module.exports = router;
