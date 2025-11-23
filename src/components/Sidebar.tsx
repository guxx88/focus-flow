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
    <div className="fixed left-0 top-0 h-screen w-20 bg-gradient-sidebar border-r border-border/30 flex flex-col items-center py-8 z-50 shadow-lg">
      {/* Logo */}
      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-10 shadow-button">
        <div className="w-6 h-6 rounded-lg bg-white/90" />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-3 w-full px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full h-14 rounded-xl flex items-center justify-center transition-all duration-base relative group",
              currentTab === item.id
                ? "bg-primary text-primary-foreground shadow-button scale-105"
                : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground hover:scale-105"
            )}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
            {currentTab === item.id && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-3 w-full px-3">
        <button
          className="w-full h-14 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-sidebar-hover hover:text-foreground transition-all duration-base hover:scale-105"
          title="Ajuda"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        
        <button
          onClick={onLogout}
          className="w-full h-14 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all duration-base hover:scale-105"
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
