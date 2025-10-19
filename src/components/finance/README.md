# Finance Management Module

A comprehensive financial management system for temple administration with donation tracking, expense management, budget approvals, and financial reporting.

## Features

### 📊 Dashboard
- **Key Metrics**: Total donations, expenses, and net income with period selectors
- **Visual Charts**: Donation trends and expense category breakdowns
- **Recent Transactions**: Live feed of latest financial activities
- **Quick Stats**: Today's donations, monthly totals, pending reconciliations

### 💰 Donations Management
- **Multi-source Tracking**: Web gateway, Hundi, in-temple, bank transfers
- **Provider Integration**: Stripe, Razorpay, manual entries
- **Donor Information**: Complete donor profiles with contribution history
- **Receipt Management**: Automated receipt generation and tracking
- **Reconciliation Status**: Track matched vs unmatched transactions

### 💳 Expenses Management
- **Category-based Organization**: Maintenance, utilities, salaries, materials, events
- **Approval Workflow**: Pending, approved, rejected status tracking
- **Vendor Management**: Vendor profiles with payment history
- **Receipt Attachments**: Upload and manage expense receipts
- **Community Association**: Link expenses to specific communities or events

### 📋 Budget Management
- **Request System**: Community-based budget request submissions
- **Approval Process**: Finance team review and approval workflow
- **Line Item Breakdown**: Detailed budget item tracking
- **Attachment Support**: Supporting documents for budget requests
- **Decision Tracking**: Approval/rejection with notes and conditions

### 📈 Financial Reports
- **Pre-built Reports**: Income statements, cash flow, donor reports
- **Custom Report Builder**: Flexible report generation with filters
- **Multiple Formats**: PDF, Excel, CSV export options
- **Quick Reports**: Monthly, quarterly, annual summaries
- **Tax Compliance**: 80G tax exemption reports

### 🔄 Reconciliation
- **Transaction Matching**: Automatic and manual transaction reconciliation
- **Exception Handling**: Manage unmatched and problematic transactions
- **Provider Integration**: Match internal records with payment provider data
- **Progress Tracking**: Visual reconciliation progress indicators
- **Audit Trail**: Complete reconciliation history

## Components Structure

```
src/components/finance/
├── FinanceHeader.tsx          # Header with quick stats
├── FinanceDashboard.tsx       # Main dashboard with metrics and charts
├── DonationsTab.tsx           # Donation management interface
├── ExpensesTab.tsx            # Expense tracking and approval
├── BudgetsTab.tsx             # Budget request management
├── ReportsTab.tsx             # Report generation interface
├── ReconciliationTab.tsx      # Transaction reconciliation
├── types.ts                   # TypeScript type definitions
├── mockData.ts                # Sample data for development
└── index.ts                   # Component exports
```

## Data Models

### Donation
- Receipt and transaction tracking
- Donor information management
- Multi-provider support
- Community/event association
- Reconciliation status

### Expense
- Vendor and category tracking
- Approval workflow
- Receipt management
- Budget allocation
- Community association

### Budget Request
- Multi-level approval process
- Line item breakdown
- Attachment support
- Decision tracking
- Finance notes

## Key Features

### Interactive Elements
- Real-time donation updates
- Drag-and-drop receipt uploads
- Inline editing capabilities
- Bulk transaction actions
- Interactive charts with drill-down
- Auto-complete for vendors/donors
- Live search and filtering

### Role-Based Access
- **Super Admin**: Full system access
- **Finance**: CRUD operations and approvals
- **Chairman/Board**: Read-only reports access
- **Community Owner**: Community-specific data
- **Volunteer Coordinator**: Limited expense entry

### Security Features
- Audit trail for all changes
- Approval workflows for large amounts
- Receipt verification requirements
- Reconciliation tracking
- Role-based data access
- Secure file uploads

## Usage

The Finance module is integrated into the main application through the Finance page component. All data is currently stored locally using React state for development purposes.

### Navigation
Access through the main navigation tabs:
- Dashboard (default view)
- Donations
- Expenses
- Budgets
- Reports
- Reconciliation

### Local Data Storage
All financial data is temporarily stored in component state and mock data files. This allows for full functionality testing without backend dependencies.

## Future Enhancements

- Backend API integration
- Real-time payment provider webhooks
- Advanced reporting with charts
- Mobile-responsive optimizations
- Bulk import/export capabilities
- Advanced reconciliation algorithms
- Multi-currency support
- Automated tax calculations