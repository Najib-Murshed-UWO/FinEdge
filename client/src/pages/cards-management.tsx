import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { CardsListSection } from "@/components/cards-list-section";

export default function CardsManagement() {
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
            <h1 className="text-xl font-semibold flex-1">Cards Management</h1>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Manage Your Cards</h2>
                <p className="text-muted-foreground">
                  View card details, control spending, and manage card security
                </p>
              </div>

              <CardsListSection />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

