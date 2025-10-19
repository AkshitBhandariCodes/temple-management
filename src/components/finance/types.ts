export interface Donation {
  id: string;
  receiptNumber: string;
  transactionId: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  grossAmount: number;
  providerFees: number;
  netAmount: number;
  currency: string;
  source: 'web' | 'hundi' | 'in-temple' | 'bank-transfer';
  provider: 'stripe' | 'razorpay' | 'manual';
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  receivedDate: string;
  reconciled: boolean;
  communityId?: string;
  eventId?: string;
  pujaId?: string;
  notes?: string;
}

export interface Expense {
  id: string;
  description: string;
  vendorName: string;
  receiptNumber: string;
  amount: number;
  currency: string;
  category: 'maintenance' | 'utilities' | 'salaries' | 'materials' | 'events' | 'other';
  communityId?: string;
  eventId?: string;
  budgetId?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: string;
  expenseDate: string;
  entryDate: string;
  receiptAttached: boolean;
  notes?: string;
}

export interface BudgetRequest {
  id: string;
  title: string;
  purpose: string;
  requestedAmount: number;
  approvedAmount?: number;
  currency: string;
  communityId: string;
  eventId?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submissionDate: string;
  decisionDate?: string;
  financeNotes?: string;
  lineItems: BudgetLineItem[];
  attachments: string[];
}

export interface BudgetLineItem {
  id: string;
  description: string;
  amount: number;
  category: string;
}

export interface FinancialSummary {
  totalDonations: number;
  totalExpenses: number;
  netIncome: number;
  donationsBySource: Record<string, number>;
  expensesByCategory: Record<string, number>;
  monthlyTrend: Array<{
    month: string;
    donations: number;
    expenses: number;
  }>;
}

export interface ReconciliationItem {
  id: string;
  transactionId: string;
  providerReference: string;
  amount: number;
  date: string;
  status: 'matched' | 'unmatched' | 'exception';
  matchedWith?: string;
  exceptionReason?: string;
}