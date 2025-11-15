import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, Flame } from "lucide-react";

interface StatsCardsProps {
  completedToday: number;
  totalTimeToday: number;
  currentStreak: number;
}

const StatsCards = ({ completedToday, totalTimeToday, currentStreak }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 border-2 border-success/20 bg-success/5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-success/10">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Concluídas Hoje</p>
            <p className="text-2xl font-bold text-success">{completedToday}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 border-2 border-primary/20 bg-primary/5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tempo Focado</p>
            <p className="text-2xl font-bold text-primary">{totalTimeToday}min</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 border-2 border-urgent/20 bg-urgent/5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-urgent/10">
            <Flame className="w-6 h-6 text-urgent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sequência</p>
            <p className="text-2xl font-bold text-urgent">{currentStreak} dias</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsCards;