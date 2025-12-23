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
import { KeyRound, Eye, EyeOff } from "lucide-react";
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

interface PinChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: CardDetails;
  onPinChange: () => void;
}

export function PinChangeDialog({
  open,
  onOpenChange,
  card,
  onPinChange,
}: PinChangeDialogProps) {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const { toast } = useToast();

  const handleClose = () => {
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setShowCurrentPin(false);
    setShowNewPin(false);
    setShowConfirmPin(false);
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPin || !newPin || !confirmPin) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (currentPin.length !== 4 || newPin.length !== 4 || confirmPin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits.",
        variant: "destructive",
      });
      return;
    }

    if (newPin !== confirmPin) {
      toast({
        title: "PIN mismatch",
        description: "New PIN and confirm PIN do not match.",
        variant: "destructive",
      });
      return;
    }

    if (currentPin === newPin) {
      toast({
        title: "Invalid PIN",
        description: "New PIN must be different from current PIN.",
        variant: "destructive",
      });
      return;
    }

    // Mock PIN change - simulate API call
    setTimeout(() => {
      onPinChange();
      handleClose();
    }, 500);
  };

  const maskCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, "");
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change PIN</DialogTitle>
          <DialogDescription>
            Update your PIN for card ending in {card.cardNumber.slice(-4)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPin">Current PIN</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="currentPin"
                  type={showCurrentPin ? "text" : "password"}
                  maxLength={4}
                  placeholder="Enter current PIN"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
                  className="pl-9 pr-9"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowCurrentPin(!showCurrentPin)}
                >
                  {showCurrentPin ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPin">New PIN</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPin"
                  type={showNewPin ? "text" : "password"}
                  maxLength={4}
                  placeholder="Enter new PIN (4 digits)"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                  className="pl-9 pr-9"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowNewPin(!showNewPin)}
                >
                  {showNewPin ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPin">Confirm New PIN</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPin"
                  type={showConfirmPin ? "text" : "password"}
                  maxLength={4}
                  placeholder="Confirm new PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                  className="pl-9 pr-9"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                >
                  {showConfirmPin ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <p className="font-medium mb-1">Security Tips:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Never share your PIN with anyone</li>
                <li>Choose a PIN that's easy for you to remember but hard for others to guess</li>
                <li>Avoid using obvious numbers like 1234 or your birth year</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Change PIN</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

