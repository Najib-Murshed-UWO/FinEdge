import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(24);
  const [emi, setEmi] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenure]);

  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;
    const months = tenure;

    if (ratePerMonth === 0) {
      const calculatedEMI = principal / months;
      setEmi(calculatedEMI);
      setTotalAmount(principal);
      setTotalInterest(0);
    } else {
      const calculatedEMI =
        (principal * ratePerMonth * Math.pow(1 + ratePerMonth, months)) /
        (Math.pow(1 + ratePerMonth, months) - 1);
      const total = calculatedEMI * months;
      const interest = total - principal;

      setEmi(calculatedEMI);
      setTotalAmount(total);
      setTotalInterest(interest);
    }
  };

  return (
    <Card data-testid="card-emi-calculator">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>EMI Calculator</CardTitle>
        </div>
        <CardDescription>
          Calculate your monthly loan payments with our EMI calculator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Loan Amount</Label>
            <span className="text-sm font-medium" data-testid="text-loan-amount">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(loanAmount)}
            </span>
          </div>
          <Slider
            value={[loanAmount]}
            onValueChange={(value) => setLoanAmount(value[0])}
            min={10000}
            max={1000000}
            step={10000}
            data-testid="slider-loan-amount"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Interest Rate (% per annum)</Label>
            <span className="text-sm font-medium" data-testid="text-interest-rate">{interestRate}%</span>
          </div>
          <Slider
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
            min={1}
            max={20}
            step={0.1}
            data-testid="slider-interest-rate"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Loan Tenure (months)</Label>
            <span className="text-sm font-medium" data-testid="text-tenure">{tenure} months</span>
          </div>
          <Slider
            value={[tenure]}
            onValueChange={(value) => setTenure(value[0])}
            min={6}
            max={360}
            step={6}
            data-testid="slider-tenure"
          />
        </div>

        <div className="rounded-lg bg-primary/10 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Monthly EMI</span>
            <span className="text-2xl font-bold text-primary" data-testid="text-emi-result">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(emi)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Amount Payable</span>
            <span className="font-semibold" data-testid="text-total-amount">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(totalAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Interest</span>
            <span className="font-semibold" data-testid="text-total-interest">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(totalInterest)}
            </span>
          </div>
        </div>

        <Button className="w-full" data-testid="button-apply-loan">
          Apply for This Loan
        </Button>
      </CardContent>
    </Card>
  );
}
