// Ultra-Simple Pujas Routes - No Validation
const express = require('express');
const router = express.Router();
const supabaseService = require('../services/supabaseService');

console.log('🔄 Loading ultra-simple puja routes...');

// GET all puja series
router.get('/', async (req, res) => {
  try {
    console.log('📿 GET /api/pujas - Fetching puja series...');

    const { data, error } = await supabaseService.client
      .from('puja_series')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase GET error:', error);
      throw error;
    }

    console.log('✅ Found', data?.length || 0, 'puja series');

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('❌ GET Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch puja series',
      error: error.message
    });
  }
});

// POST create new puja series - ZERO VALIDATION
router.post('/', async (req, res) => {
  try {
    console.log('📿 POST /api/pujas - Creating puja series...');
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));

    // Direct insert - no validation whatsoever
    const { data, error } = await supabaseService.client
      .from('puja_series')
      .insert(req.body)
      .select('*')
      .single();

    if (error) {
      console.error('❌ Supabase POST error:', JSON.stringify(error, null, 2));

      return res.status(400).json({
        success: false,
        message: 'Database error - check if table exists and has correct schema',
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        supabase_error: error
      });
    }

    console.log('✅ Puja series created successfully:', data.id);

    res.status(201).json({
      success: true,
      data: data,
      message: 'Puja series created successfully'
    });
  } catch (error) {
    console.error('❌ POST Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// PUT update puja series
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📿 PUT /api/pujas/' + id + ' - Updating puja series...');

    const { data, error } = await supabaseService.client
      .from('puja_series')
      .update(req.body)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('❌ Supabase PUT error:', error);
      throw error;
    }

    console.log('✅ Puja series updated:', data.id);

    res.json({
      success: true,
      data: data,
      message: 'Puja series updated successfully'
    });
  } catch (error) {
    console.error('❌ PUT Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update puja series',
      error: error.message
    });
  }
});

// DELETE puja series
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📿 DELETE /api/pujas/' + id + ' - Deleting puja series...');

    const { data, error } = await supabaseService.client
      .from('puja_series')
      .delete()
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('❌ Supabase DELETE error:', error);
      throw error;
    }

    console.log('✅ Puja series deleted:', data.id);

    res.json({
      success: true,
      message: 'Puja series deleted successfully'
    });
  } catch (error) {
    console.error('❌ DELETE Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete puja series',
      error: error.message
    });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  console.log('🧪 Test endpoint called');
  res.json({
    success: true,
    message: 'Ultra-simple puja routes are working!',
    timestamp: new Date().toISOString(),
    no_validation: true
  });
});

console.log('✅ Ultra-simple puja routes loaded successfully');

module.exports = router;