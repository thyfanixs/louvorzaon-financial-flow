
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ReportFilters from "@/components/reports/ReportFilters";
import ChartView from "@/components/reports/ChartView";
import { ReportFilter } from "@/types";
import { mockTransactions, formatCurrency } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const Reports = () => {
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);
  const { toast } = useToast();

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

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Aplique filtros que retornem resultados para exportar",
        variant: "destructive",
      });
      return;
    }

    // Prepare CSV header
    const headers = [
      "Data",
      "Descrição",
      "Categoria",
      "Tipo",
      "Método de Pagamento",
      "Valor",
      "Observação"
    ].join(",");

    // Prepare CSV data rows
    const csvData = filteredTransactions.map(transaction => {
      const formattedDate = format(transaction.date, "dd/MM/yyyy");
      const transactionType = transaction.type === "income" ? "Receita" : "Despesa";
      
      // Format payment method for better readability
      let paymentMethod = "";
      switch (transaction.paymentMethod) {
        case "cash": paymentMethod = "Dinheiro"; break;
        case "credit_card": paymentMethod = "Cartão de Crédito"; break;
        case "debit_card": paymentMethod = "Cartão de Débito"; break;
        case "pix": paymentMethod = "PIX"; break;
        case "bank_transfer": paymentMethod = "Transferência Bancária"; break;
        default: paymentMethod = "Outro"; break;
      }

      // Sanitize string values to avoid breaking CSV format
      const sanitize = (str: string) => `"${str.replace(/"/g, '""')}"`;
      
      return [
        formattedDate,
        sanitize(transaction.description),
        sanitize(transaction.category),
        transactionType,
        paymentMethod,
        transaction.amount.toString().replace('.', ','),
        transaction.note ? sanitize(transaction.note) : ""
      ].join(",");
    }).join("\n");

    // Combine header and data
    const csvContent = `${headers}\n${csvData}`;
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    // Prepare filename with current date
    const filename = `relatorio-financeiro-${format(new Date(), "dd-MM-yyyy")}.csv`;
    
    // Configure and trigger download
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    toast({
      title: "Exportação concluída",
      description: `Relatório exportado como ${filename}`,
    });
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
        <Button className="flex items-center gap-2" onClick={exportToCSV}>
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
