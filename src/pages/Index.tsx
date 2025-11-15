import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthForm from "@/components/AuthForm";
import QuickAddInput from "@/components/QuickAddInput";
import TaskCard from "@/components/TaskCard";
import PomodoroTimer from "@/components/PomodoroTimer";
import StatsCards from "@/components/StatsCards";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface Task {
  id: string;
  title: string;
  category: string;
  priority: string;
  estimated_time: number;
  completed: boolean;
  subtasks: any; // JSON type
  created_at: string;
}
const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();
  useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const {
      data: {
        subscription
      }
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
    const {
      data,
      error
    } = await supabase.from('tasks').select('*').order('created_at', {
      ascending: false
    });
    if (error) {
      console.error('Erro ao carregar tarefas:', error);
    } else {
      setTasks((data || []).map(task => ({
        ...task,
        subtasks: Array.isArray(task.subtasks) ? task.subtasks : []
      })));
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Até logo! 👋",
      description: "Volte sempre!"
    });
  };
  const today = new Date().toDateString();
  const completedToday = tasks.filter(t => t.completed && new Date(t.created_at).toDateString() === today).length;
  const totalTimeToday = tasks.filter(t => t.completed && new Date(t.created_at).toDateString() === today).reduce((acc, t) => acc + (t.estimated_time || 0), 0);
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }
  if (!user) {
    return <AuthForm />;
  }
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  return <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">ALWAYS FOCUSED  </h1>
            
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        {/* Stats */}
        <StatsCards completedToday={completedToday} totalTimeToday={totalTimeToday} currentStreak={3} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Add */}
            <div>
              <h2 className="text-xl font-semibold mb-3">ADICIONAR NOVA TAREFA        </h2>
              <QuickAddInput onTaskAdded={loadTasks} />
            </div>

            {/* Active Tasks */}
            <div>
              <h2 className="text-xl font-semibold mb-3">
                📋 Tarefas Ativas ({activeTasks.length})
              </h2>
              <div className="space-y-3">
                {activeTasks.length === 0 ? <p className="text-center text-muted-foreground py-8">
                    Nenhuma tarefa ativa. Adicione uma acima! ⬆️
                  </p> : activeTasks.map(task => <TaskCard key={task.id} id={task.id} title={task.title} category={task.category} priority={task.priority} estimatedTime={task.estimated_time} completed={task.completed} subtasks={task.subtasks || []} onUpdate={loadTasks} />)}
              </div>
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && <div>
                <h2 className="text-xl font-semibold mb-3">
                  ✓ Concluídas ({completedTasks.length})
                </h2>
                <div className="space-y-3">
                  {completedTasks.slice(0, 5).map(task => <TaskCard key={task.id} id={task.id} title={task.title} category={task.category} priority={task.priority} estimatedTime={task.estimated_time} completed={task.completed} subtasks={task.subtasks || []} onUpdate={loadTasks} />)}
                </div>
              </div>}
          </div>

          {/* Right Column - Pomodoro */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-3">🍅 Pomodoro</h2>
            <PomodoroTimer />
          </div>
        </div>
      </div>
    </div>;
};
export default Index;