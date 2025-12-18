import { AccountCard } from '../account-card';

export default function AccountCardExample() {
  return (
    <div className="p-8 max-w-md">
      <AccountCard
        accountName="Primary Checking"
        accountNumber="ACC123456789"
        accountType="Checking"
        balance={15234.56}
      />
    </div>
  );
}
