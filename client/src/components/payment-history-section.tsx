import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, DollarSign, Repeat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  billerName: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  type: "one-time" | "recurring";
  accountNumber: string;
}

// Mock payment history
const mockPayments: Payment[] = [
  {
    id: "pay-001",
    billerName: "Electric Company",
    amount: 125.50,
    date: "2024-11-15",
    status: "completed",
    type: "recurring",
    accountNumber: "ELC-123456789",
  },
  {
    id: "pay-002",
    billerName: "Water Department",
    amount: 45.75,
    date: "2024-11-10",
    status: "completed",
    type: "one-time",
    accountNumber: "WTR-987654321",
  },
  {
    id: "pay-003",
    billerName: "Internet Provider",
    amount: 79.99,
    date: "2024-11-05",
    status: "completed",
    type: "recurring",
    accountNumber: "INT-456789123",
  },
  {
    id: "pay-004",
    billerName: "Credit Card Company",
    amount: 500.00,
    date: "2024-12-01",
    status: "pending",
    type: "recurring",
    accountNumber: "CC-789123456",
  },
];

const mockBillers = [
  { id: "biller-001", name: "Electric Company", accountNumber: "ELC-123456789" },
  { id: "biller-002", name: "Water Department", accountNumber: "WTR-987654321" },
  { id: "biller-003", name: "Internet Provider", accountNumber: "INT-456789123" },
  { id: "biller-004", name: "Credit Card Company", accountNumber: "CC-789123456" },
];

const mockAccounts = [
  { id: "acc-001", name: "Primary Checking", accountNumber: "ACC123456789" },
  { id: "acc-002", name: "Savings Account", accountNumber: "ACC987654321" },
];

export function PaymentHistorySection() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    billerId: "",
    amount: "",
    type: "one-time" as "one-time" | "recurring",
    accountId: "",
    paymentDate: "",
  });
  const { toast } = useToast();

  const handleOpenDialog = () => {
    setPaymentForm({
      billerId: "",
      amount: "",
      type: "one-time",
      accountId: mockAccounts[0].id,
      paymentDate: new Date().toISOString().split("T")[0],
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setPaymentForm({
      billerId: "",
      amount: "",
      type: "one-time",
      accountId: mockAccounts[0].id,
      paymentDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.billerId || !paymentForm.amount || !paymentForm.accountId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const biller = mockBillers.find((b) => b.id === paymentForm.billerId);
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      billerName: biller?.name || "Unknown",
      amount: parseFloat(paymentForm.amount),
      date: paymentForm.paymentDate,
      status: "pending",
      type: paymentForm.type,
      accountNumber: biller?.accountNumber || "",
    };

    setPayments([newPayment, ...payments]);
    toast({
      title: "Payment scheduled",
      description: `Payment of ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(newPayment.amount)} to ${newPayment.billerName} has been scheduled.`,
    });
    handleCloseDialog();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Payment History</h3>
          <p className="text-sm text-muted-foreground">
            View and manage your bill payments
          </p>
        </div>
        <Button onClick={handleOpenDialog} data-testid="button-make-payment">
          <Plus className="h-4 w-4 mr-2" />
          Make Payment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Your payment history and scheduled payments</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No payments found. Click "Make Payment" to pay a bill.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Biller</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} data-testid={`row-payment-${payment.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(payment.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{payment.billerName}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {payment.accountNumber.slice(-4)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(payment.amount)}
                      </TableCell>
                      <TableCell>
                        {payment.type === "recurring" ? (
                          <Badge variant="outline" className="gap-1">
                            <Repeat className="h-3 w-3" />
                            Recurring
                          </Badge>
                        ) : (
                          <Badge variant="outline">One-time</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(payment.status) as any}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              Schedule a one-time or recurring payment to your biller
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="biller">Biller *</Label>
                <Select
                  value={paymentForm.billerId}
                  onValueChange={(value) => setPaymentForm({ ...paymentForm, billerId: value })}
                >
                  <SelectTrigger id="biller">
                    <SelectValue placeholder="Select biller" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBillers.map((biller) => (
                      <SelectItem key={biller.id} value={biller.id}>
                        {biller.name} ({biller.accountNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account">From Account *</Label>
                <Select
                  value={paymentForm.accountId}
                  onValueChange={(value) => setPaymentForm({ ...paymentForm, accountId: value })}
                >
                  <SelectTrigger id="account">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.accountNumber.slice(-4)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Payment Type *</Label>
                <Select
                  value={paymentForm.type}
                  onValueChange={(value: "one-time" | "recurring") =>
                    setPaymentForm({ ...paymentForm, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time Payment</SelectItem>
                    <SelectItem value="recurring">Recurring Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentDate">Payment Date *</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentForm.paymentDate}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">Schedule Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

