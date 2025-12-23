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
    <div className="fixed left-0 top-0 h-screen w-20 bg-sidebar/90 backdrop-blur-xl border-r border-white/[0.06] flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-8 shadow-button">
        <div className="w-5 h-5 rounded-md bg-white/90" />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full h-12 rounded-xl flex items-center justify-center transition-all duration-200 relative",
              currentTab === item.id
                ? "bg-primary text-primary-foreground shadow-button"
                : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
            )}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2 w-full px-3">
        <button
          className="w-full h-12 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-white/[0.06] hover:text-foreground transition-all"
          title="Ajuda"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        
        <button
          onClick={onLogout}
          className="w-full h-12 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all"
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
