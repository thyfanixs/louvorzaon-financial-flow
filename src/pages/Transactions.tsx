
import DashboardLayout from "@/components/layout/DashboardLayout";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import { mockTransactions } from "@/utils/mockData";

const Transactions = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie todas as receitas e despesas do evento
        </p>
      </div>

      <TransactionForm />
      <TransactionList transactions={mockTransactions} />
    </DashboardLayout>
  );
};

export default Transactions;
