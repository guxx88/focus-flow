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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Concluídas Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold bg-gradient-success bg-clip-text text-transparent">
              {completedToday}
            </p>
            <p className="text-xs text-muted-foreground mt-1">tarefas finalizadas</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal" />
              Tempo Focado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold bg-gradient-teal bg-clip-text text-transparent">
              {totalTimeToday}
            </p>
            <p className="text-xs text-muted-foreground mt-1">minutos de foco</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-urgent" />
              Tarefas Restantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold bg-gradient-urgent bg-clip-text text-transparent">
              {activeTasks.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">aguardando conclusão</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              Sequência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {currentStreak}
            </p>
            <p className="text-xs text-muted-foreground mt-1">dias consecutivos</p>
          </CardContent>
        </Card>
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
