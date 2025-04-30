
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className, variant = "dropdown" }: { className?: string, variant?: "dropdown" | "settings" }) {
  const { theme, setTheme } = useTheme();
  
  if (variant === "settings") {
    const options = [
      { value: "light", label: "Light", icon: Sun },
      { value: "dark", label: "Dark", icon: Moon },
      { value: "system", label: "System", icon: (props: any) => (
        <div className="flex w-[16px] h-[16px] relative">
          <Sun className="h-[1rem] w-[1rem] absolute left-[1px] rotate-0 scale-100" {...props} />
          <Moon className="h-[1rem] w-[1rem] absolute left-[1px] rotate-90 scale-0 dark:rotate-0 dark:scale-100" {...props} />
        </div>
      )},
    ];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {options.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant="outline"
                size="lg"
                className={cn(
                  "flex h-24 flex-col gap-2 justify-center border-2",
                  theme === value ? "border-primary" : "border-border"
                )}
                onClick={() => setTheme(value as "light" | "dark" | "system")}
              >
                {theme === value && (
                  <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                )}
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("h-8 w-8 px-0", className)}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center justify-between"
        >
          Light {theme === "light" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center justify-between"
        >
          Dark {theme === "dark" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center justify-between"
        >
          System {theme === "system" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
