
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Transaction, TransactionCategory } from "@/types";
import { mockCategories, formatCurrency } from "@/utils/mockData";

interface ChartViewProps {
  transactions: Transaction[];
}

type ChartType = "income" | "expense" | "comparison";
type ViewType = "pie" | "bar";

export default function ChartView({ transactions }: ChartViewProps) {
  const [chartType, setChartType] = useState<ChartType>("comparison");
  const [viewType, setViewType] = useState<ViewType>("bar");

  const filterTransactionsByType = (type: "income" | "expense") => {
    return transactions.filter((t) => t.type === type);
  };

  const getCategoryTotals = (transactionType: "income" | "expense") => {
    const filteredTransactions = filterTransactionsByType(transactionType);
    const categoryTotals: Record<string, number> = {};

    filteredTransactions.forEach((transaction) => {
      const { category, amount } = transaction;
      if (categoryTotals[category]) {
        categoryTotals[category] += amount;
      } else {
        categoryTotals[category] = amount;
      }
    });

    return Object.keys(categoryTotals).map((categoryId) => {
      const category = mockCategories.find((c) => c.id === categoryId);
      return {
        name: category?.name || "Desconhecido",
        value: categoryTotals[categoryId],
        id: categoryId,
      };
    });
  };

  const getComparisonData = () => {
    const incomeCategoryTotals = getCategoryTotals("income");
    const expenseCategoryTotals = getCategoryTotals("expense");

    return {
      income: incomeCategoryTotals,
      expense: expenseCategoryTotals,
    };
  };

  const incomeCategoryData = getCategoryTotals("income");
  const expenseCategoryData = getCategoryTotals("expense");
  const comparisonData = getComparisonData();

  const totalIncome = incomeCategoryData.reduce((sum, item) => sum + item.value, 0);
  const totalExpense = expenseCategoryData.reduce((sum, item) => sum + item.value, 0);

  // Colors for charts
  const incomeColors = ["#34D399", "#10B981", "#059669", "#047857", "#065F46", "#064E3B"];
  const expenseColors = ["#F87171", "#EF4444", "#DC2626", "#B91C1C", "#991B1B", "#7F1D1D"];

  const getChartTitle = () => {
    switch (chartType) {
      case "income":
        return "Distribuição de Receitas";
      case "expense":
        return "Distribuição de Despesas";
      case "comparison":
        return "Comparação entre Receitas e Despesas";
    }
  };

  const formatCategoryData = (data: { name: string; value: number; id: string }[]) => {
    return data
      .sort((a, b) => b.value - a.value)
      .map((item, index) => ({
        ...item,
        color: chartType === "income" ? incomeColors[index % incomeColors.length] : expenseColors[index % expenseColors.length],
      }));
  };

  const formattedIncomeData = formatCategoryData(incomeCategoryData);
  const formattedExpenseData = formatCategoryData(expenseCategoryData);

  const prepareComparisonBarData = () => {
    const data: { name: string; income: number; expense: number }[] = [];
    
    // Add all categories from both income and expense
    const allCategoryIds = new Set<string>();
    incomeCategoryData.forEach((item) => allCategoryIds.add(item.id));
    expenseCategoryData.forEach((item) => allCategoryIds.add(item.id));
    
    // For each unique category, find its income and expense values
    Array.from(allCategoryIds).forEach((categoryId) => {
      const categoryName = mockCategories.find((c) => c.id === categoryId)?.name || "Desconhecido";
      const incomeItem = incomeCategoryData.find((item) => item.id === categoryId);
      const expenseItem = expenseCategoryData.find((item) => item.id === categoryId);
      
      data.push({
        name: categoryName,
        income: incomeItem?.value || 0,
        expense: expenseItem?.value || 0,
      });
    });
    
    return data.sort((a, b) => (b.income + b.expense) - (a.income + a.expense));
  };

  const comparisonBarData = prepareComparisonBarData();

  // Custom tooltip component for pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-md shadow-md border text-sm">
          <p className="font-medium">{data.name}</p>
          <p>{formatCurrency(data.value)}</p>
          <p className="text-xs text-muted-foreground">
            {((data.value / (chartType === "income" ? totalIncome : totalExpense)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // For comparison bar chart
  const ComparisonTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-md shadow-md border text-sm">
          <p className="font-medium">{payload[0].payload.name}</p>
          <div className="flex items-center text-income mt-1">
            <span className="w-2 h-2 bg-income rounded-full mr-1"></span>
            <span>Receita: {formatCurrency(payload[0].payload.income)}</span>
          </div>
          <div className="flex items-center text-expense mt-1">
            <span className="w-2 h-2 bg-expense rounded-full mr-1"></span>
            <span>Despesa: {formatCurrency(payload[0].payload.expense)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4 pb-2">
        <div>
          <CardTitle>{getChartTitle()}</CardTitle>
          <CardDescription>
            {chartType === "comparison" ? (
              <span>Total: Receitas {formatCurrency(totalIncome)} | Despesas {formatCurrency(totalExpense)}</span>
            ) : (
              <span>Total: {formatCurrency(chartType === "income" ? totalIncome : totalExpense)}</span>
            )}
          </CardDescription>
        </div>

        <div className="flex space-x-2">
          <Tabs defaultValue="comparison" className="w-[300px]" onValueChange={(v) => setChartType(v as ChartType)}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="comparison">Comparação</TabsTrigger>
              <TabsTrigger value="income">Receitas</TabsTrigger>
              <TabsTrigger value="expense">Despesas</TabsTrigger>
            </TabsList>
          </Tabs>

          {chartType !== "comparison" && (
            <Tabs defaultValue="bar" onValueChange={(v) => setViewType(v as ViewType)}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="bar">Barras</TabsTrigger>
                <TabsTrigger value="pie">Pizza</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-1 sm:p-6">
        <div className="h-[400px] w-full">
          {/* Comparison Chart (always bar) */}
          {chartType === "comparison" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonBarData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  angle={-45}
                  textAnchor="end"
                  tickMargin={10}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} 
                />
                <Tooltip content={<ComparisonTooltip />} />
                <Legend />
                <Bar dataKey="income" name="Receitas" fill="#34D399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Despesas" fill="#F87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* Income or Expense Chart */}
          {chartType !== "comparison" && viewType === "bar" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartType === "income" ? formattedIncomeData : formattedExpenseData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  angle={-45}
                  textAnchor="end"
                  tickMargin={10}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  name={chartType === "income" ? "Receita" : "Despesa"}
                  fill={chartType === "income" ? "#34D399" : "#F87171"}
                  radius={[4, 4, 0, 0]}
                >
                  {(chartType === "income" ? formattedIncomeData : formattedExpenseData).map(
                    (entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {chartType !== "comparison" && viewType === "pie" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartType === "income" ? formattedIncomeData : formattedExpenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {(chartType === "income" ? formattedIncomeData : formattedExpenseData).map(
                    (entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    )
                  )}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
