import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/contexts/SessionContext";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Database } from "@/integrations/supabase/types";

interface AddSavingsGoalDialogProps {
  onSavingsGoalAdded?: () => void;
}

const savingsGoalFormSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  targetAmount: z.number().min(0.01, "Target amount must be greater than 0"),
  deadline: z.string().optional(),
});

type SavingsGoalFormValues = z.infer<typeof savingsGoalFormSchema>;

export function AddSavingsGoalDialog({ onSavingsGoalAdded }: AddSavingsGoalDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const { user } = useSession();
  
  const form = useForm<SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalFormSchema),
    defaultValues: {
      name: "",
      targetAmount: 0,
      deadline: "",
    },
  });

  const onSubmit = async (data: SavingsGoalFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a savings goal",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const goalData = {
        name: data.name,
        target_amount: data.targetAmount,
        deadline: data.deadline || null,
        user_id: user.id,
      };

      const { error } = await supabase
        .from("savings_goals")
        .insert(goalData as any);

      if (error) throw error;
      
      setOpen(false);
      form.reset();
      
      toast({
        title: "Success",
        description: "Savings goal added successfully",
      });
      
      if (onSavingsGoalAdded) {
        onSavingsGoalAdded();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add savings goal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="sm:ml-auto flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Savings Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Savings Goal</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., New Car" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Adding...
                  </>
                ) : "Add Goal"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
