import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Users, DollarSign, Clock, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, LineChart } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

//todo: remove mock functionality - Replace with actual data from backend
const mockStats = [
  { title: "Total Customers", value: "1,247", icon: Users, trend: { value: "12%", isPositive: true } },
  { title: "Active Loans", value: "342", icon: DollarSign, trend: { value: "8%", isPositive: true } },
  { title: "Pending Approvals", value: "28", icon: Clock, description: "Requires attention" },
  { title: "Monthly Revenue", value: "$458K", icon: TrendingUp, trend: { value: "15%", isPositive: true } },
];

const mockApprovals = [
  { id: "APP001", customer: "Alice Johnson", type: "Home Loan", amount: 350000, date: "2024-11-18", status: "pending" },
  { id: "APP002", customer: "Bob Smith", type: "Personal Loan", amount: 25000, date: "2024-11-18", status: "pending" },
  { id: "APP003", customer: "Carol White", type: "Auto Loan", amount: 45000, date: "2024-11-17", status: "pending" },
];

const chartDataMonthly = [
  { month: "Jan", revenue: 320000, customers: 1050 },
  { month: "Feb", revenue: 342000, customers: 1089 },
  { month: "Mar", revenue: 365000, customers: 1125 },
  { month: "Apr", revenue: 390000, customers: 1168 },
  { month: "May", revenue: 415000, customers: 1203 },
  { month: "Jun", revenue: 458000, customers: 1247 },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
  customers: { label: "Customers", color: "hsl(var(--chart-2))" },
};

export default function BankerDashboard() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  const handleApprove = (id: string) => {
    console.log("Approved:", id);
    //todo: remove mock functionality
  };

  const handleReject = (id: string) => {
    console.log("Rejected:", id);
    //todo: remove mock functionality
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar role="banker" />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b gap-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <h1 className="text-xl font-semibold flex-1">Banker Dashboard</h1>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Overview</h2>
                <p className="text-muted-foreground">Monitor customer activity and pending approvals</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {mockStats.map((stat) => (
                  <StatCard key={stat.title} {...stat} />
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Revenue</CardTitle>
                    <CardDescription>Revenue trends over the past 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartDataMonthly}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="month" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Growth</CardTitle>
                    <CardDescription>Customer acquisition over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartDataMonthly}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="month" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="customers" 
                            stroke="var(--color-customers)" 
                            strokeWidth={2}
                            dot={{ fill: "var(--color-customers)" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Loan Approvals</CardTitle>
                  <CardDescription>Review and approve customer loan applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Application ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Loan Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockApprovals.map((approval) => (
                          <TableRow key={approval.id} data-testid={`row-approval-${approval.id}`}>
                            <TableCell className="font-medium">{approval.id}</TableCell>
                            <TableCell>{approval.customer}</TableCell>
                            <TableCell>{approval.type}</TableCell>
                            <TableCell>
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(approval.amount)}
                            </TableCell>
                            <TableCell>
                              {new Date(approval.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">Pending</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApprove(approval.id)}
                                  data-testid={`button-approve-${approval.id}`}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1 text-chart-2" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(approval.id)}
                                  data-testid={`button-reject-${approval.id}`}
                                >
                                  <XCircle className="h-4 w-4 mr-1 text-destructive" />
                                  Reject
                                </Button>
                              </div>
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
