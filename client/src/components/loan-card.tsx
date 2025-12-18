import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign, Percent } from "lucide-react";

interface LoanCardProps {
  loanId: string;
  loanType: string;
  amount: number;
  interestRate: number;
  tenure: number;
  monthlyEMI: number;
  amountPaid: number;
  status: "active" | "pending" | "completed" | "rejected";
  currency?: string;
}

const statusColors = {
  active: "default",
  pending: "secondary",
  completed: "outline",
  rejected: "destructive",
} as const;

export function LoanCard({
  loanId,
  loanType,
  amount,
  interestRate,
  tenure,
  monthlyEMI,
  amountPaid,
  status,
  currency = "USD",
}: LoanCardProps) {
  const progress = (amountPaid / amount) * 100;

  return (
    <Card className="hover-elevate" data-testid={`card-loan-${loanId}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="text-lg">{loanType}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">ID: {loanId}</p>
        </div>
        <Badge variant={statusColors[status]} data-testid={`badge-loan-status-${loanId}`}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <DollarSign className="h-3 w-3" />
              Loan Amount
            </div>
            <p className="text-lg font-semibold" data-testid={`text-loan-amount-${loanId}`}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency,
              }).format(amount)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <Percent className="h-3 w-3" />
              Interest Rate
            </div>
            <p className="text-lg font-semibold">{interestRate}%</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <Calendar className="h-3 w-3" />
              Tenure
            </div>
            <p className="text-lg font-semibold">{tenure} months</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <DollarSign className="h-3 w-3" />
              Monthly EMI
            </div>
            <p className="text-lg font-semibold" data-testid={`text-emi-${loanId}`}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency,
              }).format(monthlyEMI)}
            </p>
          </div>
        </div>
        
        {status === "active" && (
          <>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Repayment Progress</span>
                <span className="font-medium">{progress.toFixed(1)}%</span>
              </div>
              <Progress value={progress} data-testid={`progress-loan-${loanId}`} />
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" data-testid={`button-pay-emi-${loanId}`}>
                Make Payment
              </Button>
              <Button size="sm" variant="outline" className="flex-1" data-testid={`button-view-details-${loanId}`}>
                View Details
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
