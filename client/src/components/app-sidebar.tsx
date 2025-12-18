import { Home, CreditCard, DollarSign, Users, Settings, BarChart3, FileText, Clock } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserRole = "customer" | "banker" | "admin";

interface AppSidebarProps {
  role: UserRole;
}

const menuItems = {
  customer: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Accounts", url: "/accounts", icon: CreditCard },
    { title: "Transactions", url: "/transactions", icon: DollarSign },
    { title: "Loans", url: "/loans", icon: FileText },
    { title: "Apply for Loan", url: "/apply-loan", icon: Clock },
  ],
  banker: [
    { title: "Dashboard", url: "/banker/dashboard", icon: Home },
    { title: "Customers", url: "/banker/customers", icon: Users },
    { title: "Pending Approvals", url: "/banker/approvals", icon: Clock },
    { title: "Analytics", url: "/banker/analytics", icon: BarChart3 },
  ],
  admin: [
    { title: "Dashboard", url: "/admin/dashboard", icon: Home },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
    { title: "System Logs", url: "/admin/logs", icon: FileText },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ],
};

export function AppSidebar({ role }: AppSidebarProps) {
  const [location] = useLocation();
  const items = menuItems[role];

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-sm">FE</span>
          </div>
          <span className="font-semibold text-lg">FinEdge</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider">
            {role === "customer" ? "My Banking" : role === "banker" ? "Banker Tools" : "Administration"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-active={isActive} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
