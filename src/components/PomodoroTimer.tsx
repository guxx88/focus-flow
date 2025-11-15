import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Lightbulb } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
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
    setMinutes(25);
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

  const progress = ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100;

  return (
    <Card className="p-6 bg-gradient-primary text-white border-0 shadow-lg">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Modo Foco</h2>
        
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