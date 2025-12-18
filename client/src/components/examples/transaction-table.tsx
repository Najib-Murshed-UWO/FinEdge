import { TransactionTable } from '../transaction-table';

const mockTransactions = [
  {
    id: "TXN001",
    date: "2024-11-18",
    description: "Salary Deposit",
    type: "credit" as const,
    amount: 5000,
    balance: 15234.56,
    category: "Income",
  },
  {
    id: "TXN002",
    date: "2024-11-17",
    description: "Grocery Shopping",
    type: "debit" as const,
    amount: 156.78,
    balance: 10234.56,
    category: "Food & Dining",
  },
  {
    id: "TXN003",
    date: "2024-11-16",
    description: "Electric Bill Payment",
    type: "debit" as const,
    amount: 89.50,
    balance: 10391.34,
    category: "Utilities",
  },
];

export default function TransactionTableExample() {
  return (
    <div className="p-8">
      <TransactionTable transactions={mockTransactions} />
    </div>
  );
}
