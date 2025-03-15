
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, TransactionCategory } from "@/types";
import { getCategoryById, formatCurrency } from "@/utils/mockData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  ArrowUpRight, 
  ArrowDownRight,
  CreditCard,
  Wallet,
  Banknote,
  Smartphone,
  Building,
  MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const sortedTransactions = [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-4 w-4" />;
      case "debit_card":
        return <CreditCard className="h-4 w-4" />;
      case "cash":
        return <Banknote className="h-4 w-4" />;
      case "pix":
        return <Smartphone className="h-4 w-4" />;
      case "bank_transfer":
        return <Building className="h-4 w-4" />;
      default:
        return <MoreHorizontal className="h-4 w-4" />;
    }
  };

  return (
    <Card className="col-span-1 overflow-hidden border transition-all hover:shadow-md animate-fade-in" style={{ animationDelay: '200ms' }}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transações Recentes</CardTitle>
        <Link to="/transactions">
          <Button variant="ghost" size="sm">
            Ver todas
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {sortedTransactions.map((transaction) => {
            const category = getCategoryById(transaction.category);
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      transaction.type === "income"
                        ? "bg-income-light text-income"
                        : "bg-expense-light text-expense"
                    )}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarDays className="mr-1 h-3 w-3" />
                      {format(transaction.date, "dd/MM/yyyy")}
                      
                      <Badge 
                        variant="outline" 
                        className="ml-2 text-xs"
                      >
                        {category?.name}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={cn(
                      "font-medium",
                      transaction.type === "income"
                        ? "text-income"
                        : "text-expense"
                    )}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {getPaymentMethodIcon(transaction.paymentMethod)}
                    <span className="ml-1 capitalize">
                      {transaction.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
