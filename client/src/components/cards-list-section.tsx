import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Lock, Unlock, Settings, KeyRound, AlertTriangle } from "lucide-react";
import { CardControlsDialog } from "@/components/card-controls-dialog";
import { PinChangeDialog } from "@/components/pin-change-dialog";
import { ReportCardDialog } from "@/components/report-card-dialog";
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

// Mock cards data
const mockCards: CardDetails[] = [
  {
    id: "card-001",
    cardNumber: "4532 1234 5678 9010",
    cardHolder: "John Doe",
    expiryDate: "12/26",
    cardType: "debit",
    isFrozen: false,
    spendingLimit: 5000,
    currentSpending: 2345.67,
    onlineEnabled: true,
    internationalEnabled: true,
    status: "active",
  },
  {
    id: "card-002",
    cardNumber: "5555 1234 5678 9010",
    cardHolder: "John Doe",
    expiryDate: "08/27",
    cardType: "credit",
    isFrozen: false,
    spendingLimit: 10000,
    currentSpending: 5678.90,
    onlineEnabled: true,
    internationalEnabled: false,
    status: "active",
  },
  {
    id: "card-003",
    cardNumber: "4111 1234 5678 9010",
    cardHolder: "John Doe",
    expiryDate: "03/26",
    cardType: "debit",
    isFrozen: true,
    spendingLimit: 3000,
    currentSpending: 0,
    onlineEnabled: false,
    internationalEnabled: false,
    status: "frozen",
  },
];

const maskCardNumber = (cardNumber: string) => {
  const cleaned = cardNumber.replace(/\s/g, "");
  return `**** **** **** ${cleaned.slice(-4)}`;
};

export function CardsListSection() {
  const [cards, setCards] = useState<CardDetails[]>(mockCards);
  const [controlsDialogOpen, setControlsDialogOpen] = useState(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardDetails | null>(null);
  const { toast } = useToast();

  const handleOpenControls = (card: CardDetails) => {
    setSelectedCard(card);
    setControlsDialogOpen(true);
  };

  const handleOpenPinChange = (card: CardDetails) => {
    setSelectedCard(card);
    setPinDialogOpen(true);
  };

  const handleOpenReport = (card: CardDetails) => {
    setSelectedCard(card);
    setReportDialogOpen(true);
  };

  const handleToggleFreeze = (cardId: string) => {
    setCards(
      cards.map((card) => {
        if (card.id === cardId) {
          const newStatus = card.isFrozen ? "active" : "frozen";
          toast({
            title: card.isFrozen ? "Card Unfrozen" : "Card Frozen",
            description: `Your card ending in ${card.cardNumber.slice(-4)} has been ${
              card.isFrozen ? "unfrozen" : "frozen"
            }.`,
          });
          return {
            ...card,
            isFrozen: !card.isFrozen,
            status: newStatus as any,
          };
        }
        return card;
      })
    );
  };

  const handleUpdateControls = (updates: {
    spendingLimit?: number;
    onlineEnabled?: boolean;
    internationalEnabled?: boolean;
  }) => {
    if (!selectedCard) return;

    setCards(
      cards.map((card) =>
        card.id === selectedCard.id
          ? {
              ...card,
              ...updates,
            }
          : card
      )
    );
    setControlsDialogOpen(false);
    setSelectedCard(null);
  };

  const handlePinChange = () => {
    if (!selectedCard) return;
    toast({
      title: "PIN Changed",
      description: `PIN for card ending in ${selectedCard.cardNumber.slice(-4)} has been changed successfully.`,
    });
    setPinDialogOpen(false);
    setSelectedCard(null);
  };

  const handleReportCard = (reason: "lost" | "stolen") => {
    if (!selectedCard) return;

    setCards(
      cards.map((card) =>
        card.id === selectedCard.id
          ? {
              ...card,
              status: reason,
              isFrozen: true,
              onlineEnabled: false,
              internationalEnabled: false,
            }
          : card
      )
    );
    toast({
      title: `Card Reported as ${reason === "lost" ? "Lost" : "Stolen"}`,
      description: `Your card ending in ${selectedCard.cardNumber.slice(-4)} has been blocked. A replacement card will be issued.`,
      variant: "destructive",
    });
    setReportDialogOpen(false);
    setSelectedCard(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "frozen":
        return "secondary";
      case "blocked":
      case "lost":
      case "stolen":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Cards</CardTitle>
          <CardDescription>Manage your debit and credit cards</CardDescription>
        </CardHeader>
        <CardContent>
          {cards.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No cards found.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {cards.map((card) => (
                <Card key={card.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {card.cardType === "debit" ? "Debit Card" : "Credit Card"}
                          </CardTitle>
                          <CardDescription className="font-mono text-sm mt-1">
                            {maskCardNumber(card.cardNumber)}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(card.status) as any}>
                        {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Card Holder</p>
                        <p className="font-medium">{card.cardHolder}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expires</p>
                        <p className="font-medium">{card.expiryDate}</p>
                      </div>
                    </div>

                    {card.spendingLimit && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Spending Limit</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(card.spendingLimit)}
                          </span>
                        </div>
                        {card.currentSpending !== undefined && (
                          <>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{
                                  width: `${Math.min(
                                    (card.currentSpending / card.spendingLimit) * 100,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>
                                Used:{" "}
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                }).format(card.currentSpending)}
                              </span>
                              <span>
                                Remaining:{" "}
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                }).format(card.spendingLimit - card.currentSpending)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    <div className="space-y-3 pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {card.isFrozen ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Unlock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-sm">Card Status</span>
                        </div>
                        <Switch
                          checked={!card.isFrozen}
                          onCheckedChange={() => handleToggleFreeze(card.id)}
                          data-testid={`switch-freeze-${card.id}`}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Online Usage</span>
                        <Badge variant={card.onlineEnabled ? "default" : "secondary"}>
                          {card.onlineEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">International Usage</span>
                        <Badge variant={card.internationalEnabled ? "default" : "secondary"}>
                          {card.internationalEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleOpenControls(card)}
                        data-testid={`button-controls-${card.id}`}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Controls
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleOpenPinChange(card)}
                        data-testid={`button-pin-${card.id}`}
                      >
                        <KeyRound className="h-4 w-4 mr-2" />
                        Change PIN
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenReport(card)}
                        data-testid={`button-report-${card.id}`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCard && (
        <>
          <CardControlsDialog
            open={controlsDialogOpen}
            onOpenChange={setControlsDialogOpen}
            card={selectedCard}
            onUpdate={handleUpdateControls}
          />
          <PinChangeDialog
            open={pinDialogOpen}
            onOpenChange={setPinDialogOpen}
            card={selectedCard}
            onPinChange={handlePinChange}
          />
          <ReportCardDialog
            open={reportDialogOpen}
            onOpenChange={setReportDialogOpen}
            card={selectedCard}
            onReport={handleReportCard}
          />
        </>
      )}
    </>
  );
}

