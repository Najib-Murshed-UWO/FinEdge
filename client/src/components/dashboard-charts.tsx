import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, LineChart } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DashboardChartsProps {
  transactions: Array<{
    date: string;
    amount: number;
    type: "credit" | "debit";
    category?: string;
  }>;
}

export function DashboardCharts({ transactions }: DashboardChartsProps) {
  // Group transactions by month for chart
  const monthlyData = transactions.reduce((acc, txn) => {
    const date = new Date(txn.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = date.toLocaleDateString("en-US", { month: "short" });

    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthLabel, income: 0, expenses: 0 };
    }

    if (txn.type === "credit") {
      acc[monthKey].income += txn.amount;
    } else {
      acc[monthKey].expenses += txn.amount;
    }

    return acc;
  }, {} as Record<string, { month: string; income: number; expenses: number }>);

  const chartData = Object.values(monthlyData).slice(-6); // Last 6 months

  // Category breakdown
  const categoryData = transactions.reduce((acc, txn) => {
    if (txn.type === "debit" && txn.category) {
      acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const chartConfig = {
    income: { label: "Income", color: "hsl(var(--chart-2))" },
    expenses: { label: "Expenses", color: "hsl(var(--chart-1))" },
  };

  const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
  const totalExpenses = chartData.reduce((sum, d) => sum + d.expenses, 0);
  const netChange = totalIncome - totalExpenses;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income vs Expenses</CardTitle>
          <CardDescription>Your financial activity over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                  <span className="text-sm text-muted-foreground">Total Income</span>
                  <span className="text-sm font-semibold text-chart-2">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalIncome)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-chart-1" />
                  <span className="text-sm text-muted-foreground">Total Expenses</span>
                  <span className="text-sm font-semibold text-chart-1">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalExpenses)}
                  </span>
                </div>
              </div>
              <ChartContainer config={chartConfig} className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Net Change</span>
                  <span
                    className={`text-lg font-semibold ${
                      netChange >= 0 ? "text-chart-2" : "text-destructive"
                    }`}
                  >
                    {netChange >= 0 ? "+" : ""}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(netChange)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No data available for chart
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Top expense categories</CardDescription>
        </CardHeader>
        <CardContent>
          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((category, index) => {
                const maxValue = Math.max(...topCategories.map((c) => c.value));
                const percentage = (category.value / maxValue) * 100;
                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-muted-foreground">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(category.value)}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No spending data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

