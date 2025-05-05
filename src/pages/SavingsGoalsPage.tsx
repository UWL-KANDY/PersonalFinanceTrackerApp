
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddSavingsGoalDialog } from "@/components/dialogs/AddSavingsGoalDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { UpdateSavingsGoalDialog } from "@/components/dialogs/UpdateSavingsGoalDialog";

type SavingsGoal = {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  completed: boolean;
};

const SavingsGoalsPage = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data as SavingsGoal[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch savings goals",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleUpdateGoal = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setIsUpdateDialogOpen(true);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No deadline";
    return new Date(dateString).toLocaleDateString();
  };

  const markGoalAsCompleted = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('savings_goals')
        .update({ completed: true })
        .eq('id', goalId);

      if (error) throw error;

      // Update the local state
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal.id === goalId ? { ...goal, completed: true } : goal
        )
      );

      toast({
        title: "Goal Completed! 🎉",
        description: "Congratulations on achieving your savings goal!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update goal",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Savings Goals</h1>
        <AddSavingsGoalDialog onSavingsGoalAdded={fetchGoals} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Savings Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Goal</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Target Amount</TableHead>
                <TableHead>Current Amount</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : goals.length > 0 ? (
                goals.map((goal) => (
                  <TableRow key={goal.id}>
                    <TableCell className="font-medium">{goal.name}</TableCell>
                    <TableCell className="w-[200px]">
                      <div className="space-y-1">
                        <Progress value={calculateProgress(goal.current_amount, goal.target_amount)} />
                        <p className="text-xs text-muted-foreground">
                          {calculateProgress(goal.current_amount, goal.target_amount).toFixed(1)}%
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>${goal.target_amount.toFixed(2)}</TableCell>
                    <TableCell>${goal.current_amount.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(goal.deadline)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        goal.completed 
                          ? "bg-green-100 text-green-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {goal.completed ? "Completed" : "In Progress"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdateGoal(goal)}
                          disabled={goal.completed}
                        >
                          Update
                        </Button>
                        {!goal.completed && calculateProgress(goal.current_amount, goal.target_amount) >= 100 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => markGoalAsCompleted(goal.id)}
                          >
                            <Trophy className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No savings goals found. Add your first goal to start tracking!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedGoal && (
        <UpdateSavingsGoalDialog
          goal={selectedGoal}
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          onGoalUpdated={fetchGoals}
        />
      )}
    </div>
  );
}

export default SavingsGoalsPage;
