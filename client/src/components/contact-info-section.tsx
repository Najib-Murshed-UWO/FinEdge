import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactInfo {
  email: string;
  phone: string;
  alternatePhone?: string;
  mailingAddress: string;
  mailingCity: string;
  mailingState: string;
  mailingZipCode: string;
  mailingCountry: string;
}

// Mock contact info
const mockContactInfo: ContactInfo = {
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  alternatePhone: "+1 (555) 987-6543",
  mailingAddress: "123 Main Street",
  mailingCity: "New York",
  mailingState: "NY",
  mailingZipCode: "10001",
  mailingCountry: "United States",
};

export function ContactInfoSection() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(mockContactInfo);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo({ ...contactInfo, [field]: value });
  };

  const handleSave = () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Mock save - simulate API call
    setTimeout(() => {
      toast({
        title: "Contact information updated",
        description: "Your contact details have been saved successfully.",
      });
      setIsEditing(false);
    }, 500);
  };

  const handleCancel = () => {
    setContactInfo(mockContactInfo);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>Update your contact details and mailing address</CardDescription>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} data-testid="button-edit-contact">
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={!isEditing}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Primary Phone *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  disabled={!isEditing}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alternatePhone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Alternate Phone
                </Label>
                <Input
                  id="alternatePhone"
                  type="tel"
                  value={contactInfo.alternatePhone || ""}
                  onChange={(e) => handleChange("alternatePhone", e.target.value)}
                  disabled={!isEditing}
                  placeholder="+1 (555) 987-6543"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Mailing Address
            </h3>

            <div className="space-y-2">
              <Label htmlFor="mailingAddress">Street Address *</Label>
              <Input
                id="mailingAddress"
                value={contactInfo.mailingAddress}
                onChange={(e) => handleChange("mailingAddress", e.target.value)}
                disabled={!isEditing}
                placeholder="Street address"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="mailingCity">City *</Label>
                <Input
                  id="mailingCity"
                  value={contactInfo.mailingCity}
                  onChange={(e) => handleChange("mailingCity", e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mailingState">State/Province *</Label>
                <Input
                  id="mailingState"
                  value={contactInfo.mailingState}
                  onChange={(e) => handleChange("mailingState", e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mailingZipCode">ZIP/Postal Code *</Label>
                <Input
                  id="mailingZipCode"
                  value={contactInfo.mailingZipCode}
                  onChange={(e) => handleChange("mailingZipCode", e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mailingCountry">Country *</Label>
              <Input
                id="mailingCountry"
                value={contactInfo.mailingCountry}
                onChange={(e) => handleChange("mailingCountry", e.target.value)}
                disabled={!isEditing}
                required
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSave} data-testid="button-save-contact">
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

