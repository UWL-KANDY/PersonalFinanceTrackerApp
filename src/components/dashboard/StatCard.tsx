
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: "default" | "income" | "expense" | "balance";
}

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  className,
  variant = "default",
}: StatCardProps) {
  const getValueClass = () => {
    switch (variant) {
      case "income":
        return "income-value text-2xl font-bold";
      case "expense":
        return "expense-value text-2xl font-bold";
      case "balance":
        return typeof value === "number" && value < 0
          ? "balance-negative text-2xl font-bold"
          : "balance-positive text-2xl font-bold";
      default:
        return "text-2xl font-bold";
    }
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-primary/80 rounded-full p-1">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={getValueClass()}>{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center mt-2">
            <div
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-finance-green" : "text-finance-red"
              )}
            >
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </div>
            <span className="text-xs text-muted-foreground ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
