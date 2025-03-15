
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { mockCategories } from "@/utils/mockData";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  amount: z.string().min(1, {
    message: "O valor é obrigatório.",
  }),
  description: z.string().min(3, {
    message: "A descrição deve ter pelo menos 3 caracteres.",
  }),
  date: z.date({
    required_error: "A data é obrigatória.",
  }),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, {
    message: "A categoria é obrigatória.",
  }),
  paymentMethod: z.string().min(1, {
    message: "O método de pagamento é obrigatório.",
  }),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function TransactionForm() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
      type: "income",
      note: "",
    },
  });

  function onSubmit(data: FormValues) {
    // In a real app, we would save this to the database
    console.log("Form data:", data);
    
    toast({
      title: "Transação registrada com sucesso!",
      description: `${data.type === "income" ? "Receita" : "Despesa"} de R$ ${data.amount} adicionada.`,
    });
    
    form.reset();
    setIsOpen(false);
  }

  return (
    <div>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="space-x-2 mb-6" 
        size="sm"
      >
        <Plus className="h-4 w-4" />
        <span>Nova Transação</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto overflow-hidden animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Nova Transação</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  &times;
                </Button>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
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

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor (R$)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0,00"
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Descreva a transação"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockCategories
                              .filter(
                                (category) =>
                                  category.type === form.watch("type")
                              )
                              .map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de Pagamento</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o método" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash">Dinheiro</SelectItem>
                            <SelectItem value="credit_card">
                              Cartão de Crédito
                            </SelectItem>
                            <SelectItem value="debit_card">
                              Cartão de Débito
                            </SelectItem>
                            <SelectItem value="pix">PIX</SelectItem>
                            <SelectItem value="bank_transfer">
                              Transferência Bancária
                            </SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações (opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Adicione informações adicionais"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar</Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
