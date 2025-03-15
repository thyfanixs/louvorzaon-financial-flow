
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Wallet, AlertCircle } from "lucide-react";
import { FinancialSummary } from "@/types";
import { formatCurrency } from "@/utils/mockData";
import { cn } from "@/lib/utils";

interface FinancialOverviewProps {
  summary: FinancialSummary;
}

export default function FinancialOverview({ summary }: FinancialOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="overflow-hidden transition-all hover:shadow-md border animate-scale-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Saldo Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="h-4 w-4 text-primary mr-2" strokeWidth={2.5} />
              <span className="text-2xl font-bold">
                {formatCurrency(summary.balance)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden transition-all hover:shadow-md border animate-scale-in [animation-delay:100ms]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Receitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ArrowUpRight className="h-4 w-4 text-income mr-2" strokeWidth={2.5} />
              <span className="text-2xl font-bold">
                {formatCurrency(summary.totalIncome)}
              </span>
            </div>
            <div className="text-sm font-medium text-income bg-income-light px-2 py-1 rounded">
              +{((summary.totalIncome / (summary.totalExpense || 1)) * 100).toFixed(0)}%
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden transition-all hover:shadow-md border animate-scale-in [animation-delay:200ms]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ArrowDownRight className="h-4 w-4 text-expense mr-2" strokeWidth={2.5} />
              <span className="text-2xl font-bold">
                {formatCurrency(summary.totalExpense)}
              </span>
            </div>
            <div className="text-sm font-medium text-expense bg-expense-light px-2 py-1 rounded">
              {((summary.totalExpense / summary.totalIncome) * 100).toFixed(0)}%
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={cn(
        "overflow-hidden transition-all hover:shadow-md border animate-scale-in [animation-delay:300ms]",
        summary.pendingPayments > 0 ? "border-orange-200" : ""
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pagamentos Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle 
                className={cn(
                  "h-4 w-4 mr-2", 
                  summary.pendingPayments > 0 ? "text-orange-500" : "text-muted-foreground"
                )} 
                strokeWidth={2.5} 
              />
              <span className="text-2xl font-bold">
                {formatCurrency(summary.pendingPayments)}
              </span>
            </div>
            {summary.pendingPayments > 0 && (
              <div className="text-sm font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded">
                Atenção
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
