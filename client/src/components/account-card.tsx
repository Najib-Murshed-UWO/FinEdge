import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowUpFromLine, Send } from "lucide-react";

interface AccountCardProps {
  accountName: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency?: string;
}

export function AccountCard({
  accountName,
  accountNumber,
  accountType,
  balance,
  currency = "USD",
}: AccountCardProps) {
  const maskedNumber = `****${accountNumber.slice(-4)}`;

  return (
    <Card className="hover-elevate" data-testid={`card-account-${accountNumber}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="text-lg">{accountName}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1" data-testid={`text-account-number-${accountNumber}`}>{maskedNumber}</p>
        </div>
        <Badge variant="secondary">{accountType}</Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className="text-3xl font-semibold mt-1" data-testid={`text-balance-${accountNumber}`}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency,
            }).format(balance)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" data-testid="button-deposit">
            <ArrowDownToLine className="h-4 w-4 mr-1" />
            Deposit
          </Button>
          <Button size="sm" variant="outline" className="flex-1" data-testid="button-withdraw">
            <ArrowUpFromLine className="h-4 w-4 mr-1" />
            Withdraw
          </Button>
          <Button size="sm" variant="outline" className="flex-1" data-testid="button-transfer">
            <Send className="h-4 w-4 mr-1" />
            Transfer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
