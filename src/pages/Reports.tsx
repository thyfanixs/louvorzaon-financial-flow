
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ReportFilters from "@/components/reports/ReportFilters";
import ChartView from "@/components/reports/ChartView";
import { ReportFilter } from "@/types";
import { mockTransactions } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

const Reports = () => {
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);

  const handleFilterChange = (filters: ReportFilter) => {
    let filtered = [...mockTransactions];

    // Filter by date range
    if (filters.dateRange.from && filters.dateRange.to) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.date >= filters.dateRange.from! &&
          transaction.date <= filters.dateRange.to!
      );
    }

    // Filter by transaction type
    if (filters.transactionType !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.type === filters.transactionType
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((transaction) =>
        filters.categories.includes(transaction.category)
      );
    }

    setFilteredTransactions(filtered);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground mt-1">
            Análise detalhada das movimentações financeiras
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => alert("Esta funcionalidade será implementada em breve!")}>
          <FileDown className="h-4 w-4" />
          <span>Exportar</span>
        </Button>
      </div>

      <ReportFilters onFilterChange={handleFilterChange} />
      
      <div className="space-y-6">
        <ChartView transactions={filteredTransactions} />
      </div>
    </DashboardLayout>
  );
};

export default Reports;
