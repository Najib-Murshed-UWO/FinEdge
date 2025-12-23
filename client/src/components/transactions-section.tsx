import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionTable } from "@/components/transaction-table";
import emptyTransactionsImg from "@assets/generated_images/Empty_transactions_illustration_4c17ba59.png";

interface SimpleTransaction {
  id: string;
  date: string;
  description: string;
  type: "credit" | "debit";
  amount: number;
  balance: number;
  category?: string;
}

interface TransactionsSectionProps {
  transactions: SimpleTransaction[];
  transactionsLoading: boolean;
}

export function TransactionsSection({
  transactions,
  transactionsLoading,
}: TransactionsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
        <CardDescription>Complete transaction history for all accounts</CardDescription>
      </CardHeader>
      <CardContent>
        {transactionsLoading ? (
          <Skeleton className="h-64" />
        ) : transactions.length > 0 ? (
          <TransactionTable transactions={transactions} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <img src={emptyTransactionsImg} alt="" className="w-48 h-48 mb-4 opacity-50" />
            <p className="text-muted-foreground text-center">No transactions yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}