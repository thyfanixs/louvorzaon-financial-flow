
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import CategoryManager from "@/components/transactions/CategoryManager";
import { mockTransactions, mockCategories } from "@/utils/mockData";
import { TransactionCategory } from "@/types";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [categories, setCategories] = useState<TransactionCategory[]>(mockCategories);

  const handleAddCategory = (category: TransactionCategory) => {
    setCategories([...categories, category]);
  };

  const handleEditCategory = (updatedCategory: TransactionCategory) => {
    setCategories(
      categories.map((cat) =>
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId));
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie todas as receitas e despesas do evento
        </p>
      </div>

      <Tabs 
        defaultValue="transactions" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4">
          <TransactionForm />
          <TransactionList transactions={mockTransactions} />
        </TabsContent>
        
        <TabsContent value="categories">
          <CategoryManager 
            categories={categories}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Transactions;
