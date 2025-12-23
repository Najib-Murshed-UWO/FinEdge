import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoanCard } from "@/components/loan-card";
import emptyLoansImg from "@assets/generated_images/Empty_loans_illustration_9d895a63.png";

interface SimpleLoan {
  loanId: string;
  loanType: string;
  amount: number;
  interestRate: number;
  tenure: number;
  monthlyEMI: number;
  amountPaid: number;
  status: "active" | "pending" | "completed" | "rejected";
}

interface LoansSectionProps {
  loans: SimpleLoan[];
  loansLoading: boolean;
}

export function LoansSection({ loans, loansLoading }: LoansSectionProps) {
  if (loansLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {loans.length > 0 ? (
        loans.map((loan) => <LoanCard key={loan.loanId} {...loan} />)
      ) : (
        <Card className="md:col-span-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <img src={emptyLoansImg} alt="" className="w-48 h-48 mb-4 opacity-50" />
            <p className="text-muted-foreground text-center">No active loans</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}