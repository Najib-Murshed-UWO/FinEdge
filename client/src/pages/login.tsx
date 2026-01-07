import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import loginImage from "@assets/generated_images/Login_security_illustration_1d57186c.png";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated, user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "ADMIN" || user.role === "admin") {
        setLocation("/admin/dashboard");
      } else if (user.role === "BANKER" || user.role === "banker") {
        setLocation("/banker/dashboard");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [isAuthenticated, user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(username, password);
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      
      // Redirect based on role (handled by useEffect)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-2 justify-center">
            <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">FE</span>
            </div>
            <span className="font-semibold text-2xl">FinEdge</span>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign in to your account</CardTitle>
              <CardDescription>
                Enter your credentials to access your banking dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    data-testid="input-username"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button type="button" className="text-sm text-primary hover:underline" data-testid="link-forgot-password">
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    data-testid="input-password"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="button-submit-login" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link href="/register">
                  <span className="text-primary hover:underline cursor-pointer" data-testid="link-register">
                    Create one now
                  </span>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Your connection is secure and encrypted</span>
          </div>
        </div>
      </div>

      <div
        className="hidden md:flex items-center justify-center p-8 bg-muted bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url(${loginImage})`,
        }}
      >
        <div className="max-w-md text-center space-y-6">
          <h2 className="text-3xl font-semibold">Welcome Back</h2>
          <p className="text-lg text-muted-foreground">
            Access your accounts, manage transactions, and track your financial goals all in one place
          </p>
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="p-4 rounded-lg bg-background">
              <p className="text-2xl font-bold text-primary">99.8%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="p-4 rounded-lg bg-background">
              <p className="text-2xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
