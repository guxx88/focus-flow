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
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar tarefas, arquivos, etc..."
            className="w-full h-11 pl-11 pr-4 bg-input/60 border border-border/30 rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all backdrop-blur-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="h-10 w-10 rounded-xl bg-card/40 border border-border/30 flex items-center justify-center hover:bg-card/60 hover:border-primary/30 transition-all backdrop-blur-sm">
            <Bell className="w-4 h-4 text-muted-foreground" />
          </button>
          
          <button className="h-10 px-4 rounded-xl bg-primary/10 border border-primary/30 flex items-center gap-2 hover:bg-primary/20 transition-all backdrop-blur-sm">
            <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-medium text-foreground hidden md:inline">{userName.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* Greeting */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">{getGreeting()},</p>
        <h1 className="text-3xl font-bold text-foreground">{userName}</h1>
      </div>
    </div>
  );
};

export default DashboardHeader;
