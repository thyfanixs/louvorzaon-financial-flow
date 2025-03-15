
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Search, ArrowUpDown, MoreHorizontal, FileDown } from "lucide-react";
import { Transaction, TransactionType } from "@/types";
import { formatCurrency, getCategoryById } from "@/utils/mockData";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortBy, setSortBy] = useState<keyof Transaction>("date");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTypeFilter = (value: string) => {
    setFilterType(value as TransactionType | "all");
  };

  const handleSort = (column: keyof Transaction) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    // Apply type filter
    if (filterType !== "all" && transaction.type !== filterType) {
      return false;
    }

    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(searchLower) ||
        getCategoryById(transaction.category)?.name.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "date" || sortBy === "createdAt" || sortBy === "updatedAt") {
      return sortOrder === "asc"
        ? a[sortBy].getTime() - b[sortBy].getTime()
        : b[sortBy].getTime() - a[sortBy].getTime();
    } else if (sortBy === "amount") {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    } else {
      const valueA = String(a[sortBy]).toLowerCase();
      const valueB = String(b[sortBy]).toLowerCase();
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transações..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex space-x-2">
          <Select defaultValue="all" onValueChange={handleTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" title="Exportar">
            <FileDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium"
                  onClick={() => handleSort("date")}
                >
                  Data
                  {sortBy === "date" && (
                    <ArrowUpDown
                      className={cn(
                        "ml-2 h-3 w-3",
                        sortOrder === "asc" ? "rotate-180" : ""
                      )}
                    />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium"
                  onClick={() => handleSort("description")}
                >
                  Descrição
                  {sortBy === "description" && (
                    <ArrowUpDown
                      className={cn(
                        "ml-2 h-3 w-3",
                        sortOrder === "asc" ? "rotate-180" : ""
                      )}
                    />
                  )}
                </Button>
              </TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium"
                  onClick={() => handleSort("amount")}
                >
                  Valor
                  {sortBy === "amount" && (
                    <ArrowUpDown
                      className={cn(
                        "ml-2 h-3 w-3",
                        sortOrder === "asc" ? "rotate-180" : ""
                      )}
                    />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma transação encontrada
                </TableCell>
              </TableRow>
            ) : (
              sortedTransactions.map((transaction) => {
                const category = getCategoryById(transaction.category);
                return (
                  <TableRow key={transaction.id} className="group">
                    <TableCell className="w-40">
                      {format(transaction.date, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      {category && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "bg-opacity-20",
                            transaction.type === "income"
                              ? "border-income/40 bg-income/10 text-income"
                              : "border-expense/40 bg-expense/10 text-expense"
                          )}
                        >
                          {category.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-medium",
                        transaction.type === "income"
                          ? "text-income"
                          : "text-expense"
                      )}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
