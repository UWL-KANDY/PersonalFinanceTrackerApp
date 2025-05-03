
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingDown, Lightbulb, PieChart } from "lucide-react";

interface RecommendationItem {
  title: string;
  description: string;
  type: 'warning' | 'success' | 'info';
  icon: React.ReactNode;
}

interface MonthlyRecommendationProps {
  highestExpenseCategory: string;
  highestExpenseAmount: number;
  savingsChange: number;
  recommendedBudgetCuts: { category: string; amount: number }[];
  targetSavings: number;
}

export function MonthlyRecommendation({
  highestExpenseCategory,
  highestExpenseAmount,
  savingsChange,
  recommendedBudgetCuts,
  targetSavings
}: MonthlyRecommendationProps) {
  
  const recommendations: RecommendationItem[] = [
    {
      title: `Highest spending in ${highestExpenseCategory}`,
      description: `You spent $${highestExpenseAmount.toFixed(2)} on ${highestExpenseCategory} this month, which is your largest expense category. Consider looking for ways to reduce this expense.`,
      type: 'warning',
      icon: <AlertCircle className="h-5 w-5" />
    },
    {
      title: `${savingsChange >= 0 ? 'Improved savings' : 'Decreased savings'}`,
      description: savingsChange >= 0 
        ? `Great job! You saved ${Math.abs(savingsChange).toFixed(1)}% more than last month. Keep it up!`
        : `Your savings decreased by ${Math.abs(savingsChange).toFixed(1)}% compared to last month. Try to get back on track next month.`,
      type: savingsChange >= 0 ? 'success' : 'warning',
      icon: <TrendingDown className="h-5 w-5" />
    },
    {
      title: 'Budget reduction opportunities',
      description: `Reducing spending in ${recommendedBudgetCuts[0].category} by $${recommendedBudgetCuts[0].amount.toFixed(2)} could help you reach your savings goals faster.`,
      type: 'info',
      icon: <PieChart className="h-5 w-5" />
    },
    {
      title: 'Savings target',
      description: `Setting aside $${targetSavings.toFixed(2)} next month can help you build your emergency fund and reach your financial goals.`,
      type: 'info',
      icon: <Lightbulb className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">This Month's Financial Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((recommendation, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className={`p-1 rounded-full ${
                recommendation.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                recommendation.type === 'success' ? 'bg-green-100 text-green-600' : 
                'bg-blue-100 text-blue-600'
              }`}>
                {recommendation.icon}
              </div>
              <CardTitle className="text-base">{recommendation.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{recommendation.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Action Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <h4 className="font-medium">1. Review your {highestExpenseCategory} expenses</h4>
            <p className="text-sm text-muted-foreground">
              Look for patterns and unnecessary spending in this category to identify potential savings.
            </p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium">2. Set up category budgets</h4>
            <p className="text-sm text-muted-foreground">
              Create specific budget limits for your highest spending categories to control expenses.
            </p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium">3. Automate your savings</h4>
            <p className="text-sm text-muted-foreground">
              Set up an automatic transfer of ${targetSavings.toFixed(2)} at the beginning of each month.
            </p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium">4. Track expenses regularly</h4>
            <p className="text-sm text-muted-foreground">
              Review your transactions weekly to stay aware of your spending habits and catch issues early.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
