import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, subWeeks, addWeeks, startOfMonth, endOfMonth, subMonths, addMonths, startOfYear, endOfYear, subYears, addYears } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Task {
  id: string;
  completed: boolean;
  created_at: string;
}

interface AnalyticsTabProps {
  tasks: Task[];
}

type ViewMode = "week" | "month" | "year";

export default function AnalyticsTab({ tasks }: AnalyticsTabProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigate = (direction: "prev" | "next") => {
    if (viewMode === "week") {
      setCurrentDate(direction === "prev" ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
    } else if (viewMode === "month") {
      setCurrentDate(direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    } else {
      setCurrentDate(direction === "prev" ? subYears(currentDate, 1) : addYears(currentDate, 1));
    }
  };

  const { periodStart, periodEnd, periodLabel } = useMemo(() => {
    if (viewMode === "week") {
      const start = startOfWeek(currentDate, { locale: ptBR });
      const end = endOfWeek(currentDate, { locale: ptBR });
      return {
        periodStart: start,
        periodEnd: end,
        periodLabel: `${format(start, "dd MMM", { locale: ptBR })} - ${format(end, "dd MMM yyyy", { locale: ptBR })}`,
      };
    } else if (viewMode === "month") {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return {
        periodStart: start,
        periodEnd: end,
        periodLabel: format(currentDate, "MMMM yyyy", { locale: ptBR }),
      };
    } else {
      const start = startOfYear(currentDate);
      const end = endOfYear(currentDate);
      return {
        periodStart: start,
        periodEnd: end,
        periodLabel: format(currentDate, "yyyy", { locale: ptBR }),
      };
    }
  }, [viewMode, currentDate]);

  const daysData = useMemo(() => {
    const days = eachDayOfInterval({ start: periodStart, end: periodEnd });
    return days.map((day) => {
      const dayStr = day.toDateString();
      const completed = tasks.filter(
        (t) => t.completed && new Date(t.created_at).toDateString() === dayStr
      ).length;
      return {
        date: day,
        label: format(day, viewMode === "week" ? "EEE" : "dd", { locale: ptBR }),
        completed,
      };
    });
  }, [tasks, periodStart, periodEnd, viewMode]);

  const maxCompleted = Math.max(...daysData.map((d) => d.completed), 1);
  const totalCompleted = daysData.reduce((sum, d) => sum + d.completed, 0);
  const avgCompleted = (totalCompleted / daysData.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("week")}
          >
            Semana
          </Button>
          <Button
            variant={viewMode === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("month")}
          >
            Mês
          </Button>
          <Button
            variant={viewMode === "year" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("year")}
          >
            Ano
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate("prev")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-semibold min-w-[180px] text-center capitalize">
            {periodLabel}
          </span>
          <Button variant="outline" size="icon" onClick={() => navigate("next")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {totalCompleted}
            </p>
            <p className="text-xs text-muted-foreground mt-1">tarefas concluídas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Média</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold bg-gradient-success bg-clip-text text-transparent">
              {avgCompleted}
            </p>
            <p className="text-xs text-muted-foreground mt-1">por dia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Melhor Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold bg-gradient-urgent bg-clip-text text-transparent">
              {maxCompleted}
            </p>
            <p className="text-xs text-muted-foreground mt-1">tarefas em 1 dia</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Atividade do Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {viewMode === "week" && (
              <div className="flex items-end justify-between gap-2 h-64">
                {daysData.map((day, idx) => {
                  const heightPercent = maxCompleted > 0 ? (day.completed / maxCompleted) * 100 : 0;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full flex items-end justify-center h-48">
                        <div
                          className="w-full bg-gradient-primary rounded-t-xl transition-all duration-300 hover:opacity-80 relative group"
                          style={{ height: `${heightPercent}%`, minHeight: day.completed > 0 ? "8px" : "0" }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card px-2 py-1 rounded shadow-lg text-xs font-semibold whitespace-nowrap">
                            {day.completed} tarefas
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground capitalize">
                        {day.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {(viewMode === "month" || viewMode === "year") && (
              <div className="grid grid-cols-7 gap-2">
                {daysData.map((day, idx) => {
                  const intensity = maxCompleted > 0 ? day.completed / maxCompleted : 0;
                  return (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg relative group cursor-pointer transition-transform hover:scale-110"
                      style={{
                        backgroundColor: intensity === 0
                          ? "hsl(var(--muted))"
                          : `hsl(262 83% ${65 - intensity * 30}%)`,
                      }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card px-2 py-1 rounded shadow-lg text-xs font-semibold whitespace-nowrap z-10">
                        {format(day.date, "dd/MM", { locale: ptBR })}: {day.completed} tarefas
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
