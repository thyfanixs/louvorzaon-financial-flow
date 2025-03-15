
import { useState } from "react";
import { Plus, Pencil, Trash2, Tag, X } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionCategory, TransactionType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { mockCategories } from "@/utils/mockData";

interface CategoryManagerProps {
  categories: TransactionCategory[];
  onAddCategory?: (category: TransactionCategory) => void;
  onEditCategory?: (category: TransactionCategory) => void;
  onDeleteCategory?: (categoryId: string) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  type: z.enum(["income", "expense"]),
  icon: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CategoryManager({
  categories = mockCategories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoryManagerProps) {
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TransactionCategory | null>(null);
  const [localCategories, setLocalCategories] = useState<TransactionCategory[]>(categories);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "income",
      icon: "",
    },
  });

  const handleAddCategory = (data: FormValues) => {
    const newCategory: TransactionCategory = {
      id: `cat${Date.now()}`,
      name: data.name,
      type: data.type as TransactionType,
      icon: data.icon || "tag",
    };

    setLocalCategories([...localCategories, newCategory]);
    
    if (onAddCategory) {
      onAddCategory(newCategory);
    }
    
    toast({
      title: "Categoria criada com sucesso!",
      description: `A categoria "${data.name}" foi adicionada.`,
    });
    
    form.reset();
    setOpen(false);
  };

  const handleEditCategory = (data: FormValues) => {
    if (!editingCategory) return;

    const updatedCategory: TransactionCategory = {
      ...editingCategory,
      name: data.name,
      type: data.type as TransactionType,
      icon: data.icon || editingCategory.icon,
    };

    const updatedCategories = localCategories.map((cat) =>
      cat.id === editingCategory.id ? updatedCategory : cat
    );

    setLocalCategories(updatedCategories);
    
    if (onEditCategory) {
      onEditCategory(updatedCategory);
    }
    
    toast({
      title: "Categoria atualizada com sucesso!",
      description: `A categoria "${data.name}" foi atualizada.`,
    });
    
    form.reset();
    setEditingCategory(null);
    setOpen(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = localCategories.filter((cat) => cat.id !== categoryId);
    setLocalCategories(updatedCategories);
    
    if (onDeleteCategory) {
      onDeleteCategory(categoryId);
    }
    
    toast({
      title: "Categoria removida",
      description: "A categoria foi removida com sucesso.",
    });
  };

  const startEditing = (category: TransactionCategory) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      type: category.type,
      icon: category.icon,
    });
    setOpen(true);
  };

  const closeDialog = () => {
    form.reset();
    setEditingCategory(null);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Categorias</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Nova Categoria</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  editingCategory ? handleEditCategory : handleAddCategory
                )}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da categoria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="income">Receita</SelectItem>
                          <SelectItem value="expense">Despesa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeDialog}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingCategory ? "Atualizar" : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground mb-2">
          Receitas
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {localCategories
            .filter((cat) => cat.type === "income")
            .map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between bg-background border rounded-md p-2 gap-2 group"
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-income" />
                  <span className="text-sm">{category.name}</span>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => startEditing(category)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </div>
              </div>
            ))}
        </div>

        <div className="text-sm font-medium text-muted-foreground mb-2">
          Despesas
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {localCategories
            .filter((cat) => cat.type === "expense")
            .map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between bg-background border rounded-md p-2 gap-2 group"
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-expense" />
                  <span className="text-sm">{category.name}</span>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => startEditing(category)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
