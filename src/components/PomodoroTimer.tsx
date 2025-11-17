import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Lightbulb } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type PomodoroLevel = "iniciante" | "equilibrado" | "intenso";

const POMODORO_CONFIGS = {
  iniciante: { work: 25, shortBreak: 5, longBreak: 15 },
  equilibrado: { work: 45, shortBreak: 10, longBreak: 20 },
  intenso: { work: 90, shortBreak: 15, longBreak: 30 },
};

const PomodoroTimer = () => {
  const [level, setLevel] = useState<PomodoroLevel>("iniciante");
  const [minutes, setMinutes] = useState(POMODORO_CONFIGS.iniciante.work);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [distraction, setDistraction] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            toast({
              title: "Pomodoro completo! 🎉",
              description: "Hora de fazer uma pausa!",
            });
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(POMODORO_CONFIGS[level].work);
    setSeconds(0);
  };

  const handleLevelChange = (newLevel: PomodoroLevel) => {
    setLevel(newLevel);
    setIsActive(false);
    setMinutes(POMODORO_CONFIGS[newLevel].work);
    setSeconds(0);
  };

  const handleDistraction = async () => {
    if (!distraction.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase.from('distractions').insert({
        user_id: user.id,
        thought: distraction,
      });

      if (error) throw error;

      const timeRemaining = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      toast({
        title: "Anotei! ✓",
        description: `Você pode fazer isso na pausa em ${timeRemaining}. Foca agora! 💪`,
      });

      setDistraction("");
      setShowDialog(false);
    } catch (error) {
      console.error('Erro ao salvar distração:', error);
    }
  };

  const totalSeconds = POMODORO_CONFIGS[level].work * 60;
  const progress = ((totalSeconds - (minutes * 60 + seconds)) / totalSeconds) * 100;

  return (
    <Card className="p-6 bg-gradient-primary text-white border-0 shadow-lg">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Modo Foco</h2>
        
        <Select value={level} onValueChange={handleLevelChange} disabled={isActive}>
          <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="iniciante">🌱 Iniciante ({POMODORO_CONFIGS.iniciante.work} min)</SelectItem>
            <SelectItem value="equilibrado">⚖️ Equilibrado ({POMODORO_CONFIGS.equilibrado.work} min)</SelectItem>
            <SelectItem value="intenso">🔥 Intenso ({POMODORO_CONFIGS.intenso.work} min)</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="relative w-48 h-48 mx-auto">
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="white"
              strokeWidth="12"
              fill="none"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            onClick={toggleTimer}
            variant="secondary"
            size="lg"
            className="gap-2"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isActive ? 'Pausar' : 'Iniciar'}
          </Button>
          <Button
            onClick={resetTimer}
            variant="secondary"
            size="lg"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {isActive && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="secondary"
                size="lg"
                className="w-full gap-2 animate-pulse"
              >
                <Lightbulb className="w-5 h-5" />
                💭 Tive um pensamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>O que passou na sua cabeça?</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  value={distraction}
                  onChange={(e) => setDistraction(e.target.value)}
                  placeholder="Ex: ver Instagram, responder mensagem..."
                  className="min-h-24"
                />
                <Button onClick={handleDistraction} className="w-full">
                  Anotar e Voltar ao Foco
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Card>
  );
};

export default PomodoroTimer;