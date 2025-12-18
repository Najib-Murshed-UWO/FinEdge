import CustomerDashboard from '@/pages/customer-dashboard';
import { ThemeProvider } from '@/lib/theme-provider';

export default function CustomerDashboardExample() {
  return (
    <ThemeProvider>
      <CustomerDashboard />
    </ThemeProvider>
  );
}
