
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AddBudgetDialog } from "@/components/dialogs/AddBudgetDialog";

type Budget = {
  id: string;
  category: string;
  amount: number;
  period: string;
};

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBudgets(data as Budget[]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch budgets",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBudgetAdded = () => {
    fetchBudgets();
    toast({
      title: "Success",
      description: "Budget added successfully",
    });
  };

  const formatPeriod = (period: string): string => {
    return period.charAt(0).toUpperCase() + period.slice(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Budgets</h1>
        <AddBudgetDialog onBudgetAdded={handleBudgetAdded} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : budgets.length > 0 ? (
                budgets.map((budget) => (
                  <TableRow key={budget.id}>
                    <TableCell className="capitalize">{budget.category}</TableCell>
                    <TableCell>{formatPeriod(budget.period)}</TableCell>
                    <TableCell className="text-right">
                      ${budget.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                    No budgets found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetsPage;
