
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowDownIcon, ArrowUpIcon, ShoppingBagIcon, CoffeeIcon, HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  category: "shopping" | "food" | "housing" | "transportation" | "utilities" | "salary" | "other";
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getCategoryIcon = (category: Transaction["category"]) => {
    switch (category) {
      case "shopping":
        return <ShoppingBagIcon className="h-4 w-4" />;
      case "food":
        return <CoffeeIcon className="h-4 w-4" />;
      case "housing":
        return <HomeIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-muted">
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <span>{transaction.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {transaction.type === "income" ? (
                      <ArrowUpIcon className="h-4 w-4 text-finance-green" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-finance-red" />
                    )}
                    <span
                      className={cn(
                        transaction.type === "income"
                          ? "text-finance-green font-medium"
                          : "text-finance-red font-medium"
                      )}
                    >
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
