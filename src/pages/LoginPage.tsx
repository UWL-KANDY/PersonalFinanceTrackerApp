import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

const LoginPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background">
      <div className={`${isMobile ? 'top-2 right-2' : 'top-4 right-4'} absolute`}>
        <ThemeToggle />
      </div>
      <div className="mb-8 flex items-center gap-2">
      <img
          src="/public/logo.png"
          alt="FinanceFlow Logo"
          className="h-10 w-10"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-finance-blue-dark dark:text-finance-blue">FinanceFlow</h1>
      </div>
      <div className="w-full max-w-md px-4">
        <div className="bg-card p-4 md:p-8 rounded-lg shadow-md border border-border">
          {/* <LoginForm /> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

