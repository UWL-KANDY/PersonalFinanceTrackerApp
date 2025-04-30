
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">FinanceTrack</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="space-x-2">
              <Button variant="outline" asChild size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-12 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Take Control of Your Finances
          </h2>
          <p className="text-xl text-muted-foreground">
            Track expenses, set budgets, and reach your financial goals with our easy-to-use platform.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            <div className="finance-card text-center p-6">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold">Track Expenses</h3>
              <p className="text-muted-foreground mt-2">
                Easily log and categorize all your transactions in one place.
              </p>
            </div>
            
            <div className="finance-card text-center p-6">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6 7 17l-5-5"/>
                    <path d="m22 10-7.5 7.5L13 16"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold">Set Budgets</h3>
              <p className="text-muted-foreground mt-2">
                Create custom budgets for different categories and track progress.
              </p>
            </div>
            
            <div className="finance-card text-center p-6">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg className="h-6 w-6 text-primary" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold">Achieve Goals</h3>
              <p className="text-muted-foreground mt-2">
                Set savings goals and monitor your progress over time.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 px-6 text-center text-sm text-muted-foreground">
        <p>© 2025 FinanceTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}
