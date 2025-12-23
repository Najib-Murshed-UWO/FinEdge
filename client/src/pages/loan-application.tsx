import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { EMICalculator } from "@/components/emi-calculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function LoanApplication() {
  const [loanType, setLoanType] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [emiValues, setEmiValues] = useState<{ amount: number; rate: number; tenure: number; emi: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanType || !amount) {
      toast({
        title: "Missing information",
        description: "Please select a loan type and enter the requested amount.",
        variant: "destructive",
      });
      return;
    }
    
    // Mock submission - simulate API call
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Application submitted",
        description: "Your loan application has been submitted for review.",
      });
      setAmount("");
      setPurpose("");
      setLoanType("");
      setIsSubmitting(false);
      navigate("/loans");
    }, 1000);
  };

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="customer" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b gap-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="text-xl font-semibold flex-1">Apply for Loan</h1>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">Loan Application</h2>
                    <p className="text-muted-foreground">Fill out the form to apply for a loan</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Application Details</CardTitle>
                      <CardDescription>Provide information about your loan requirements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="loanType">Loan Type</Label>
                          <Select value={loanType} onValueChange={setLoanType}>
                            <SelectTrigger id="loanType" data-testid="select-loan-type">
                              <SelectValue placeholder="Select loan type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="personal">Personal Loan</SelectItem>
                              <SelectItem value="home">Home Loan</SelectItem>
                              <SelectItem value="auto">Auto Loan</SelectItem>
                              <SelectItem value="education">Education Loan</SelectItem>
                              <SelectItem value="business">Business Loan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="amount">Requested Amount</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            data-testid="input-loan-amount"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="purpose">Loan Purpose</Label>
                          <Textarea
                            id="purpose"
                            placeholder="Describe the purpose of this loan"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            rows={4}
                            data-testid="textarea-loan-purpose"
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          data-testid="button-submit-application"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Application"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                <EMICalculator
                  initialAmount={amount ? parseFloat(amount) : undefined}
                  onValuesChange={setEmiValues}
                />
                {emiValues && emiValues.emi > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Estimated Loan Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly EMI:</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(emiValues.emi)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Interest:</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(emiValues.emi * emiValues.tenure - emiValues.amount)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
