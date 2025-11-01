# Expenses Table Setup Instructions

## What I've Fixed

I've created a dedicated `expenses` table system to properly handle expense
management instead of using the generic `transactions` table. Here's what has
been implemented:

## 1. Database Setup ✅

**File Created:** `create-expenses-table.sql`

This creates:

- **`expenses` table** - Dedicated table for expense records with proper fields
- **`expense_attachments` table** - For receipt and document attachments
- **Indexes** - For performance optimization
- **Triggers** - Auto-generate receipt numbers and update timestamps
- **Sample Data** - 8 sample expense records for testing

### Key Fields in Expenses Table:

- `vendor_name` - Name of the vendor/supplier
- `description` - Expense description
- `amount` - Expense amount
- `expense_type` - Category (operational, maintenance, utilities, etc.)
- `payment_method` - How payment was made
- `expense_date` - When the expense occurred
- `budget_category_id` - Links to budget categories
- `receipt_number` - Auto-generated receipt number (EXP25001, etc.)

## 2. Backend API ✅

**File Created:** `backend/src/routes/expenses.js`

New API endpoints:

- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/reports/summary` - Expense summary
- `GET /api/expenses/reports/by-category` - Category breakdown
- `GET /api/expenses/reports/monthly` - Monthly reports

**File Updated:** `backend/src/server.js`

- Added expenses routes registration

## 3. Frontend API Hooks ✅

**File Updated:** `src/hooks/use-complete-api.tsx`

New hooks added:

- `useExpenses()` - Fetch all expenses
- `useCreateExpense()` - Create new expense
- `useUpdateExpense()` - Update expense
- `useDeleteExpense()` - Delete expense
- `useExpensesSummary()` - Get expense summary
- `useExpensesByCategory()` - Category breakdown
- `useMonthlyExpenses()` - Monthly reports

## 4. Frontend Component ✅

**File Updated:** `src/components/finance/ExpensesTab.tsx`

Changes made:

- Updated to use `useExpenses()` instead of `useTransactions()`
- Updated to use `useCreateExpense()` instead of `useCreateTransaction()`
- Added vendor name field to the form
- Updated field names to match expenses table schema
- Added debug information panel
- Enhanced UI with proper expense-specific display

## 5. What You Need to Do

### Step 1: Create the Database Table

1. **Open Supabase Dashboard**
2. **Go to SQL Editor**
3. **Copy and paste the contents of `create-expenses-table.sql`**
4. **Run the SQL script**

This will create the expenses table with sample data.

### Step 2: Restart the Backend Server

The backend server needs to be restarted to pick up the new expenses routes.

1. **Stop the current backend server** (Ctrl+C)
2. **Restart it:** `npm start` or `node backend/src/server.js`

### Step 3: Test the System

1. **Open the ExpensesTab** in the frontend
2. **Check the debug information** - it should show the API endpoint as
   `/api/expenses`
3. **Try adding a new expense** - fill in the form and submit
4. **Check if expenses appear** in the list

## 6. Expected Results

After setup, you should see:

- **8 sample expenses** loaded from the database
- **Proper expense form** with vendor name, description, amount, etc.
- **Expenses displayed** with vendor information and proper dates
- **Debug panel** showing correct data counts
- **New expenses** being added to the dedicated expenses table

## 7. Troubleshooting

If expenses still don't show:

1. **Check browser console** for any API errors
2. **Verify database table** was created successfully
3. **Check backend logs** for any route errors
4. **Test API directly:** `GET http://localhost:5000/api/expenses`

## 8. Key Differences from Transactions

| Transactions Table | Expenses Table                   |
| ------------------ | -------------------------------- |
| `type` field       | No type field (all are expenses) |
| `date` field       | `expense_date` field             |
| `category_id`      | `budget_category_id`             |
| No vendor info     | `vendor_name`, `vendor_contact`  |
| Generic structure  | Expense-specific fields          |

The expenses table is now properly structured for expense management with vendor
tracking, receipt management, and proper categorization.
