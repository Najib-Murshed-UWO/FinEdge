import LoanApplication from '@/pages/loan-application';
import { ThemeProvider } from '@/lib/theme-provider';

export default function LoanApplicationExample() {
  return (
    <ThemeProvider>
      <LoanApplication />
    </ThemeProvider>
  );
}
