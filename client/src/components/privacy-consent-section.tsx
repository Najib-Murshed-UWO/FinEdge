import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, Eye, Database, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrivacyConsentSettings {
  dataSharing: boolean;
  analyticsTracking: boolean;
  personalizedAds: boolean;
  thirdPartySharing: boolean;
  biometricAuth: boolean;
  locationTracking: boolean;
}

// Mock privacy & consent settings
const mockPrivacySettings: PrivacyConsentSettings = {
  dataSharing: true,
  analyticsTracking: true,
  personalizedAds: false,
  thirdPartySharing: false,
  biometricAuth: true,
  locationTracking: false,
};

export function PrivacyConsentSection() {
  const [settings, setSettings] = useState<PrivacyConsentSettings>(mockPrivacySettings);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleToggle = (key: keyof PrivacyConsentSettings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = () => {
    // Mock save - simulate API call
    setTimeout(() => {
      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved successfully.",
      });
    }, 500);
  };

  const handleRequestData = () => {
    toast({
      title: "Data request submitted",
      description: "Your data export request has been submitted. You will receive an email with your data within 7 business days.",
    });
  };

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(false);
    toast({
      title: "Account deletion requested",
      description: "Your account deletion request has been submitted. You will receive a confirmation email shortly.",
      variant: "destructive",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Consent Management
              </CardTitle>
              <CardDescription>Control your data privacy and consent preferences</CardDescription>
            </div>
            <Button onClick={handleSave} data-testid="button-save-privacy">
              Save Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Database className="h-4 w-4" />
                Data Sharing & Usage
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="dataSharing">Data Sharing for Services</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow sharing of anonymized data to improve our services
                    </p>
                  </div>
                  <Switch
                    id="dataSharing"
                    checked={settings.dataSharing}
                    onCheckedChange={() => handleToggle("dataSharing")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="analyticsTracking">Analytics Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Help us understand how you use our platform
                    </p>
                  </div>
                  <Switch
                    id="analyticsTracking"
                    checked={settings.analyticsTracking}
                    onCheckedChange={() => handleToggle("analyticsTracking")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="personalizedAds">Personalized Advertising</Label>
                    <p className="text-sm text-muted-foreground">
                      Show ads based on your interests and activity
                    </p>
                  </div>
                  <Switch
                    id="personalizedAds"
                    checked={settings.personalizedAds}
                    onCheckedChange={() => handleToggle("personalizedAds")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="thirdPartySharing">Third-Party Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Share data with trusted third-party partners
                    </p>
                  </div>
                  <Switch
                    id="thirdPartySharing"
                    checked={settings.thirdPartySharing}
                    onCheckedChange={() => handleToggle("thirdPartySharing")}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security & Authentication
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="biometricAuth">Biometric Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Use fingerprint or face recognition for login
                    </p>
                  </div>
                  <Switch
                    id="biometricAuth"
                    checked={settings.biometricAuth}
                    onCheckedChange={() => handleToggle("biometricAuth")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="locationTracking">Location Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow location tracking for security and fraud prevention
                    </p>
                  </div>
                  <Switch
                    id="locationTracking"
                    checked={settings.locationTracking}
                    onCheckedChange={() => handleToggle("locationTracking")}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Data Management
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Your Data
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Request a copy of all your personal data
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleRequestData}
                    data-testid="button-download-data"
                  >
                    Request Data
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20 bg-destructive/5">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2 text-destructive">
                      <Shield className="h-4 w-4" />
                      Delete Account
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    data-testid="button-delete-account"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-medium mb-2">Your Privacy Rights</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>You have the right to access, update, or delete your personal information</li>
                <li>You can opt-out of data sharing and marketing communications at any time</li>
                <li>Your data is protected by industry-standard security measures</li>
                <li>We comply with GDPR, CCPA, and other privacy regulations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Shield className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all
              your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
              <p className="text-sm font-medium text-destructive mb-2">What will be deleted:</p>
              <ul className="text-sm text-destructive/90 space-y-1 list-disc list-inside">
                <li>All account information and personal data</li>
                <li>Transaction history and records</li>
                <li>Saved preferences and settings</li>
                <li>All associated cards and accounts</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

