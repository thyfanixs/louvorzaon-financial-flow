
import { useState } from "react";
import { DateRange, ReportFilter, TransactionCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockCategories } from "@/utils/mockData";

interface ReportFiltersProps {
  onFilterChange: (filters: ReportFilter) => void;
}

export default function ReportFilters({ onFilterChange }: ReportFiltersProps) {
  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [transactionType, setTransactionType] = useState<"income" | "expense" | "all">("all");

  const handleDateChange = (newDate: DateRange) => {
    setDate(newDate);
    onFilterChange({
      dateRange: newDate,
      categories: selectedCategories,
      transactionType,
    });
  };

  const toggleCategory = (categoryId: string) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(updatedCategories);
    onFilterChange({
      dateRange: date,
      categories: updatedCategories,
      transactionType,
    });
  };

  const handleTypeChange = (value: string) => {
    setTransactionType(value as "income" | "expense" | "all");
    onFilterChange({
      dateRange: date,
      categories: selectedCategories,
      transactionType: value as "income" | "expense" | "all",
    });
  };

  const clearFilters = () => {
    setDate({
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    });
    setSelectedCategories([]);
    setTransactionType("all");
    onFilterChange({
      dateRange: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
      categories: [],
      transactionType: "all",
    });
  };

  const getCategoriesByType = (): TransactionCategory[] => {
    if (transactionType !== "all") {
      return mockCategories.filter((category) => category.type === transactionType);
    }
    return mockCategories;
  };

  const filteredCategories = getCategoriesByType();

  return (
    <div className="bg-white rounded-lg border p-4 mb-6 animate-fade-in">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <span className="text-sm font-medium text-muted-foreground mb-2 block">
            Período
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-auto min-w-[240px]",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd/MM/yyyy")} -{" "}
                      {format(date.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(date.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Selecione um período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateChange}
                numberOfMonths={2}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <span className="text-sm font-medium text-muted-foreground mb-2 block">
            Tipo
          </span>
          <Select value={transactionType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <span className="text-sm font-medium text-muted-foreground mb-2 block">
            Categorias
          </span>
          <div className="flex flex-wrap gap-2">
            {filteredCategories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all hover:opacity-80",
                  selectedCategories.includes(category.id)
                    ? category.type === "income"
                      ? "bg-income text-white hover:bg-income/90"
                      : "bg-expense text-white hover:bg-expense/90"
                    : ""
                )}
                onClick={() => toggleCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="ml-auto self-end">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" /> Limpar filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
