import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName?: string;
}

const DashboardHeader = ({ userName = "Usuário" }: DashboardHeaderProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="glass rounded-3xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-foreground/90 mb-1">Dashboard</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefa, pasta, etc..."
              className="pl-10 bg-input/50 border-border/30 focus:bg-input/80 transition-all"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Bell className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3 pl-3 border-l border-border/30">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-foreground">{userName}</div>
              <div className="text-xs text-muted-foreground">usuario@example.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">{getGreeting()},</p>
        <h2 className="text-3xl font-bold text-foreground">{userName}</h2>
      </div>
    </div>
  );
};

export default DashboardHeader;
