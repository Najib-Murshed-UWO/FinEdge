import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Users, DollarSign, Activity, Database, Shield, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

//todo: remove mock functionality - Replace with actual data from backend
const mockStats = [
  { title: "Total Users", value: "1,523", icon: Users, trend: { value: "18%", isPositive: true } },
  { title: "Total Deposits", value: "$12.4M", icon: DollarSign, trend: { value: "22%", isPositive: true } },
  { title: "System Uptime", value: "99.8%", icon: Activity, description: "Last 30 days" },
  { title: "Active Sessions", value: "342", icon: Database, trend: { value: "5%", isPositive: true } },
  { title: "Security Alerts", value: "3", icon: Shield, description: "Requires review" },
  { title: "Failed Logins", value: "12", icon: AlertCircle, description: "Last 24 hours" },
];

const mockUsers = [
  { id: "USR001", name: "John Doe", email: "john@example.com", role: "Customer", status: "active", joinDate: "2024-01-15" },
  { id: "USR002", name: "Jane Smith", email: "jane@example.com", role: "Banker", status: "active", joinDate: "2024-02-20" },
  { id: "USR003", name: "Bob Johnson", email: "bob@example.com", role: "Customer", status: "inactive", joinDate: "2024-03-10" },
  { id: "USR004", name: "Alice Brown", email: "alice@example.com", role: "Customer", status: "active", joinDate: "2024-04-05" },
];

const loanPortfolioData = {
  labels: ["Active Loans", "Pending", "Completed", "Rejected"],
  datasets: [
    {
      data: [342, 28, 156, 12],
      backgroundColor: [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-5))",
      ],
      borderWidth: 0,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        padding: 15,
        usePointStyle: true,
      },
    },
  },
};

export default function AdminDashboard() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="admin" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b gap-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="text-xl font-semibold flex-1">Admin Dashboard</h1>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">System Overview</h2>
                <p className="text-muted-foreground">Monitor system health and user management</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockStats.map((stat) => (
                  <StatCard key={stat.title} {...stat} />
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Portfolio Distribution</CardTitle>
                    <CardDescription>Breakdown of all loan applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <Doughnut data={loanPortfolioData} options={chartOptions} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent System Logs</CardTitle>
                    <CardDescription>Latest system activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { time: "2 min ago", message: "New user registration", type: "info" },
                        { time: "15 min ago", message: "Failed login attempt detected", type: "warning" },
                        { time: "1 hour ago", message: "Database backup completed", type: "success" },
                        { time: "2 hours ago", message: "System update installed", type: "info" },
                        { time: "3 hours ago", message: "Large transaction processed", type: "info" },
                      ].map((log, i) => (
                        <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                          <div className={`h-2 w-2 rounded-full mt-2 ${
                            log.type === "warning" ? "bg-chart-4" : 
                            log.type === "success" ? "bg-chart-2" : "bg-chart-1"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{log.message}</p>
                            <p className="text-xs text-muted-foreground">{log.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Join Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockUsers.map((user) => (
                          <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === "active" ? "default" : "secondary"}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(user.joinDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline" data-testid={`button-edit-${user.id}`}>
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
