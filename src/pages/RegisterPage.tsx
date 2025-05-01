import { ThemeToggle } from "@/components/theme/ThemeToggle";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="mb-8 flex items-center gap-2">
      <img
          src="/public/logo.png"
          alt="FinanceFlow Logo"
          className="h-10 w-10"
        />
        <h1 className="text-3xl font-bold text-finance-blue-dark dark:text-finance-blue">FinanceFlow</h1>
      </div>
      <div className="w-full max-w-md">
        <div className="bg-card p-8 rounded-lg shadow-md border border-border">
        RegisterForm
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
