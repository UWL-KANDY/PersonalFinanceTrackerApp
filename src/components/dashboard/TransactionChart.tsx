
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";

interface TransactionChartProps {
  data: Array<{
    date: string;
    income: number;
    expenses: number;
  }>;
}

export function TransactionChart({ data }: TransactionChartProps) {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#48BB78" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#48BB78" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E53E3E" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#E53E3E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                padding={{ left: 10, right: 10 }}
                tickMargin={8}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => (isMobile ? value.substring(0, 3) : value)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, undefined]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: isDark ? 'hsl(var(--card))' : '#fff',
                  borderColor: 'hsl(var(--border))',
                  color: isDark ? 'hsl(var(--foreground))' : '#333',
                }}
                itemStyle={{
                  color: isDark ? 'hsl(var(--foreground))' : 'inherit',
                }}
                labelStyle={{
                  color: isDark ? 'hsl(var(--foreground))' : 'inherit',
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#48BB78"
                strokeWidth={2}
                fill="url(#incomeGradient)"
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#E53E3E"
                strokeWidth={2}
                fill="url(#expensesGradient)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
