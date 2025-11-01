# Quick Expenses Setup - 3 Steps

## ✅ Step 1: Create Database Table

1. **Open Supabase Dashboard**
2. **Go to SQL Editor**
3. **Copy and paste `create-expenses-table.sql`**
4. **Run the script** - Creates table with 8 sample expenses

## ✅ Step 2: Restart Backend Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm start
# OR
node backend/src/server.js
```

## ✅ Step 3: Test the System

1. **Open ExpensesTab** in frontend
2. **Check debug panel** - should show expenses count
3. **Try adding expense** - fill form and submit
4. **Verify API** - run: `node test-expenses-api.js`

## 🎯 Expected Results

- **8 sample expenses** displayed
- **Add expense form** with vendor, type, amount fields
- **Expenses saved** to dedicated expenses table
- **Debug info** shows API endpoint `/api/expenses`

## 🔧 If Issues:

1. **Check console** for errors
2. **Verify table** exists in Supabase
3. **Test API** with test script
4. **Restart server** if routes not found

## 📋 Form Fields:

- **Vendor Name** (optional)
- **Description** (required)
- **Amount** (required)
- **Expense Type** (operational, maintenance, etc.)
- **Payment Method** (cash, UPI, etc.)
- **Budget Category** (links to existing categories)
- **Date** (expense date)
- **Notes** (optional)

The ExpensesTab is now fully configured for the dedicated expenses table!
