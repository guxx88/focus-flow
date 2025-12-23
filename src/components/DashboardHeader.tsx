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
    <div className="flex items-center justify-between gap-6">
      {/* Left: Greeting */}
      <div>
        <p className="text-sm text-muted-foreground">{getGreeting()},</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{userName}</h1>
      </div>

      {/* Right: Search and Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar..."
            className="w-56 h-10 pl-10 pr-4 bg-secondary/50 border border-white/[0.08] rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="h-10 w-10 rounded-xl bg-secondary/50 border border-white/[0.08] flex items-center justify-center hover:bg-secondary/80 transition-all">
          <Bell className="w-4 h-4 text-muted-foreground" />
        </button>
        
        {/* User */}
        <button className="h-10 px-3 rounded-xl bg-secondary/50 border border-white/[0.08] flex items-center gap-2 hover:bg-secondary/80 transition-all">
          <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-semibold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-foreground hidden lg:inline">{userName.split(' ')[0]}</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
