import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthForm from "@/components/AuthForm";
import QuickAddInput from "@/components/QuickAddInput";
import PomodoroTimer from "@/components/PomodoroTimer";
import OverviewTab from "@/components/OverviewTab";
import AnalyticsTab from "@/components/AnalyticsTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Home, BarChart3 } from "lucide-react";
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
  const { toast } = useToast();

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
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">
            ALWAYS FOCUSED
          </h1>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="overview" className="gap-2">
              <Home className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Estatísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Add */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Adicionar Nova Tarefa</h2>
                  <QuickAddInput onTaskAdded={loadTasks} />
                </div>

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
                <h2 className="text-xl font-bold mb-4">Foco Total</h2>
                <PomodoroTimer />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab tasks={tasks} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
