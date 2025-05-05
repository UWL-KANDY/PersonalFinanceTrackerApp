import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";

type SavingsGoal = {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  completed: boolean;
};

export function SavingsGoalSummary() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopGoals = async () => {
      try {
        const { data, error } = await supabase
          .from('savings_goals')
          .select('*')
          .filter('completed', 'eq', false)
          .order('deadline', { ascending: true })
          .limit(3);

        if (error) throw error;
        setGoals(data as unknown as SavingsGoal[]);
      } catch (error) {
        console.error("Error fetching savings goals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopGoals();
  }, []);

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No deadline";
    
    const deadline = new Date(dateString);
    const today = new Date();
    
    // Calculate days remaining
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return "Deadline passed";
    } else if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else {
      return `${diffDays} days left`;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings Goals</CardTitle>
          <CardDescription>Your progress towards financial freedom</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings Goals</CardTitle>
          <CardDescription>Your progress towards financial freedom</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No active savings goals</p>
            <Link to="/savings" className="text-primary text-sm hover:underline mt-2 inline-block">
              Create your first goal
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Goals</CardTitle>
        <CardDescription>Your progress towards financial freedom</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex justify-between items-baseline">
              <h4 className="font-medium">{goal.name}</h4>
              <span className="text-xs text-muted-foreground">
                {formatDate(goal.deadline)}
              </span>
            </div>
            <div className="space-y-1">
              <Progress value={calculateProgress(goal.current_amount, goal.target_amount)} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${goal.current_amount.toFixed(2)}</span>
                <span>{calculateProgress(goal.current_amount, goal.target_amount).toFixed(1)}%</span>
                <span>${goal.target_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
        <div className="pt-2">
          <Link
            to="/savings"
            className="text-primary hover:underline text-sm"
          >
            View all savings goals →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
