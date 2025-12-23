import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Smartphone, CreditCard, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  transactionAlerts: boolean;
  paymentReminders: boolean;
  securityAlerts: boolean;
  accountUpdates: boolean;
  marketingEmails: boolean;
  promotionalOffers: boolean;
}

// Mock notification preferences
const mockPreferences: NotificationPreferences = {
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: true,
  transactionAlerts: true,
  paymentReminders: true,
  securityAlerts: true,
  accountUpdates: true,
  marketingEmails: false,
  promotionalOffers: false,
};

export function NotificationPreferencesSection() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(mockPreferences);
  const { toast } = useToast();

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  const handleSave = () => {
    // Mock save - simulate API call
    setTimeout(() => {
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved successfully.",
      });
    }, 500);
  };

  const handleReset = () => {
    setPreferences(mockPreferences);
    toast({
      title: "Preferences reset",
      description: "Notification preferences have been reset to default values.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </div>
          <Button onClick={handleSave} data-testid="button-save-notifications">
            Save Changes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Notification Channels
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={() => handleToggle("emailNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smsNotifications" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    SMS Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via text message
                  </p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={preferences.smsNotifications}
                  onCheckedChange={() => handleToggle("smsNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications on your device
                  </p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={preferences.pushNotifications}
                  onCheckedChange={() => handleToggle("pushNotifications")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Transaction & Account Alerts
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="transactionAlerts">Transaction Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about account transactions
                  </p>
                </div>
                <Switch
                  id="transactionAlerts"
                  checked={preferences.transactionAlerts}
                  onCheckedChange={() => handleToggle("transactionAlerts")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="paymentReminders">Payment Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Reminders for upcoming bill payments
                  </p>
                </div>
                <Switch
                  id="paymentReminders"
                  checked={preferences.paymentReminders}
                  onCheckedChange={() => handleToggle("paymentReminders")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="securityAlerts" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Security Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Important security notifications
                  </p>
                </div>
                <Switch
                  id="securityAlerts"
                  checked={preferences.securityAlerts}
                  onCheckedChange={() => handleToggle("securityAlerts")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="accountUpdates">Account Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Updates about your account changes
                  </p>
                </div>
                <Switch
                  id="accountUpdates"
                  checked={preferences.accountUpdates}
                  onCheckedChange={() => handleToggle("accountUpdates")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Marketing & Promotions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive marketing communications via email
                  </p>
                </div>
                <Switch
                  id="marketingEmails"
                  checked={preferences.marketingEmails}
                  onCheckedChange={() => handleToggle("marketingEmails")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="promotionalOffers">Promotional Offers</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about special offers and promotions
                  </p>
                </div>
                <Switch
                  id="promotionalOffers"
                  checked={preferences.promotionalOffers}
                  onCheckedChange={() => handleToggle("promotionalOffers")}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleReset} variant="outline" data-testid="button-reset-notifications">
              Reset to Defaults
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

