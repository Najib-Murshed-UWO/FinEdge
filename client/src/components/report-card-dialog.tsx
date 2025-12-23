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
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface ReportCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: CardDetails;
  onReport: (reason: "lost" | "stolen") => void;
}

export function ReportCardDialog({
  open,
  onOpenChange,
  card,
  onReport,
}: ReportCardDialogProps) {
  const [isReporting, setIsReporting] = useState(false);
  const { toast } = useToast();

  const handleReport = (reason: "lost" | "stolen") => {
    setIsReporting(true);
    // Simulate API call
    setTimeout(() => {
      onReport(reason);
      setIsReporting(false);
      onOpenChange(false);
    }, 1000);
  };

  const maskCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, "");
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Report Card
          </DialogTitle>
          <DialogDescription>
            Report your card as lost or stolen. This will immediately block the card and prevent
            unauthorized use.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <p className="text-sm font-medium mb-2">Card Details</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Card Number:</span>
                <span className="font-mono">{maskCardNumber(card.cardNumber)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Card Type:</span>
                <span>{card.cardType === "debit" ? "Debit Card" : "Credit Card"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires:</span>
                <span>{card.expiryDate}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
            <p className="text-sm font-medium text-destructive mb-2">Important:</p>
            <ul className="text-sm text-destructive/90 space-y-1 list-disc list-inside">
              <li>The card will be immediately blocked</li>
              <li>All transactions will be stopped</li>
              <li>A replacement card will be issued within 5-7 business days</li>
              <li>You may be charged a replacement fee</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Select reason:</p>
            <div className="grid gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleReport("lost")}
                disabled={isReporting}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report as Lost
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="w-full justify-start"
                onClick={() => handleReport("stolen")}
                disabled={isReporting}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report as Stolen
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isReporting}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

