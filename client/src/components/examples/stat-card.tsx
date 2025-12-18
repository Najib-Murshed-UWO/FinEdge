import { StatCard } from '../stat-card';
import { Users } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-8 grid gap-4 md:grid-cols-2">
      <StatCard
        title="Total Customers"
        value="1,247"
        icon={Users}
        trend={{ value: "12%", isPositive: true }}
      />
      <StatCard
        title="Pending Approvals"
        value="28"
        icon={Users}
        description="Requires attention"
      />
    </div>
  );
}
