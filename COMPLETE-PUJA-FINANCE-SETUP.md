# Complete Puja & Finance Setup Guide

## Quick Setup (3 Steps)

### Step 1: Setup Database

Run this SQL in **Supabase Dashboard → SQL Editor**:

```sql
-- Copy and paste the entire content of complete-puja-finance-schema.sql
```

This creates:

- ✅ `puja_series` table (simplified schema)
- ✅ `budget_categories` table
- ✅ `transactions` table
- ✅ Sample data for testing
- ✅ All necessary indexes and policies

### Step 2: Restart Backend

```bash
# In your backend terminal
npm run dev
```

The backend now includes:

- ✅ Simplified `/api/pujas` routes (no validation issues)
- ✅ Complete `/api/finance` routes
- ✅ Proper error handling

### Step 3: Test the Features

#### Puja Management

1. Go to **Pujas** tab
2. Click **"Create Puja Series"**
3. Fill form:
   - Title: "Morning Aarti"
   - Type: "Aarti"
   - Location: "Main Temple"
   - Priest: "Pandit Sharma"
   - Start Time: "06:00"
4. Click **"Create Series"** → Should work instantly!

#### Finance Management

1. Go to **Finance** tab
2. See dashboard with sample data
3. Click **"Add Transaction"** to create income/expense
4. Click **"Add Category"** to create budget categories
5. View real-time financial summary

## What's Fixed

### Puja Issues ✅

- ❌ **Before**: Complex validation, schema mismatches
- ✅ **After**: Simple schema, direct API calls, no validation errors

### Finance Issues ✅

- ❌ **Before**: No backend, no database integration
- ✅ **After**: Complete CRUD operations, real-time data, financial dashboard

## Database Schema

### Puja Series (Simplified)

```sql
- id (uuid, primary key)
- name (text, required)
- description (text)
- type (text, default 'puja')
- location (text)
- priest (text)
- start_time (text)
- duration_minutes (integer, default 60)
- recurrence_type (text, default 'none')
- start_date (date)
- status (text, default 'active')
```

### Finance Tables

```sql
budget_categories:
- id, name, description, budget_amount, category_type

transactions:
- id, category_id, type, amount, description, date, payment_method

expense_reports:
- id, title, start_date, end_date, total_income, total_expenses
```

## API Endpoints

### Puja APIs

- `GET /api/pujas` - List all puja series
- `POST /api/pujas` - Create new puja series
- `PUT /api/pujas/:id` - Update puja series
- `DELETE /api/pujas/:id` - Delete puja series

### Finance APIs

- `GET /api/finance/categories` - List budget categories
- `POST /api/finance/categories` - Create category
- `GET /api/finance/transactions` - List transactions
- `POST /api/finance/transactions` - Create transaction
- `GET /api/finance/summary` - Financial summary

## Features Working

### Puja Management ✅

- Create/edit/delete puja series
- View puja list with real data
- Calendar and schedule views
- No validation errors

### Finance Management ✅

- Financial dashboard with real-time summary
- Income/expense tracking
- Budget category management
- Transaction history
- Payment method tracking
- Currency formatting (INR)

## Troubleshooting

### If Puja Creation Still Fails:

1. Check browser console for errors
2. Verify database schema was applied
3. Check backend logs for API errors
4. Ensure all required fields are filled

### If Finance Data Not Loading:

1. Verify `/api/finance` routes are working
2. Check database tables exist
3. Restart backend server
4. Check browser network tab for API calls

## Sample Data Included

The setup includes sample data for immediate testing:

- 4 sample puja series (Morning Aarti, Evening Aarti, etc.)
- 6 budget categories (Temple Maintenance, Donations, etc.)
- 4 sample transactions (donations, expenses)

Everything should work immediately after running the database setup!
