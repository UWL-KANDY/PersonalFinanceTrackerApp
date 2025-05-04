import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Database } from "@/integrations/supabase/types";

type SavingsGoal = {
    id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline: string | null;
    completed: boolean;
};

interface UpdateSavingsGoalDialogProps {
    goal: SavingsGoal;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onGoalUpdated?: () => void;
}

const updateSavingsGoalFormSchema = z.object({
    currentAmount: z
        .number()
        .min(0, "Amount must be at least 0")
        .optional(),
    targetAmount: z
        .number()
        .min(0.01, "Target amount must be greater than 0")
        .optional(),
    deadline: z.string().optional(),
});

type UpdateSavingsGoalFormValues = z.infer<typeof updateSavingsGoalFormSchema>;

export function UpdateSavingsGoalDialog({
    goal,
    open,
    onOpenChange,
    onGoalUpdated
}: UpdateSavingsGoalDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { toast } = useToast();

    const form = useForm<UpdateSavingsGoalFormValues>({
        resolver: zodResolver(updateSavingsGoalFormSchema),
        defaultValues: {
            currentAmount: goal.current_amount,
            targetAmount: goal.target_amount,
            deadline: goal.deadline ? new Date(goal.deadline).toISOString().split("T")[0] : "",
        },
    });

    React.useEffect(() => {
        if (open) {
            form.reset({
                currentAmount: goal.current_amount,
                targetAmount: goal.target_amount,
                deadline: goal.deadline ? new Date(goal.deadline).toISOString().split("T")[0] : "",
            });
        }
    }, [open, goal, form]);

    const onSubmit = async (data: UpdateSavingsGoalFormValues) => {
        setIsSubmitting(true);

        try {
            const updates: Record<string, any> = {};

            if (data.currentAmount !== undefined && data.currentAmount !== goal.current_amount) {
                updates.current_amount = data.currentAmount;
            }

            if (data.targetAmount !== undefined && data.targetAmount !== goal.target_amount) {
                updates.target_amount = data.targetAmount;
            }

            if (data.deadline !== undefined && data.deadline !== (goal.deadline ? new Date(goal.deadline).toISOString().split("T")[0] : "")) {
                updates.deadline = data.deadline || null;
            }

            // Only update if there are changes
            if (Object.keys(updates).length > 0) {
                const { error } = await supabase
                    .from("savings_goals")
                    .update(updates as any)
                    .eq("id", goal.id as any);

                if (error) throw error;

                toast({
                    title: "Success",
                    description: "Savings goal updated successfully",
                });

                if (onGoalUpdated) {
                    onGoalUpdated();
                }
            }

            onOpenChange(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update savings goal",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Savings Goal: {goal.name}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="currentAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Amount</FormLabel>
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

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        Updating...
                                    </>
                                ) : "Update Goal"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
