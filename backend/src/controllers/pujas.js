// Pujas Controller - MongoDB
const PujaSeries = require('../models/PujaSeries');
const { body, validationResult } = require('express-validator');

// Get all puja series with filtering and pagination
const getPujaSeries = async (req, res) => {
  try {
    const {
      community_id,
      status,
      type,
      page = 1,
      limit = 50
    } = req.query;

    const query = {};

    if (community_id && community_id !== 'all') {
      query.community_id = community_id;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const pujaSeries = await PujaSeries.find(query)
      .populate('community_id', 'name')
      .populate('priest_id', 'full_name')
      .populate('created_by', 'full_name')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PujaSeries.countDocuments(query);

    res.json({
      success: true,
      data: pujaSeries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching puja series:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch puja series'
    });
  }
};

// Get puja series by ID
const getPujaSeriesById = async (req, res) => {
  try {
    const { id } = req.params;

    const pujaSeries = await PujaSeries.findById(id)
      .populate('community_id', 'name')
      .populate('priest_id', 'full_name')
      .populate('created_by', 'full_name');

    if (!pujaSeries) {
      return res.status(404).json({
        success: false,
        message: 'Puja series not found'
      });
    }

    res.json({
      success: true,
      data: pujaSeries
    });
  } catch (error) {
    console.error('Error fetching puja series:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch puja series'
    });
  }
};

// Create new puja series
const createPujaSeries = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const pujaSeriesData = {
      ...req.body,
      created_by: req.user?.id || req.body.created_by
    };

    const pujaSeries = new PujaSeries(pujaSeriesData);
    await pujaSeries.save();

    // Populate the created puja series
    await pujaSeries.populate('community_id', 'name');
    await pujaSeries.populate('priest_id', 'full_name');
    await pujaSeries.populate('created_by', 'full_name');

    res.status(201).json({
      success: true,
      message: 'Puja series created successfully',
      data: pujaSeries
    });
  } catch (error) {
    console.error('Error creating puja series:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create puja series'
    });
  }
};

// Update puja series
const updatePujaSeries = async (req, res) => {
  try {
    const { id } = req.params;

    const pujaSeries = await PujaSeries.findByIdAndUpdate(
      id,
      {
        ...req.body,
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    ).populate('community_id', 'name')
     .populate('priest_id', 'full_name')
     .populate('created_by', 'full_name');

    if (!pujaSeries) {
      return res.status(404).json({
        success: false,
        message: 'Puja series not found'
      });
    }

    res.json({
      success: true,
      message: 'Puja series updated successfully',
      data: pujaSeries
    });
  } catch (error) {
    console.error('Error updating puja series:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update puja series'
    });
  }
};

// Cancel puja series
const cancelPujaSeries = async (req, res) => {
  try {
    const { id } = req.params;

    const pujaSeries = await PujaSeries.findByIdAndUpdate(
      id,
      {
        status: 'cancelled',
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    ).populate('community_id', 'name')
     .populate('priest_id', 'full_name')
     .populate('created_by', 'full_name');

    if (!pujaSeries) {
      return res.status(404).json({
        success: false,
        message: 'Puja series not found'
      });
    }

    res.json({
      success: true,
      message: 'Puja series cancelled successfully',
      data: pujaSeries
    });
  } catch (error) {
    console.error('Error cancelling puja series:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel puja series'
    });
  }
};

// Delete puja series
const deletePujaSeries = async (req, res) => {
  try {
    const { id } = req.params;

    const pujaSeries = await PujaSeries.findByIdAndDelete(id);

    if (!pujaSeries) {
      return res.status(404).json({
        success: false,
        message: 'Puja series not found'
      });
    }

    res.json({
      success: true,
      message: 'Puja series deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting puja series:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete puja series'
    });
  }
};

module.exports = {
  getPujaSeries,
  getPujaSeriesById,
  createPujaSeries,
  updatePujaSeries,
  cancelPujaSeries,
  deletePujaSeries
};
