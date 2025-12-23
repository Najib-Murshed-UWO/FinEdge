import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import CustomerDashboard from "@/pages/customer-dashboard";
import BankerDashboard from "@/pages/banker-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import LoanApplication from "@/pages/loan-application";
import BillPayments from "@/pages/bill-payments";
import CardsManagement from "@/pages/cards-management";
import AccountSettings from "@/pages/account-settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard">
        {() => <CustomerDashboard />}
      </Route>
      <Route path="/bill-payments">
        {() => <BillPayments />}
      </Route>
      <Route path="/cards" component={CardsManagement} />
      <Route path="/account-settings">
        {() => <AccountSettings />}
      </Route>
      <Route path="/apply-loan" component={LoanApplication} />
      <Route path="/banker/dashboard" component={BankerDashboard} />
      <Route path="/banker/customers" component={BankerDashboard} />
      <Route path="/banker/approvals" component={BankerDashboard} />
      <Route path="/banker/analytics" component={BankerDashboard} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminDashboard} />
      <Route path="/admin/analytics" component={AdminDashboard} />
      <Route path="/admin/logs" component={AdminDashboard} />
      <Route path="/admin/settings" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
