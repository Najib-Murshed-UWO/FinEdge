import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillersSection } from "@/components/billers-section";
import { PaymentHistorySection } from "@/components/payment-history-section";
import { RemindersSection } from "@/components/reminders-section";
import { AutoPaySection } from "@/components/autopay-section";

type BillPaymentsTab = "billers" | "payments" | "reminders" | "autopay";

interface BillPaymentsProps {
  initialTab?: BillPaymentsTab;
}

export default function BillPayments({ initialTab = "billers" }: BillPaymentsProps) {
  const [activeTab, setActiveTab] = React.useState<BillPaymentsTab>(initialTab);

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="customer" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b gap-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="text-xl font-semibold flex-1">Bill Payments</h1>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Manage Your Bills</h2>
                <p className="text-muted-foreground">Pay bills, set up reminders, and automate payments</p>
              </div>

              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BillPaymentsTab)} className="space-y-6">
                <TabsList data-testid="tabs-bill-payments">
                  <TabsTrigger value="billers" data-testid="tab-billers">Billers</TabsTrigger>
                  <TabsTrigger value="payments" data-testid="tab-payments">Payment History</TabsTrigger>
                  <TabsTrigger value="reminders" data-testid="tab-reminders">Reminders</TabsTrigger>
                  <TabsTrigger value="autopay" data-testid="tab-autopay">Auto-Pay</TabsTrigger>
                </TabsList>

                <TabsContent value="billers" className="space-y-6">
                  <BillersSection />
                </TabsContent>

                <TabsContent value="payments" className="space-y-6">
                  <PaymentHistorySection />
                </TabsContent>

                <TabsContent value="reminders" className="space-y-6">
                  <RemindersSection />
                </TabsContent>

                <TabsContent value="autopay" className="space-y-6">
                  <AutoPaySection />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

