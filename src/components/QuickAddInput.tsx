import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuickAddInputProps {
  onTaskAdded: () => void;
}

interface Suggestions {
  category: string;
  priority: string;
  estimatedTime: number;
  subtasks: string[];
}

const QuickAddInput = ({ onTaskAdded }: QuickAddInputProps) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getCategoryColor = (category: string) => {
    const colors = {
      escola: "bg-primary text-primary-foreground",
      projeto: "bg-project text-project-foreground",
      pessoal: "bg-secondary text-secondary-foreground",
      urgente: "bg-urgent text-urgent-foreground",
    };
    return colors[category as keyof typeof colors] || colors.pessoal;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      baixa: "bg-muted text-muted-foreground",
      media: "bg-primary/70 text-primary-foreground",
      alta: "bg-urgent text-urgent-foreground",
    };
    return colors[priority as keyof typeof colors] || colors.media;
  };

  const handleInputChange = async (value: string) => {
    setInput(value);
    
    if (value.length > 3) {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('ai-task-suggestions', {
          body: { input: value }
        });

        if (error) throw error;
        setSuggestions(data);
      } catch (error) {
        console.error('Erro ao obter sugestões:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions(null);
    }
  };

  const handleConfirm = async () => {
    if (!input.trim() || !suggestions) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase.from('tasks').insert({
        user_id: user.id,
        title: input,
        category: suggestions.category,
        priority: suggestions.priority,
        estimated_time: suggestions.estimatedTime,
        subtasks: suggestions.subtasks,
      });

      if (error) throw error;

      toast({
        title: "Tarefa criada! 🎉",
        description: "Sua tarefa foi adicionada com sucesso.",
      });

      setInput("");
      setSuggestions(null);
      onTaskAdded();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a tarefa.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative">
        <Input
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Digite qualquer coisa... 'estudar matemática cap 5'"
          className="w-full h-14 text-lg pr-12 border-2 focus:border-primary transition-all duration-base"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-primary" />
        )}
        {!isLoading && input && (
          <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />
        )}
      </div>

      {suggestions && input && (
        <div className="bg-card border-2 border-primary/20 rounded-xl p-4 space-y-4 animate-fade-in shadow-md">
          <div className="flex flex-wrap gap-2">
            <Badge className={getCategoryColor(suggestions.category)}>
              📚 {suggestions.category}
            </Badge>
            <Badge className={getPriorityColor(suggestions.priority)}>
              {suggestions.priority === 'alta' ? '🔥' : suggestions.priority === 'media' ? '⚡' : '💡'} {suggestions.priority}
            </Badge>
            <Badge variant="outline">
              ⏱️ {suggestions.estimatedTime} min
            </Badge>
          </div>

          {suggestions.subtasks.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Subtarefas sugeridas:</p>
              <ul className="space-y-1">
                {suggestions.subtasks.map((subtask, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{subtask}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button 
            onClick={handleConfirm} 
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-base"
          >
            Confirmar Tarefa ✓
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuickAddInput;