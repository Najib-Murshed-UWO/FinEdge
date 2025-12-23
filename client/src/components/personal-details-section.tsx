import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { User, Calendar, MapPin, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PersonalDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Mock personal details
const mockPersonalDetails: PersonalDetails = {
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1990-05-15",
  gender: "male",
  occupation: "Software Engineer",
  address: "123 Main Street",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  country: "United States",
};

export function PersonalDetailsSection() {
  const [details, setDetails] = useState<PersonalDetails>(mockPersonalDetails);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: keyof PersonalDetails, value: string) => {
    setDetails({ ...details, [field]: value });
  };

  const handleSave = () => {
    // Mock save - simulate API call
    setTimeout(() => {
      toast({
        title: "Personal details updated",
        description: "Your personal information has been saved successfully.",
      });
      setIsEditing(false);
    }, 500);
  };

  const handleCancel = () => {
    setDetails(mockPersonalDetails);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Details
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} data-testid="button-edit-personal">
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={details.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                disabled={!isEditing}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={details.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                disabled={!isEditing}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date of Birth *
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={details.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                disabled={!isEditing}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={details.gender}
                onValueChange={(value) => handleChange("gender", value)}
                disabled={!isEditing}
              >
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Occupation
            </Label>
            <Input
              id="occupation"
              value={details.occupation}
              onChange={(e) => handleChange("occupation", e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your occupation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address *
            </Label>
            <Input
              id="address"
              value={details.address}
              onChange={(e) => handleChange("address", e.target.value)}
              disabled={!isEditing}
              placeholder="Street address"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={details.city}
                onChange={(e) => handleChange("city", e.target.value)}
                disabled={!isEditing}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province *</Label>
              <Input
                id="state"
                value={details.state}
                onChange={(e) => handleChange("state", e.target.value)}
                disabled={!isEditing}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
              <Input
                id="zipCode"
                value={details.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
                disabled={!isEditing}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Select
              value={details.country}
              onValueChange={(value) => handleChange("country", value)}
              disabled={!isEditing}
            >
              <SelectTrigger id="country">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSave} data-testid="button-save-personal">
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

