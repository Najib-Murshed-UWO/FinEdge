import AdminDashboard from '@/pages/admin-dashboard';
import { ThemeProvider } from '@/lib/theme-provider';

export default function AdminDashboardExample() {
  return (
    <ThemeProvider>
      <AdminDashboard />
    </ThemeProvider>
  );
}
