import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalDetailsSection } from "@/components/personal-details-section";
import { ContactInfoSection } from "@/components/contact-info-section";
import { NotificationPreferencesSection } from "@/components/notification-preferences-section";
import { LanguageRegionSection } from "@/components/language-region-section";
import { PrivacyConsentSection } from "@/components/privacy-consent-section";

type SettingsTab = "personal" | "contact" | "notifications" | "language" | "privacy";

interface AccountSettingsProps {
  initialTab?: SettingsTab;
}

export default function AccountSettings({ initialTab = "personal" }: AccountSettingsProps) {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>(initialTab);

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
            <h1 className="text-xl font-semibold flex-1">Account Settings</h1>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Account Configuration</h2>
                <p className="text-muted-foreground">
                  Manage your personal information, preferences, and privacy settings
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SettingsTab)} className="space-y-6">
                <TabsList data-testid="tabs-account-settings" className="grid w-full grid-cols-5">
                  <TabsTrigger value="personal" data-testid="tab-personal">Personal</TabsTrigger>
                  <TabsTrigger value="contact" data-testid="tab-contact">Contact</TabsTrigger>
                  <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="language" data-testid="tab-language">Language</TabsTrigger>
                  <TabsTrigger value="privacy" data-testid="tab-privacy">Privacy</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6">
                  <PersonalDetailsSection />
                </TabsContent>

                <TabsContent value="contact" className="space-y-6">
                  <ContactInfoSection />
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <NotificationPreferencesSection />
                </TabsContent>

                <TabsContent value="language" className="space-y-6">
                  <LanguageRegionSection />
                </TabsContent>

                <TabsContent value="privacy" className="space-y-6">
                  <PrivacyConsentSection />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

