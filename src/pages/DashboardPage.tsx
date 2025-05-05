import React, { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionChart } from "@/components/dashboard/TransactionChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SavingsGoalSummary } from "@/components/dashboard/SavingsGoalSummary";
import { Wallet, ArrowUpRight, ArrowDownRight, Banknote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [financialSummary, setFinancialSummary] = useState({
    currentMonthIncome: 0,
    currentMonthExpenses: 0,
    balance: 0,
    savingsRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch recent transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .limit(5);

      if (transactionsError) throw transactionsError;

      // Format transactions for the component
      const formattedTransactions = transactionsData.map(transaction => ({
        id: transaction.id,
        name: transaction.name,
        date: formatDate(transaction.date),
        amount: transaction.amount,
        type: transaction.type as "income" | "expense",
        category: transaction.category as any // Cast to expected category type
      }));
      
      setTransactions(formattedTransactions);

      // Calculate financial summary for the current month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

      // Fetch current month transactions
      const { data: monthlyData, error: monthlyError } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', firstDayOfMonth)
        .lte('date', lastDayOfMonth);

      if (monthlyError) throw monthlyError;

      // Calculate income and expenses
      const currentMonthIncome = monthlyData
        .filter(transaction => transaction.type === 'income')
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
      
      const currentMonthExpenses = monthlyData
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
      
      const balance = currentMonthIncome - currentMonthExpenses;
      const savingsRate = currentMonthIncome > 0 ? (balance / currentMonthIncome) * 100 : 0;

      setFinancialSummary({
        currentMonthIncome,
        currentMonthExpenses,
        balance,
        savingsRate
      });

      // Generate chart data for the last 6 months
      const chartData = await generateChartData();
      setChartData(chartData);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate chart data for the last 6 months
  const generateChartData = async () => {
    try {
      const months = [];
      const now = new Date();
      
      // Get data for the last 6 months
      for (let i = 5; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = month.toLocaleString('default', { month: 'short' });
        const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).toISOString();
        const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString();

        // Fetch data for this month
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .gte('date', firstDay)
          .lte('date', lastDay);

        if (error) throw error;

        // Calculate income and expenses
        const income = data
          .filter(transaction => transaction.type === 'income')
          .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
        
        const expenses = data
          .filter(transaction => transaction.type === 'expense')
          .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

        months.push({
          date: monthName,
          income,
          expenses
        });
      }
      
      return months;
    } catch (error) {
      console.error("Error generating chart data:", error);
      return [];
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
      <h1 className="text-3xl font-bold">Financial Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Balance"
          value={`$${financialSummary.balance.toFixed(2)}`}
          variant="balance"
          icon={<Wallet className="h-5 w-5" />}
          trend={{ value: 12, isPositive: financialSummary.balance > 0 }}
        />
        <StatCard
          title="Monthly Income"
          value={`$${financialSummary.currentMonthIncome.toFixed(2)}`}
          variant="income"
          icon={<ArrowUpRight className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Monthly Expenses"
          value={`$${financialSummary.currentMonthExpenses.toFixed(2)}`}
          variant="expense"
          icon={<ArrowDownRight className="h-5 w-5" />}
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Savings Rate"
          value={`${financialSummary.savingsRate.toFixed(1)}%`}
          icon={<Banknote className="h-5 w-5" />}
          description="of your income"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionChart data={chartData} />
        </div>
        <div>
          <SavingsGoalSummary />
        </div>
      </div>

      <div>
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
};

export default DashboardPage;
