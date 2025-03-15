
import { Transaction, TransactionCategory, FinancialSummary, ChartDataPoint } from "@/types";

export const mockCategories: TransactionCategory[] = [
  { id: "cat1", name: "Ingressos", type: "income", icon: "ticket" },
  { id: "cat2", name: "Patrocínios", type: "income", icon: "briefcase" },
  { id: "cat3", name: "Doações", type: "income", icon: "heart" },
  { id: "cat4", name: "Merchandise", type: "income", icon: "shirt" },
  { id: "cat5", name: "Alimentação", type: "expense", icon: "utensils" },
  { id: "cat6", name: "Local do Evento", type: "expense", icon: "building" },
  { id: "cat7", name: "Equipamento de Som", type: "expense", icon: "speaker" },
  { id: "cat8", name: "Marketing", type: "expense", icon: "megaphone" },
  { id: "cat9", name: "Bandas", type: "expense", icon: "music" },
  { id: "cat10", name: "Outros", type: "expense", icon: "more-horizontal" },
];

export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    amount: 25000,
    description: "Venda de ingressos antecipados",
    date: new Date(2023, 10, 15),
    type: "income",
    category: "cat1",
    paymentMethod: "pix",
    createdAt: new Date(2023, 10, 15),
    updatedAt: new Date(2023, 10, 15),
  },
  {
    id: "t2",
    amount: 15000,
    description: "Patrocínio - Empresa de Som",
    date: new Date(2023, 10, 20),
    type: "income",
    category: "cat2",
    paymentMethod: "bank_transfer",
    createdAt: new Date(2023, 10, 20),
    updatedAt: new Date(2023, 10, 20),
  },
  {
    id: "t3",
    amount: 5000,
    description: "Doações online",
    date: new Date(2023, 10, 25),
    type: "income",
    category: "cat3",
    paymentMethod: "pix",
    createdAt: new Date(2023, 10, 25),
    updatedAt: new Date(2023, 10, 25),
  },
  {
    id: "t4",
    amount: 12000,
    description: "Aluguel do local do evento",
    date: new Date(2023, 10, 1),
    type: "expense",
    category: "cat6",
    paymentMethod: "bank_transfer",
    createdAt: new Date(2023, 10, 1),
    updatedAt: new Date(2023, 10, 1),
  },
  {
    id: "t5",
    amount: 8000,
    description: "Equipamento de som",
    date: new Date(2023, 10, 5),
    type: "expense",
    category: "cat7",
    paymentMethod: "credit_card",
    createdAt: new Date(2023, 10, 5),
    updatedAt: new Date(2023, 10, 5),
  },
  {
    id: "t6",
    amount: 5000,
    description: "Despesas com marketing",
    date: new Date(2023, 10, 10),
    type: "expense",
    category: "cat8",
    paymentMethod: "credit_card",
    createdAt: new Date(2023, 10, 10),
    updatedAt: new Date(2023, 10, 10),
  },
  {
    id: "t7",
    amount: 10000,
    description: "Cachê das bandas",
    date: new Date(2023, 10, 27),
    type: "expense",
    category: "cat9",
    paymentMethod: "bank_transfer",
    createdAt: new Date(2023, 10, 27),
    updatedAt: new Date(2023, 10, 27),
  },
  {
    id: "t8",
    amount: 3000,
    description: "Venda de mercadorias",
    date: new Date(2023, 10, 28),
    type: "income",
    category: "cat4",
    paymentMethod: "cash",
    createdAt: new Date(2023, 10, 28),
    updatedAt: new Date(2023, 10, 28),
  },
  {
    id: "t9",
    amount: 2000,
    description: "Alimentação para equipe",
    date: new Date(2023, 10, 28),
    type: "expense",
    category: "cat5",
    paymentMethod: "debit_card",
    createdAt: new Date(2023, 10, 28),
    updatedAt: new Date(2023, 10, 28),
  },
];

export const mockFinancialSummary: FinancialSummary = {
  balance: 18000,
  totalIncome: 48000,
  totalExpense: 30000,
  pendingPayments: 5000,
};

export const mockChartData: ChartDataPoint[] = [
  { date: "01/10", income: 0, expense: 12000 },
  { date: "05/10", income: 0, expense: 8000 },
  { date: "10/10", income: 0, expense: 5000 },
  { date: "15/10", income: 25000, expense: 0 },
  { date: "20/10", income: 15000, expense: 0 },
  { date: "25/10", income: 5000, expense: 0 },
  { date: "27/10", income: 0, expense: 10000 },
  { date: "28/10", income: 3000, expense: 2000 },
];

export const getCategoryById = (id: string): TransactionCategory | undefined => {
  return mockCategories.find((category) => category.id === id);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const getTransactionsByCategory = (categoryId: string): Transaction[] => {
  return mockTransactions.filter((transaction) => transaction.category === categoryId);
};

export const getTransactionsByType = (type: string): Transaction[] => {
  return mockTransactions.filter((transaction) => transaction.type === type);
};

export const getTransactionsByDateRange = (startDate: Date, endDate: Date): Transaction[] => {
  return mockTransactions.filter(
    (transaction) => transaction.date >= startDate && transaction.date <= endDate
  );
};

export const calculateBalance = (): number => {
  const totalIncome = mockTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const totalExpense = mockTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  return totalIncome - totalExpense;
};
