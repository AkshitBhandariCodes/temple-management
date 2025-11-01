// Finance Routes
const express = require('express');
const router = express.Router();
const supabaseService = require('../services/supabaseService');

// =============================================
// BUDGET CATEGORIES ROUTES
// =============================================

// GET all budget categories
router.get('/categories', async (req, res) => {
    try {
        console.log('💰 Fetching budget categories...');

        const { data, error } = await supabaseService.client
            .from('budget_categories')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            data: data || []
        });
    } catch (error) {
        console.error('Error fetching budget categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch budget categories',
            error: error.message
        });
    }
});

// POST create budget category
router.post('/categories', async (req, res) => {
    try {
        console.log('💰 Creating budget category:', req.body);

        const { data, error } = await supabaseService.client
            .from('budget_categories')
            .insert(req.body)
            .select('*')
            .single();

        if (error) throw error;

        res.status(201).json({
            success: true,
            data: data,
            message: 'Budget category created successfully'
        });
    } catch (error) {
        console.error('Error creating budget category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create budget category',
            error: error.message
        });
    }
});

// =============================================
// TRANSACTIONS ROUTES
// =============================================

// GET all transactions
router.get('/transactions', async (req, res) => {
    try {
        console.log('💳 Fetching transactions...');

        const { data, error } = await supabaseService.client
            .from('transactions')
            .select(`
        *,
        budget_categories (
          id,
          name,
          category_type
        )
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            data: data || []
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transactions',
            error: error.message
        });
    }
});

// POST create transaction
router.post('/transactions', async (req, res) => {
    try {
        console.log('💳 Creating transaction:', req.body);

        const { data, error } = await supabaseService.client
            .from('transactions')
            .insert(req.body)
            .select('*')
            .single();

        if (error) throw error;

        res.status(201).json({
            success: true,
            data: data,
            message: 'Transaction created successfully'
        });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create transaction',
            error: error.message
        });
    }
});

// PUT update transaction
router.put('/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('💳 Updating transaction:', id);

        const { data, error } = await supabaseService.client
            .from('transactions')
            .update(req.body)
            .eq('id', id)
            .select('*')
            .single();

        if (error) throw error;

        res.json({
            success: true,
            data: data,
            message: 'Transaction updated successfully'
        });
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update transaction',
            error: error.message
        });
    }
});

// DELETE transaction
router.delete('/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('💳 Deleting transaction:', id);

        const { data, error } = await supabaseService.client
            .from('transactions')
            .delete()
            .eq('id', id)
            .select('*')
            .single();

        if (error) throw error;

        res.json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete transaction',
            error: error.message
        });
    }
});

// =============================================
// REPORTS ROUTES
// =============================================

// GET financial summary
router.get('/summary', async (req, res) => {
    try {
        console.log('📊 Fetching financial summary...');

        // Get total income and expenses
        const { data: transactions, error } = await supabaseService.client
            .from('transactions')
            .select('type, amount');

        if (error) throw error;

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const netAmount = totalIncome - totalExpenses;

        res.json({
            success: true,
            data: {
                totalIncome,
                totalExpenses,
                netAmount,
                transactionCount: transactions.length
            }
        });
    } catch (error) {
        console.error('Error fetching financial summary:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch financial summary',
            error: error.message
        });
    }
});

module.exports = router;