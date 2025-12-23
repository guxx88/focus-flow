import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, ListTodo, Flame } from "lucide-react";
import TaskCard from "./TaskCard";

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

interface OverviewTabProps {
  activeTasks: Task[];
  completedTasks: Task[];
  completedToday: number;
  totalTimeToday: number;
  currentStreak: number;
  onTaskUpdate: () => void;
}

export default function OverviewTab({
  activeTasks,
  completedTasks,
  completedToday,
  totalTimeToday,
  currentStreak,
  onTaskUpdate,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">{completedToday}</p>
          <p className="text-sm text-muted-foreground">Concluídas Hoje</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-teal" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">{totalTimeToday}<span className="text-lg text-muted-foreground ml-1">min</span></p>
          <p className="text-sm text-muted-foreground">Tempo Focado</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-urgent/20 flex items-center justify-center">
              <ListTodo className="w-5 h-5 text-urgent" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">{activeTasks.length}</p>
          <p className="text-sm text-muted-foreground">Tarefas Restantes</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground mb-1">{currentStreak}<span className="text-lg text-muted-foreground ml-1">dias</span></p>
          <p className="text-sm text-muted-foreground">Sequência</p>
        </div>
      </div>

      {/* Active Tasks */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-primary" />
          Tarefas Ativas ({activeTasks.length})
        </h2>
        <div className="space-y-3">
          {activeTasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Nenhuma tarefa ativa no momento</p>
              </CardContent>
            </Card>
          ) : (
            activeTasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                category={task.category}
                priority={task.priority}
                estimatedTime={task.estimated_time}
                completed={task.completed}
                subtasks={task.subtasks || []}
                onUpdate={onTaskUpdate}
              />
            ))
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Concluídas ({completedTasks.length})
          </h2>
          <div className="space-y-3">
            {completedTasks.slice(0, 5).map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                category={task.category}
                priority={task.priority}
                estimatedTime={task.estimated_time}
                completed={task.completed}
                subtasks={task.subtasks || []}
                onUpdate={onTaskUpdate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
