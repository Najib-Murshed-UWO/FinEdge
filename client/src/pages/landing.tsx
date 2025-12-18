import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingUp, Clock, Users } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/Banking_hero_background_ca495bfe.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">FE</span>
            </div>
            <span className="font-semibold text-lg">FinEdge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" data-testid="button-login">Login</Button>
            </Link>
            <Link href="/register">
              <Button data-testid="button-get-started">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section
        className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImage})`,
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Banking Made Simple & Secure
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90">
            Manage your accounts, process transactions, and apply for loans—all in one platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-hero-signup">
                Open an Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20" data-testid="button-hero-login">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12">Why Choose FinEdge?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Bank-Grade Security</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your data is protected with enterprise-level encryption and multi-factor authentication
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Real-Time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track your spending patterns and financial growth with interactive dashboards
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Instant Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Process deposits, withdrawals, and transfers in real-time with zero delays
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Expert Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get personalized assistance from our team of banking professionals
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of customers who trust FinEdge for their financial needs
          </p>
          <Link href="/register">
            <Button size="lg" data-testid="button-cta-signup">
              Create Your Account Today
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 FinEdge. All rights reserved. FDIC Insured.</p>
        </div>
      </footer>
    </div>
  );
}
