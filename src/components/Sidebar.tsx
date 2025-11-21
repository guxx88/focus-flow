import { Home, BarChart3, Calendar, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ currentTab, onTabChange, onLogout }: SidebarProps) => {
  const navItems = [
    { id: "overview", icon: Home, label: "Visão Geral" },
    { id: "calendar", icon: Calendar, label: "Calendário" },
    { id: "analytics", icon: BarChart3, label: "Estatísticas" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-sidebar border-r border-border/30 flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-8 w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
        <div className="w-6 h-6 rounded-lg bg-white/20" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full h-14 rounded-2xl flex items-center justify-center transition-all group relative",
                isActive
                  ? "bg-primary/20 text-primary shadow-md"
                  : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-2 bg-popover border border-border rounded-xl text-sm whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2 w-full px-3">
        <button
          className="w-full h-14 rounded-2xl flex items-center justify-center text-muted-foreground hover:bg-sidebar-hover hover:text-foreground transition-all group relative"
        >
          <HelpCircle className="w-5 h-5" />
          <div className="absolute left-full ml-4 px-3 py-2 bg-popover border border-border rounded-xl text-sm whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg">
            Atalhos (?)
          </div>
        </button>
        
        <button
          onClick={onLogout}
          className="w-full h-14 rounded-2xl flex items-center justify-center text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all group relative"
        >
          <LogOut className="w-5 h-5" />
          <div className="absolute left-full ml-4 px-3 py-2 bg-popover border border-border rounded-xl text-sm whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg">
            Sair
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
