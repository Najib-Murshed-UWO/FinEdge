import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
        {() => (
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/bill-payments">
        {() => (
          <ProtectedRoute>
            <BillPayments />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/cards">
        {() => (
          <ProtectedRoute>
            <CardsManagement />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/account-settings">
        {() => (
          <ProtectedRoute>
            <AccountSettings />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/apply-loan">
        {() => (
          <ProtectedRoute>
            <LoanApplication />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/banker/dashboard">
        {() => (
          <ProtectedRoute allowedRoles={["banker", "admin"]}>
            <BankerDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/banker/customers">
        {() => (
          <ProtectedRoute allowedRoles={["banker", "admin"]}>
            <BankerDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/banker/approvals">
        {() => (
          <ProtectedRoute allowedRoles={["banker", "admin"]}>
            <BankerDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/banker/analytics">
        {() => (
          <ProtectedRoute allowedRoles={["banker", "admin"]}>
            <BankerDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/dashboard">
        {() => (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/users">
        {() => (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/analytics">
        {() => (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/logs">
        {() => (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/settings">
        {() => (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        )}
      </Route>
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
