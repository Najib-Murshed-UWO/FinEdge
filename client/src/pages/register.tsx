import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link, useLocation } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    address: "",
  });

  const progress = (step / 3) * 100;

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }
      
      setIsLoading(true);
      try {
        await authAPI.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: "customer",
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
        });
        
        toast({
          title: "Success",
          description: "Account created successfully",
        });
        
        setLocation("/dashboard");
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to create account",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-2 justify-center">
          <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">FE</span>
          </div>
          <span className="font-semibold text-2xl">FinEdge</span>
        </div>

        <Card>
          <CardHeader className="space-y-4">
            <div>
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>
                Step {step} of 3: {step === 1 ? "Account Details" : step === 2 ? "Personal Information" : "Address & Verification"}
              </CardDescription>
            </div>
            <Progress value={progress} data-testid="progress-registration" />
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNext} className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                      data-testid="input-username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      data-testid="input-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      data-testid="input-confirm-password"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      data-testid="input-fullname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      data-testid="input-phone"
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Enter your full address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      data-testid="input-address"
                    />
                  </div>
                  <div className="rounded-lg bg-muted p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Account Security</p>
                        <p className="text-sm text-muted-foreground">Your account will be protected with bank-grade encryption</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">FDIC Insured</p>
                        <p className="text-sm text-muted-foreground">All deposits are insured up to $250,000</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={handleBack} className="flex-1" data-testid="button-back">
                    Back
                  </Button>
                )}
                <Button type="submit" className="flex-1" data-testid="button-next" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : step === 3 ? "Complete Registration" : "Next"}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login">
                <span className="text-primary hover:underline cursor-pointer" data-testid="link-login">
                  Sign in instead
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
