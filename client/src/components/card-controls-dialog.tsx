import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { DollarSign } from "lucide-react";

interface CardDetails {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cardType: "debit" | "credit";
  isFrozen: boolean;
  spendingLimit?: number;
  currentSpending?: number;
  onlineEnabled: boolean;
  internationalEnabled: boolean;
  status: "active" | "frozen" | "blocked" | "lost" | "stolen";
}

interface CardControlsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: CardDetails;
  onUpdate: (updates: {
    spendingLimit?: number;
    onlineEnabled?: boolean;
    internationalEnabled?: boolean;
  }) => void;
}

export function CardControlsDialog({
  open,
  onOpenChange,
  card,
  onUpdate,
}: CardControlsDialogProps) {
  const [spendingLimit, setSpendingLimit] = useState(
    card.spendingLimit?.toString() || ""
  );
  const [onlineEnabled, setOnlineEnabled] = useState(card.onlineEnabled);
  const [internationalEnabled, setInternationalEnabled] = useState(
    card.internationalEnabled
  );

  useEffect(() => {
    if (open) {
      setSpendingLimit(card.spendingLimit?.toString() || "");
      setOnlineEnabled(card.onlineEnabled);
      setInternationalEnabled(card.internationalEnabled);
    }
  }, [open, card]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      spendingLimit: spendingLimit ? parseFloat(spendingLimit) : undefined,
      onlineEnabled,
      internationalEnabled,
    });
  };

  const maskCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, "");
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Card Controls</DialogTitle>
          <DialogDescription>
            Manage spending limits and usage settings for card ending in{" "}
            {card.cardNumber.slice(-4)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="spendingLimit">Monthly Spending Limit</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="spendingLimit"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter limit (optional)"
                  value={spendingLimit}
                  onChange={(e) => setSpendingLimit(e.target.value)}
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Set a monthly spending limit to control your expenses. Leave empty for no limit.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="onlineEnabled">Online Usage</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable or disable online/contactless payments
                  </p>
                </div>
                <Switch
                  id="onlineEnabled"
                  checked={onlineEnabled}
                  onCheckedChange={setOnlineEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="internationalEnabled">International Usage</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable or disable international transactions
                  </p>
                </div>
                <Switch
                  id="internationalEnabled"
                  checked={internationalEnabled}
                  onCheckedChange={setInternationalEnabled}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

