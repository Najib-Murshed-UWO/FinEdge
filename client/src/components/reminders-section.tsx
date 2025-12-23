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
import { Plus, Bell, Calendar, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Reminder {
  id: string;
  billerName: string;
  accountNumber: string;
  dueDate: string;
  amount: number;
  daysBefore: number;
  enabled: boolean;
}

// Mock reminders
const mockReminders: Reminder[] = [
  {
    id: "reminder-001",
    billerName: "Electric Company",
    accountNumber: "ELC-123456789",
    dueDate: "2024-12-15",
    amount: 125.50,
    daysBefore: 3,
    enabled: true,
  },
  {
    id: "reminder-002",
    billerName: "Water Department",
    accountNumber: "WTR-987654321",
    dueDate: "2024-12-10",
    amount: 45.75,
    daysBefore: 5,
    enabled: true,
  },
  {
    id: "reminder-003",
    billerName: "Credit Card Company",
    accountNumber: "CC-789123456",
    dueDate: "2024-12-01",
    amount: 500.00,
    daysBefore: 7,
    enabled: false,
  },
];

const mockBillers = [
  { id: "biller-001", name: "Electric Company", accountNumber: "ELC-123456789" },
  { id: "biller-002", name: "Water Department", accountNumber: "WTR-987654321" },
  { id: "biller-003", name: "Internet Provider", accountNumber: "INT-456789123" },
  { id: "biller-004", name: "Credit Card Company", accountNumber: "CC-789123456" },
];

export function RemindersSection() {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reminderForm, setReminderForm] = useState({
    billerId: "",
    dueDate: "",
    amount: "",
    daysBefore: "3",
  });
  const { toast } = useToast();

  const handleOpenDialog = () => {
    setReminderForm({
      billerId: "",
      dueDate: "",
      amount: "",
      daysBefore: "3",
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setReminderForm({
      billerId: "",
      dueDate: "",
      amount: "",
      daysBefore: "3",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderForm.billerId || !reminderForm.dueDate || !reminderForm.amount) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const biller = mockBillers.find((b) => b.id === reminderForm.billerId);
    const newReminder: Reminder = {
      id: `reminder-${Date.now()}`,
      billerName: biller?.name || "Unknown",
      accountNumber: biller?.accountNumber || "",
      dueDate: reminderForm.dueDate,
      amount: parseFloat(reminderForm.amount),
      daysBefore: parseInt(reminderForm.daysBefore),
      enabled: true,
    };

    setReminders([...reminders, newReminder]);
    toast({
      title: "Reminder created",
      description: `Reminder for ${newReminder.billerName} has been set.`,
    });
    handleCloseDialog();
  };

  const handleToggle = (id: string) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    const reminder = reminders.find((r) => r.id === id);
    toast({
      title: reminder?.enabled ? "Reminder disabled" : "Reminder enabled",
      description: `${reminder?.billerName} reminder has been ${reminder?.enabled ? "disabled" : "enabled"}.`,
    });
  };

  const handleDelete = (id: string) => {
    const reminder = reminders.find((r) => r.id === id);
    setReminders(reminders.filter((r) => r.id !== id));
    toast({
      title: "Reminder removed",
      description: `${reminder?.billerName} reminder has been removed.`,
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Due Date Reminders</h3>
          <p className="text-sm text-muted-foreground">
            Set reminders for upcoming bill due dates
          </p>
        </div>
        <Button onClick={handleOpenDialog} data-testid="button-add-reminder">
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Reminders</CardTitle>
          <CardDescription>Manage your bill payment reminders</CardDescription>
        </CardHeader>
        <CardContent>
          {reminders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No reminders set. Click "Add Reminder" to create one.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Biller</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Remind Before</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reminders.map((reminder) => {
                    const daysUntil = getDaysUntilDue(reminder.dueDate);
                    return (
                      <TableRow key={reminder.id} data-testid={`row-reminder-${reminder.id}`}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-muted-foreground" />
                            {reminder.billerName}
                          </div>
                          <div className="text-sm text-muted-foreground font-mono">
                            {reminder.accountNumber.slice(-4)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(reminder.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          {daysUntil >= 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {daysUntil === 0
                                ? "Due today"
                                : daysUntil === 1
                                ? "Due tomorrow"
                                : `${daysUntil} days remaining`}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(reminder.amount)}
                        </TableCell>
                        <TableCell>{reminder.daysBefore} days</TableCell>
                        <TableCell>
                          <Badge variant={reminder.enabled ? "default" : "secondary"}>
                            {reminder.enabled ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Switch
                              checked={reminder.enabled}
                              onCheckedChange={() => handleToggle(reminder.id)}
                              data-testid={`switch-reminder-${reminder.id}`}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(reminder.id)}
                              data-testid={`button-delete-reminder-${reminder.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Reminder</DialogTitle>
            <DialogDescription>
              Set up a reminder for an upcoming bill payment
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reminderBiller">Biller *</Label>
                <Select
                  value={reminderForm.billerId}
                  onValueChange={(value) => setReminderForm({ ...reminderForm, billerId: value })}
                >
                  <SelectTrigger id="reminderBiller">
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
                <Label htmlFor="reminderDueDate">Due Date *</Label>
                <Input
                  id="reminderDueDate"
                  type="date"
                  value={reminderForm.dueDate}
                  onChange={(e) => setReminderForm({ ...reminderForm, dueDate: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reminderAmount">Expected Amount *</Label>
                <Input
                  id="reminderAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={reminderForm.amount}
                  onChange={(e) => setReminderForm({ ...reminderForm, amount: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="daysBefore">Remind Me Before *</Label>
                <Select
                  value={reminderForm.daysBefore}
                  onValueChange={(value) => setReminderForm({ ...reminderForm, daysBefore: value })}
                >
                  <SelectTrigger id="daysBefore">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day before</SelectItem>
                    <SelectItem value="3">3 days before</SelectItem>
                    <SelectItem value="5">5 days before</SelectItem>
                    <SelectItem value="7">7 days before</SelectItem>
                    <SelectItem value="14">14 days before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">Create Reminder</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

