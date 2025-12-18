import { LoanCard } from '../loan-card';

export default function LoanCardExample() {
  return (
    <div className="p-8 max-w-md">
      <LoanCard
        loanId="LOAN001"
        loanType="Home Loan"
        amount={250000}
        interestRate={7.5}
        tenure={240}
        monthlyEMI={2012.50}
        amountPaid={50000}
        status="active"
      />
    </div>
  );
}
