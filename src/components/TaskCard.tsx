import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TaskCardProps {
  id: string;
  title: string;
  category: string;
  priority: string;
  estimatedTime: number;
  completed: boolean;
  subtasks: string[];
  onUpdate: () => void;
}

const TaskCard = ({ 
  id, 
  title, 
  category, 
  priority, 
  estimatedTime, 
  completed,
  subtasks,
  onUpdate 
}: TaskCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  const getCategoryIcon = (cat: string) => {
    const icons = {
      escola: "📚",
      projeto: "🚀",
      pessoal: "👤",
      urgente: "⚠️",
    };
    return icons[cat as keyof typeof icons] || "📋";
  };

  const getCategoryColor = (cat: string) => {
    const colors = {
      escola: "bg-primary/10 text-primary border-primary/20",
      projeto: "bg-project/10 text-project border-project/20",
      pessoal: "bg-secondary text-secondary-foreground border-border",
      urgente: "bg-urgent/10 text-urgent border-urgent/20",
    };
    return colors[cat as keyof typeof colors] || colors.pessoal;
  };

  const getPriorityDot = (pri: string) => {
    const colors = {
      baixa: "bg-muted",
      media: "bg-primary",
      alta: "bg-urgent",
    };
    return colors[pri as keyof typeof colors] || colors.media;
  };

  const handleToggle = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !completed })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: completed ? "Tarefa reaberta" : "Parabéns! 🎉",
        description: completed ? "Continue trabalhando!" : "Mais uma concluída!",
      });

      onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Tarefa removida",
        description: "A tarefa foi excluída com sucesso.",
      });

      onUpdate();
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  return (
    <Card className={`p-4 border-2 transition-all duration-base hover:shadow-md ${completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={completed}
          onCheckedChange={handleToggle}
          className="mt-1"
        />
        
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-medium ${completed ? 'line-through text-muted-foreground' : ''}`}>
              {title}
            </h3>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getPriorityDot(priority)}`} />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getCategoryColor(category)} variant="outline">
              {getCategoryIcon(category)} {category}
            </Badge>
            {estimatedTime > 0 && (
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {estimatedTime}min
              </Badge>
            )}
          </div>

          {subtasks.length > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-fast"
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {subtasks.length} subtarefas
              </button>
              
              {expanded && (
                <ul className="mt-2 space-y-1 ml-4 animate-fade-in">
                  {subtasks.map((subtask, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{subtask}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;