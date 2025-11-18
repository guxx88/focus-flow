import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { format, isSameDay } from "date-fns";

interface Task {
  id: string;
  title: string;
  category: string;
  priority: string;
  estimated_time: number;
  completed: boolean;
  created_at: string;
}

interface CalendarModuleProps {
  tasks: Task[];
}

const CalendarModule = ({ tasks }: CalendarModuleProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => 
      isSameDay(new Date(task.created_at), date)
    );
  };

  const getDateStats = (date: Date) => {
    const dateTasks = getTasksForDate(date);
    return {
      total: dateTasks.length,
      completed: dateTasks.filter(t => t.completed).length,
    };
  };

  const selectedDateTasks = getTasksForDate(selectedDate);
  const stats = getDateStats(selectedDate);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      trabalho: "bg-primary/20 text-primary border-primary/30",
      pessoal: "bg-secondary/20 text-secondary-foreground border-secondary/30",
      estudos: "bg-accent/20 text-accent-foreground border-accent/30",
      saude: "bg-muted text-muted-foreground border-muted-foreground/30",
    };
    return colors[category.toLowerCase()] || "bg-muted text-muted-foreground";
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      alta: "text-destructive",
      media: "text-primary",
      baixa: "text-muted-foreground",
    };
    return colors[priority.toLowerCase()] || "text-muted-foreground";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendário</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
            modifiers={{
              hasTasks: (date) => getDateStats(date).total > 0,
            }}
            modifiersStyles={{
              hasTasks: {
                fontWeight: "bold",
                textDecoration: "underline",
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Tasks for Selected Date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{format(selectedDate, "d 'de' MMMM, yyyy")}</span>
            <Badge variant="outline">
              {stats.completed}/{stats.total} concluídas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma tarefa nesta data
            </p>
          ) : (
            <div className="space-y-3">
              {selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 space-y-2">
                      <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={getCategoryColor(task.category)}>
                          {task.category}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        {task.estimated_time && (
                          <Badge variant="outline" className="gap-1">
                            <Clock className="w-3 h-3" />
                            {task.estimated_time}min
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarModule;
