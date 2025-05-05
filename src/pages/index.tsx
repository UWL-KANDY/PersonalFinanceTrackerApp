import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useSession } from "@/contexts/SessionContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useSession();
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
          <img
          src="/public/logo.png"
          alt="FinanceFlow Logo"
          className="h-10 w-10"
        />
            <span className="font-bold text-xl">FinanceFlow</span>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={() => navigate('/login')}>Log in</Button>
            <Button onClick={() => navigate('/register')}>Sign up</Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-background">
          <div className="container text-center space-y-6 md:space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Manage your finances with ease
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Track expenses, set budgets, and reach your financial goals with our user-friendly platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/register')}>Get Started</Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                Log In
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container space-y-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10 text-finance-blue"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                  <line x1="3" x2="21" y1="9" y2="9"></line>
                  <line x1="9" x2="9" y1="21" y2="9"></line>
                </svg>
                <h3 className="text-2xl font-semibold">Expense Tracking</h3>
                <p className="text-muted-foreground">Easily record and categorize your daily expenses.</p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10 text-finance-blue"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" x2="12" y1="2" y2="22"></line>
                  <path d="M16.24 7.76a6 6 0 0 1 0 8.49"></path>
                  <path d="M7.76 7.76a6 6 0 0 0 0 8.49"></path>
                </svg>
                <h3 className="text-2xl font-semibold">Budgeting Tools</h3>
                <p className="text-muted-foreground">Create budgets and monitor your spending habits.</p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10 text-finance-blue"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h3"></path>
                </svg>
                <h3 className="text-2xl font-semibold">Savings Goals</h3>
                <p className="text-muted-foreground">Set and track your savings goals to achieve financial milestones.</p>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to take control of your finances?</h2>
              <p className="text-lg text-muted-foreground mb-6">Join FinanceFlow today and start your journey to financial freedom.</p>
              <Button size="lg" onClick={() => navigate('/register')}>Sign Up Now</Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section (Optional) */}
        {/* <section className="py-12 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <p className="text-muted-foreground italic">"FinanceFlow has transformed the way I manage my money. It's simple, intuitive, and effective!"</p>
                <p className="font-semibold mt-4">- Jane Doe</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <p className="text-muted-foreground italic">"I love the budgeting tools! They've helped me save more money than ever before."</p>
                <p className="font-semibold mt-4">- John Smith</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <p className="text-muted-foreground italic">"The expense tracking feature is a game-changer. I now know exactly where my money is going."</p>
                <p className="font-semibold mt-4">- Alice Johnson</p>
              </div>
            </div>
          </div>
        </section> */}
        
        {/* FAQ Section (Optional) */}
        {/* <section className="py-12 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-card p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold">Is FinanceFlow free to use?</h3>
                <p className="text-muted-foreground">Yes, FinanceFlow offers a free plan with basic features. We also have premium plans with advanced features for power users.</p>
              </div>
              <div className="bg-card p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold">How secure is my financial data?</h3>
                <p className="text-muted-foreground">We use industry-leading security measures to protect your data. Your information is encrypted and stored securely.</p>
              </div>
              <div className="bg-card p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold">Can I access FinanceFlow on my mobile device?</h3>
                <p className="text-muted-foreground">Yes, FinanceFlow is fully responsive and works on all devices. We also have native mobile apps for iOS and Android.</p>
              </div>
            </div>
          </div>
        </section> */}
        
        {/* Footer or Additional Links */}
        <section className="py-8 border-t border-border">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">© 2025 FinanceFlow. All rights reserved.</p>
              <div className="flex gap-4">
                <Link to="/api-docs" className="text-sm text-muted-foreground hover:text-foreground">
                  API Documentation
                </Link>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
