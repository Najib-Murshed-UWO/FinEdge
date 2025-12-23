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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap, Calendar, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AutoPay {
  id: string;
  billerName: string;
  accountNumber: string;
  amount: number;
  frequency: "monthly" | "bi-weekly" | "weekly";
  dayOfMonth: number;
  fromAccount: string;
  enabled: boolean;
  nextPaymentDate: string;
}

// Mock autopay data
const mockAutoPays: AutoPay[] = [
  {
    id: "autopay-001",
    billerName: "Electric Company",
    accountNumber: "ELC-123456789",
    amount: 125.50,
    frequency: "monthly",
    dayOfMonth: 15,
    fromAccount: "Primary Checking (****789)",
    enabled: true,
    nextPaymentDate: "2024-12-15",
  },
  {
    id: "autopay-002",
    billerName: "Internet Provider",
    accountNumber: "INT-456789123",
    amount: 79.99,
    frequency: "monthly",
    dayOfMonth: 5,
    fromAccount: "Primary Checking (****789)",
    enabled: true,
    nextPaymentDate: "2024-12-05",
  },
  {
    id: "autopay-003",
    billerName: "Credit Card Company",
    accountNumber: "CC-789123456",
    amount: 500.00,
    frequency: "monthly",
    dayOfMonth: 1,
    fromAccount: "Savings Account (****321)",
    enabled: false,
    nextPaymentDate: "2024-12-01",
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

export function AutoPaySection() {
  const [autoPays, setAutoPays] = useState<AutoPay[]>(mockAutoPays);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAutoPay, setEditingAutoPay] = useState<AutoPay | null>(null);
  const [autoPayForm, setAutoPayForm] = useState({
    billerId: "",
    amount: "",
    frequency: "monthly" as "monthly" | "bi-weekly" | "weekly",
    dayOfMonth: "15",
    accountId: mockAccounts[0].id,
  });
  const { toast } = useToast();

  const handleOpenDialog = (autoPay?: AutoPay) => {
    if (autoPay) {
      setEditingAutoPay(autoPay);
      const biller = mockBillers.find((b) => b.accountNumber === autoPay.accountNumber);
      setAutoPayForm({
        billerId: biller?.id || "",
        amount: autoPay.amount.toString(),
        frequency: autoPay.frequency,
        dayOfMonth: autoPay.dayOfMonth.toString(),
        accountId: mockAccounts.find((a) => autoPay.fromAccount.includes(a.accountNumber.slice(-3)))?.id || mockAccounts[0].id,
      });
    } else {
      setEditingAutoPay(null);
      setAutoPayForm({
        billerId: "",
        amount: "",
        frequency: "monthly",
        dayOfMonth: "15",
        accountId: mockAccounts[0].id,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAutoPay(null);
    setAutoPayForm({
      billerId: "",
      amount: "",
      frequency: "monthly",
      dayOfMonth: "15",
      accountId: mockAccounts[0].id,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!autoPayForm.billerId || !autoPayForm.amount || !autoPayForm.accountId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const biller = mockBillers.find((b) => b.id === autoPayForm.billerId);
    const account = mockAccounts.find((a) => a.id === autoPayForm.accountId);
    const nextPaymentDate = new Date();
    nextPaymentDate.setDate(parseInt(autoPayForm.dayOfMonth));
    if (nextPaymentDate < new Date()) {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    }

    if (editingAutoPay) {
      setAutoPays(
        autoPays.map((ap) =>
          ap.id === editingAutoPay.id
            ? {
                ...ap,
                billerName: biller?.name || ap.billerName,
                accountNumber: biller?.accountNumber || ap.accountNumber,
                amount: parseFloat(autoPayForm.amount),
                frequency: autoPayForm.frequency,
                dayOfMonth: parseInt(autoPayForm.dayOfMonth),
                fromAccount: `${account?.name} (****${account?.accountNumber.slice(-3)})`,
                nextPaymentDate: nextPaymentDate.toISOString().split("T")[0],
              }
            : ap
        )
      );
      toast({
        title: "Auto-pay updated",
        description: `Auto-pay for ${biller?.name} has been updated.`,
      });
    } else {
      const newAutoPay: AutoPay = {
        id: `autopay-${Date.now()}`,
        billerName: biller?.name || "Unknown",
        accountNumber: biller?.accountNumber || "",
        amount: parseFloat(autoPayForm.amount),
        frequency: autoPayForm.frequency,
        dayOfMonth: parseInt(autoPayForm.dayOfMonth),
        fromAccount: `${account?.name} (****${account?.accountNumber.slice(-3)})`,
        enabled: true,
        nextPaymentDate: nextPaymentDate.toISOString().split("T")[0],
      };
      setAutoPays([...autoPays, newAutoPay]);
      toast({
        title: "Auto-pay enabled",
        description: `Auto-pay for ${newAutoPay.billerName} has been set up.`,
      });
    }
    handleCloseDialog();
  };

  const handleToggle = (id: string) => {
    setAutoPays(
      autoPays.map((ap) => (ap.id === id ? { ...ap, enabled: !ap.enabled } : ap))
    );
    const autoPay = autoPays.find((ap) => ap.id === id);
    toast({
      title: autoPay?.enabled ? "Auto-pay disabled" : "Auto-pay enabled",
      description: `${autoPay?.billerName} auto-pay has been ${autoPay?.enabled ? "disabled" : "enabled"}.`,
    });
  };

  const handleDelete = (id: string) => {
    const autoPay = autoPays.find((ap) => ap.id === id);
    setAutoPays(autoPays.filter((ap) => ap.id !== id));
    toast({
      title: "Auto-pay removed",
      description: `${autoPay?.billerName} auto-pay has been removed.`,
    });
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Auto-Pay Setup</h3>
          <p className="text-sm text-muted-foreground">
            Automate your bill payments with auto-pay
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-autopay">
          <Plus className="h-4 w-4 mr-2" />
          Set Up Auto-Pay
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Auto-Pay Settings</CardTitle>
          <CardDescription>Manage your automated bill payments</CardDescription>
        </CardHeader>
        <CardContent>
          {autoPays.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No auto-pay configured. Click "Set Up Auto-Pay" to get started.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Biller</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>From Account</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {autoPays.map((autoPay) => (
                    <TableRow key={autoPay.id} data-testid={`row-autopay-${autoPay.id}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-muted-foreground" />
                          {autoPay.billerName}
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {autoPay.accountNumber.slice(-4)}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(autoPay.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{autoPay.frequency}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(autoPay.nextPaymentDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Day {autoPay.dayOfMonth} of month
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{autoPay.fromAccount}</TableCell>
                      <TableCell>
                        <Badge variant={autoPay.enabled ? "default" : "secondary"}>
                          {autoPay.enabled ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(autoPay)}
                            data-testid={`button-edit-autopay-${autoPay.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Switch
                            checked={autoPay.enabled}
                            onCheckedChange={() => handleToggle(autoPay.id)}
                            data-testid={`switch-autopay-${autoPay.id}`}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(autoPay.id)}
                            data-testid={`button-delete-autopay-${autoPay.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
            <DialogTitle>{editingAutoPay ? "Edit Auto-Pay" : "Set Up Auto-Pay"}</DialogTitle>
            <DialogDescription>
              {editingAutoPay
                ? "Update your auto-pay settings"
                : "Automate your bill payments with auto-pay"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="autopayBiller">Biller *</Label>
                <Select
                  value={autoPayForm.billerId}
                  onValueChange={(value) => setAutoPayForm({ ...autoPayForm, billerId: value })}
                >
                  <SelectTrigger id="autopayBiller">
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
                <Label htmlFor="autopayAmount">Payment Amount *</Label>
                <Input
                  id="autopayAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={autoPayForm.amount}
                  onChange={(e) => setAutoPayForm({ ...autoPayForm, amount: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="autopayFrequency">Payment Frequency *</Label>
                <Select
                  value={autoPayForm.frequency}
                  onValueChange={(value: "monthly" | "bi-weekly" | "weekly") =>
                    setAutoPayForm({ ...autoPayForm, frequency: value })
                  }
                >
                  <SelectTrigger id="autopayFrequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {autoPayForm.frequency === "monthly" && (
                <div className="grid gap-2">
                  <Label htmlFor="dayOfMonth">Day of Month *</Label>
                  <Input
                    id="dayOfMonth"
                    type="number"
                    min="1"
                    max="28"
                    placeholder="15"
                    value={autoPayForm.dayOfMonth}
                    onChange={(e) => setAutoPayForm({ ...autoPayForm, dayOfMonth: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Select a day between 1-28 to ensure consistent monthly payments
                  </p>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="autopayAccount">From Account *</Label>
                <Select
                  value={autoPayForm.accountId}
                  onValueChange={(value) => setAutoPayForm({ ...autoPayForm, accountId: value })}
                >
                  <SelectTrigger id="autopayAccount">
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
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">{editingAutoPay ? "Update" : "Set Up"} Auto-Pay</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

