import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, DollarSign, Percent, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoanDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanId: string;
  loanType: string;
  amount: number;
  interestRate: number;
  tenure: number;
  monthlyEMI: number;
  amountPaid: number;
  status: "active" | "pending" | "completed" | "rejected";
}

export function LoanDetailsDialog({
  open,
  onOpenChange,
  loanId,
  loanType,
  amount,
  interestRate,
  tenure,
  monthlyEMI,
  amountPaid,
  status,
}: LoanDetailsDialogProps) {
  // Mock EMI schedules data
  const isLoading = false;
  const emiSchedules = status === "active" ? [
    {
      id: "emi-001",
      installmentNumber: 1,
      dueDate: "2024-12-01T00:00:00",
      totalAmount: monthlyEMI.toString(),
      isPaid: false,
    },
    {
      id: "emi-002",
      installmentNumber: 2,
      dueDate: "2025-01-01T00:00:00",
      totalAmount: monthlyEMI.toString(),
      isPaid: false,
    },
    {
      id: "emi-003",
      installmentNumber: 3,
      dueDate: "2025-02-01T00:00:00",
      totalAmount: monthlyEMI.toString(),
      isPaid: false,
    },
    {
      id: "emi-004",
      installmentNumber: 4,
      dueDate: "2025-03-01T00:00:00",
      totalAmount: monthlyEMI.toString(),
      isPaid: true,
    },
    {
      id: "emi-005",
      installmentNumber: 5,
      dueDate: "2025-04-01T00:00:00",
      totalAmount: monthlyEMI.toString(),
      isPaid: true,
    },
  ] : [];
  const progress = (amountPaid / amount) * 100;
  const remainingAmount = amount - amountPaid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{loanType}</DialogTitle>
              <DialogDescription>Loan ID: {loanId}</DialogDescription>
            </div>
            <Badge
              variant={
                status === "active"
                  ? "default"
                  : status === "completed"
                  ? "outline"
                  : status === "rejected"
                  ? "destructive"
                  : "secondary"
              }
            >
              {status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <DollarSign className="h-3 w-3" />
                Loan Amount
              </div>
              <p className="text-lg font-semibold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
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
              <p className="text-lg font-semibold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
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
                <Progress value={progress} />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>
                    Paid:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(amountPaid)}
                  </span>
                  <span>
                    Remaining:{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(remainingAmount)}
                  </span>
                </div>
              </div>

              {isLoading ? (
                <Skeleton className="h-64" />
              ) : emiSchedules.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    EMI Schedule
                  </h3>
                  <div className="rounded-md border max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Installment</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {emiSchedules.map((emi: any) => (
                          <TableRow key={emi.id}>
                            <TableCell className="font-medium">
                              #{emi.installmentNumber}
                            </TableCell>
                            <TableCell>
                              {new Date(emi.dueDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(parseFloat(emi.totalAmount))}
                            </TableCell>
                            <TableCell>
                              <Badge variant={emi.isPaid ? "default" : "secondary"}>
                                {emi.isPaid ? "Paid" : "Pending"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

