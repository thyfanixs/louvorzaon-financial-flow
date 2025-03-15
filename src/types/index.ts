
export type TransactionType = 'income' | 'expense';

export type TransactionCategory = {
  id: string;
  name: string;
  type: TransactionType;
  icon?: string;
};

export type TransactionPaymentMethod = 
  | 'cash'
  | 'credit_card'
  | 'debit_card'
  | 'pix'
  | 'bank_transfer'
  | 'other';

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  date: Date;
  type: TransactionType;
  category: string;
  paymentMethod: TransactionPaymentMethod;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FinancialSummary = {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  pendingPayments: number;
};

export type ChartDataPoint = {
  date: string;
  income: number;
  expense: number;
};

export type UserRole = 'admin' | 'organizer' | 'finance' | 'sponsor';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export type ReportFilter = {
  dateRange: DateRange;
  categories: string[];
  transactionType: TransactionType | 'all';
};
