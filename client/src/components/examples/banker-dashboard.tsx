import BankerDashboard from '@/pages/banker-dashboard';
import { ThemeProvider } from '@/lib/theme-provider';

export default function BankerDashboardExample() {
  return (
    <ThemeProvider>
      <BankerDashboard />
    </ThemeProvider>
  );
}
