
import React, { useState, useEffect } from "react";
import { MonthlyRecommendation } from "@/components/reports/MonthlyRecommendation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ReportsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState({
    highestExpenseCategory: "",
    highestExpenseAmount: 0,
    savingsChange: 0,
    recommendedBudgetCuts: [{ category: "", amount: 0 }],
    targetSavings: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      // Get current and last month's date ranges
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
      
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

      // Fetch current month's transactions
      const { data: currentMonthData, error: currentMonthError } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', currentMonthStart)
        .lte('date', currentMonthEnd);

      if (currentMonthError) throw currentMonthError;

      // Fetch last month's transactions
      const { data: lastMonthData, error: lastMonthError } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', lastMonthStart)
        .lte('date', lastMonthEnd);

      if (lastMonthError) throw lastMonthError;

      // Fetch budgets
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('budgets')
        .select('*');

      if (budgetsError) throw budgetsError;

      // Calculate highest expense category
      const expensesByCategory = {};
      currentMonthData
        .filter(transaction => transaction.type === 'expense')
        .forEach(transaction => {
          expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + Number(transaction.amount);
        });

      const highestExpenseCategory = Object.keys(expensesByCategory).reduce(
        (a, b) => expensesByCategory[a] > expensesByCategory[b] ? a : b, ""
      );
      
      const highestExpenseAmount = expensesByCategory[highestExpenseCategory] || 0;

      // Calculate savings change
      const currentMonthIncome = currentMonthData
        .filter(transaction => transaction.type === 'income')
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
      
      const currentMonthExpenses = currentMonthData
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
      
      const lastMonthIncome = lastMonthData
        .filter(transaction => transaction.type === 'income')
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
      
      const lastMonthExpenses = lastMonthData
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
      
      const currentSavingsRate = currentMonthIncome > 0 ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100 : 0;
      const lastSavingsRate = lastMonthIncome > 0 ? ((lastMonthIncome - lastMonthExpenses) / lastMonthIncome) * 100 : 0;
      const savingsChange = currentSavingsRate - lastSavingsRate;

      // Find budget categories that are over or close to limit
      const recommendedBudgetCuts = [];
      
      if (budgetsData && budgetsData.length > 0) {
        budgetsData.forEach(budget => {
          const categorySpent = expensesByCategory[budget.category] || 0;
          if (categorySpent > Number(budget.amount) * 0.9) {
            recommendedBudgetCuts.push({
              category: budget.category,
              amount: Math.max(categorySpent - Number(budget.amount), 0)
            });
          }
        });
      }
      
      // If no budget overruns, suggest cuts for highest expense
      if (recommendedBudgetCuts.length === 0 && highestExpenseCategory) {
        recommendedBudgetCuts.push({
          category: highestExpenseCategory,
          amount: highestExpenseAmount * 0.1 // Suggest 10% reduction
        });
      }

      // Calculate target savings (15% of income or current income - expenses + 10%, whichever is lower)
      const targetSavings = currentMonthIncome > 0
        ? Math.min(
            currentMonthIncome * 0.15,
            (currentMonthIncome - currentMonthExpenses) * 1.1
          )
        : 500; // Default value if no income data

      setReportData({
        highestExpenseCategory: highestExpenseCategory || "No Data",
        highestExpenseAmount,
        savingsChange,
        recommendedBudgetCuts: recommendedBudgetCuts.length > 0 
          ? recommendedBudgetCuts 
          : [{ category: "entertainment", amount: 50 }], // Default if no recommendations
        targetSavings
      });
      
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast({
        title: "Error",
        description: "Failed to load report data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Monthly Recommendations</h1>
      <p className="text-muted-foreground">
        Personalized financial insights and recommendations to help you save money and achieve your financial goals.
      </p>
      
      <MonthlyRecommendation {...reportData} />
    </div>
  );
};

export default ReportsPage;
