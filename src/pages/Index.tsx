import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import AuthForm from "@/components/AuthForm";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import GlassCard from "@/components/GlassCard";
import QuickAddInput from "@/components/QuickAddInput";
import PomodoroTimer from "@/components/PomodoroTimer";
import OverviewTab from "@/components/OverviewTab";
import AnalyticsTab from "@/components/AnalyticsTab";
import CalendarModule from "@/components/CalendarModule";
import BrainDumpButton from "@/components/BrainDumpButton";
import AIAssistant from "@/components/AIAssistant";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  category: string;
  priority: string;
  estimated_time: number;
  completed: boolean;
  subtasks: any;
  created_at: string;
}

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("overview");
  const quickAddRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const shortcuts = [
    {
      key: "n",
      description: "Adicionar nova tarefa",
      action: () => {
        setCurrentTab("overview");
        setTimeout(() => quickAddRef.current?.focus(), 100);
      },
    },
    {
      key: "c",
      description: "Abrir calendário",
      action: () => setCurrentTab("calendar"),
    },
    {
      key: "a",
      description: "Ver estatísticas",
      action: () => setCurrentTab("analytics"),
    },
    {
      key: "v",
      description: "Visão geral",
      action: () => setCurrentTab("overview"),
    },
  ];

  const { ShortcutsHelp } = useKeyboardShortcuts(shortcuts);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar tarefas:", error);
    } else {
      setTasks(
        (data || []).map((task) => ({
          ...task,
          subtasks: Array.isArray(task.subtasks) ? task.subtasks : [],
        }))
      );
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Até logo! 👋",
      description: "Volte sempre!",
    });
  };

  const today = new Date().toDateString();
  const completedToday = tasks.filter(
    (t) => t.completed && new Date(t.created_at).toDateString() === today
  ).length;
  const totalTimeToday = tasks
    .filter((t) => t.completed && new Date(t.created_at).toDateString() === today)
    .reduce((acc, t) => acc + (t.estimated_time || 0), 0);

  const calculateStreak = () => {
    const completedTasks = tasks.filter((t) => t.completed);
    if (completedTasks.length === 0) return 0;

    const tasksByDate = new Map<string, boolean>();
    completedTasks.forEach((task) => {
      const date = new Date(task.created_at).toDateString();
      tasksByDate.set(date, true);
    });

    let streak = 0;
    let currentDate = new Date();

    while (true) {
      const dateStr = currentDate.toDateString();
      if (tasksByDate.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const filteredTasks = selectedCategory
    ? tasks.filter((t) => t.category === selectedCategory)
    : tasks;

  const activeTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={setCurrentTab} 
        onLogout={handleLogout}
      />

      {/* Main Content Area with left margin for sidebar */}
      <div className="ml-20 min-h-screen">
        <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-6">
          {/* Header */}
          <DashboardHeader userName="Georg Johnson" />

          {/* Keyboard Shortcuts Help */}
          <ShortcutsHelp />

          {/* Main Content based on current tab */}
          {currentTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Add */}
                <GlassCard>
                  <h2 className="text-xl font-bold mb-4">Adicionar Nova Tarefa</h2>
                  <QuickAddInput onTaskAdded={loadTasks} inputRef={quickAddRef} />
                </GlassCard>

                {/* Overview Content */}
                <OverviewTab
                  activeTasks={activeTasks}
                  completedTasks={completedTasks}
                  completedToday={completedToday}
                  totalTimeToday={totalTimeToday}
                  currentStreak={currentStreak}
                  onTaskUpdate={loadTasks}
                />
              </div>

              {/* Pomodoro Timer */}
              <div className="lg:col-span-1">
                <GlassCard>
                  <h2 className="text-xl font-bold mb-4">Foco Total</h2>
                  <PomodoroTimer />
                </GlassCard>
              </div>
            </div>
          )}

          {currentTab === "calendar" && (
            <CalendarModule tasks={tasks} />
          )}

          {currentTab === "analytics" && (
            <AnalyticsTab tasks={tasks} />
          )}
        </div>
      </div>

      {/* Floating Buttons */}
      <BrainDumpButton />
      <AIAssistant />
    </div>
  );
};

export default Index;
