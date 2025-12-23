import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LanguageRegionSettings {
  language: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  timezone: string;
}

// Mock language & region settings
const mockSettings: LanguageRegionSettings = {
  language: "en-US",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12h",
  currency: "USD",
  timezone: "America/New_York",
};

const languages = [
  { value: "en-US", label: "English (United States)" },
  { value: "en-GB", label: "English (United Kingdom)" },
  { value: "es-ES", label: "Español (España)" },
  { value: "fr-FR", label: "Français (France)" },
  { value: "de-DE", label: "Deutsch (Deutschland)" },
  { value: "zh-CN", label: "中文 (简体)" },
  { value: "ja-JP", label: "日本語" },
];

const dateFormats = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (12/31/2024)" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (31/12/2024)" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2024-12-31)" },
];

const timeFormats = [
  { value: "12h", label: "12-hour (3:45 PM)" },
  { value: "24h", label: "24-hour (15:45)" },
];

const currencies = [
  { value: "USD", label: "USD - US Dollar ($)" },
  { value: "EUR", label: "EUR - Euro (€)" },
  { value: "GBP", label: "GBP - British Pound (£)" },
  { value: "JPY", label: "JPY - Japanese Yen (¥)" },
  { value: "CAD", label: "CAD - Canadian Dollar (C$)" },
  { value: "AUD", label: "AUD - Australian Dollar (A$)" },
];

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona Time (MST)" },
  { value: "America/Anchorage", label: "Alaska Time (AKST)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
];

export function LanguageRegionSection() {
  const [settings, setSettings] = useState<LanguageRegionSettings>(mockSettings);
  const { toast } = useToast();

  const handleChange = (field: keyof LanguageRegionSettings, value: string) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = () => {
    // Mock save - simulate API call
    setTimeout(() => {
      toast({
        title: "Language & region settings updated",
        description: "Your preferences have been saved successfully.",
      });
    }, 500);
  };

  const handleReset = () => {
    setSettings(mockSettings);
    toast({
      title: "Settings reset",
      description: "Language & region settings have been reset to defaults.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language & Region
            </CardTitle>
            <CardDescription>Customize your language, date, and regional preferences</CardDescription>
          </div>
          <Button onClick={handleSave} data-testid="button-save-language">
            Save Changes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="language" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Language *
            </Label>
            <Select
              value={settings.language}
              onValueChange={(value) => handleChange("language", value)}
            >
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="dateFormat" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Format *
              </Label>
              <Select
                value={settings.dateFormat}
                onValueChange={(value) => handleChange("dateFormat", value)}
              >
                <SelectTrigger id="dateFormat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeFormat">Time Format *</Label>
              <Select
                value={settings.timeFormat}
                onValueChange={(value) => handleChange("timeFormat", value)}
              >
                <SelectTrigger id="timeFormat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="currency" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Currency *
              </Label>
              <Select
                value={settings.currency}
                onValueChange={(value) => handleChange("currency", value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone *</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => handleChange("timezone", value)}
              >
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleReset} variant="outline" data-testid="button-reset-language">
              Reset to Defaults
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

