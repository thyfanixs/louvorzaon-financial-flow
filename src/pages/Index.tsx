
import DashboardLayout from "@/components/layout/DashboardLayout";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import TransactionChart from "@/components/dashboard/TransactionChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { mockFinancialSummary, mockTransactions, mockChartData } from "@/utils/mockData";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do fluxo de caixa do evento Louvorzão
        </p>
      </div>

      <div className="space-y-8">
        <FinancialOverview summary={mockFinancialSummary} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TransactionChart data={mockChartData} />
          <RecentTransactions transactions={mockTransactions} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
