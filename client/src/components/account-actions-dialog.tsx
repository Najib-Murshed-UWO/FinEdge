import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AccountActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "deposit" | "withdraw" | "transfer" | null;
  accountId: string;
  accountNumber: string;
  accountName: string;
  balance: number;
  availableAccounts?: Array<{ id: string; accountNumber: string; accountName: string }>;
}

export function AccountActionsDialog({
  open,
  onOpenChange,
  action,
  accountId,
  accountNumber,
  accountName,
  balance,
  availableAccounts = [],
}: AccountActionsDialogProps) {
  const [amount, setAmount] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleClose = () => {
    setAmount("");
    setToAccountId("");
    setDescription("");
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (action === "transfer" && !toAccountId) {
      toast({
        title: "Missing information",
        description: "Please select a destination account.",
        variant: "destructive",
      });
      return;
    }

    if (action === "withdraw" && parseFloat(amount) > balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this withdrawal.",
        variant: "destructive",
      });
      return;
    }

    // Mock transaction - simulate API call
    setTimeout(() => {
      toast({
        title: "Transaction successful",
        description: `Your ${action} of ${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(parseFloat(amount))} has been processed successfully.`,
      });
      handleClose();
    }, 500);
  };

  if (!action) return null;

  const actionLabels = {
    deposit: "Deposit",
    withdraw: "Withdraw",
    transfer: "Transfer",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{actionLabels[action]}</DialogTitle>
          <DialogDescription>
            {action === "deposit" && `Add funds to ${accountName} (${accountNumber.slice(-4)})`}
            {action === "withdraw" && `Withdraw funds from ${accountName} (${accountNumber.slice(-4)})`}
            {action === "transfer" && `Transfer funds from ${accountName} (${accountNumber.slice(-4)})`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {action === "transfer" && (
              <div className="grid gap-2">
                <Label htmlFor="toAccount">To Account</Label>
                <Select value={toAccountId} onValueChange={setToAccountId}>
                  <SelectTrigger id="toAccount">
                    <SelectValue placeholder="Select destination account" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAccounts
                      .filter((acc) => acc.id !== accountId)
                      .map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.accountName} ({acc.accountNumber.slice(-4)})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              {action === "withdraw" && balance > 0 && (
                <p className="text-xs text-muted-foreground">
                  Available balance:{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(balance)}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Add a note..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {actionLabels[action]}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

