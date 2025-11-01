# Test Finance API Endpoints

## Quick API Tests

### Test 1: Budget Categories

**URL**: `http://localhost:5000/api/finance/categories` **Expected**: List of
budget categories

### Test 2: Transactions

**URL**: `http://localhost:5000/api/finance/transactions` **Expected**: List of
transactions with category details

### Test 3: Financial Summary

**URL**: `http://localhost:5000/api/finance/summary` **Expected**: Total income,
expenses, net amount

## Manual Test Steps

1. **Setup Database**: Run `setup-finance-database.sql` in Supabase Dashboard
2. **Restart Backend**: Stop and start backend server
3. **Test Endpoints**: Visit URLs above in browser
4. **Test Frontend**: Go to Finance tab in app

## Expected Results

### After Database Setup:

- ✅ 8 budget categories (4 income, 4 expense)
- ✅ 8 sample transactions
- ✅ 1 sample expense report

### API Responses Should Show:

- ✅ Categories with budget amounts and spent amounts
- ✅ Transactions with category relationships
- ✅ Financial summary with totals

### Frontend Should Display:

- ✅ Financial dashboard with summary cards
- ✅ Recent transactions list
- ✅ Budget categories overview
- ✅ Working "Add Transaction" and "Add Category" buttons

## If Finance Tab Not Working:

1. **Check browser console** for API errors
2. **Verify backend logs** for database connection issues
3. **Test API endpoints** directly in browser
4. **Check database tables** exist in Supabase Dashboard

The finance system should work immediately after running the database setup!
