import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
interface QuickAddInputProps {
  onTaskAdded: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}
interface Suggestions {
  category: string;
  priority: string;
  estimatedTime: number;
  subtasks: string[];
}

const DEFAULT_SUGGESTIONS: Suggestions = {
  category: 'pessoal',
  priority: 'media',
  estimatedTime: 30,
  subtasks: []
};
const QuickAddInput = ({
  onTaskAdded,
  inputRef
}: QuickAddInputProps) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [autocomplete, setAutocomplete] = useState("");
  const [isLoadingAutocomplete, setIsLoadingAutocomplete] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autocompleteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const {
    toast
  } = useToast();
  const getCategoryColor = (category: string) => {
    const colors = {
      escola: "bg-primary text-primary-foreground",
      projeto: "bg-project text-project-foreground",
      pessoal: "bg-secondary text-secondary-foreground",
      urgente: "bg-urgent text-urgent-foreground"
    };
    return colors[category as keyof typeof colors] || colors.pessoal;
  };
  const getPriorityColor = (priority: string) => {
    const colors = {
      baixa: "bg-muted text-muted-foreground",
      media: "bg-primary/70 text-primary-foreground",
      alta: "bg-urgent text-urgent-foreground"
    };
    return colors[priority as keyof typeof colors] || colors.media;
  };
  const fetchSuggestions = async (value: string) => {
    if (value.length <= 3) {
      setSuggestions(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-task-suggestions', {
        body: { input: value }
      });
      
      if (error) {
        // Handle rate limit specifically
        if (error.message?.includes('429') || error.message?.includes('RATE_LIMITED')) {
          setManualMode(true);
          setSuggestions(DEFAULT_SUGGESTIONS);
          toast({
            title: "Modo Manual Ativado",
            description: "A IA está temporariamente indisponível. Você pode criar tarefas manualmente.",
            variant: "default"
          });
          return;
        }
        throw error;
      }
      
      setSuggestions(data);
      setManualMode(false);
    } catch (error) {
      console.error('Erro ao obter sugestões:', error);
      // Enable manual mode on any error
      setManualMode(true);
      setSuggestions(DEFAULT_SUGGESTIONS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    setAutocomplete("");

    // Debounce autocomplete
    if (autocompleteTimerRef.current) {
      clearTimeout(autocompleteTimerRef.current);
    }

    if (value.length >= 3) {
      autocompleteTimerRef.current = setTimeout(() => {
        fetchAutocomplete(value);
      }, 300);
    }

    // Existing suggestion debounce
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Only fetch if user stops typing for 800ms
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 800);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (autocompleteTimerRef.current) {
        clearTimeout(autocompleteTimerRef.current);
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && autocomplete) {
      e.preventDefault();
      const newValue = input + autocomplete;
      setInput(newValue);
      setAutocomplete("");
      handleInputChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && autocomplete) {
      e.preventDefault();
      const newValue = input + autocomplete;
      setInput(newValue);
      setAutocomplete("");
      handleInputChange(newValue);
    }
  };
  const handleConfirm = async () => {
    if (!input.trim() || !suggestions) return;
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      const {
        error
      } = await supabase.from('tasks').insert({
        user_id: user.id,
        title: input,
        category: suggestions.category,
        priority: suggestions.priority,
        estimated_time: suggestions.estimatedTime,
        subtasks: suggestions.subtasks
      });
      if (error) throw error;
      toast({
        title: "Tarefa criada! 🎉",
        description: "Sua tarefa foi adicionada com sucesso."
      });
      setInput("");
      setSuggestions(null);
      onTaskAdded();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a tarefa.",
        variant: "destructive"
      });
    }
  };
  return <div className="w-full space-y-3">
      <div className="relative">
        <Input 
          ref={inputRef}
          value={input} 
          onChange={e => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite qualquer coisa... 'estudar matemática cap 5'" 
          className="w-full h-14 text-lg pr-12 border-2 focus:border-primary transition-all duration-base mx-0 my-0 px-0 py-0" 
        />
        {autocomplete && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-lg text-muted-foreground/40">
            <span className="invisible">{input}</span>
            <span>{autocomplete}</span>
          </div>
        )}
        {isLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-primary" />}
        {!isLoading && input && <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />}
      </div>

      {suggestions && input && <div className="bg-card border-2 border-primary/20 rounded-xl p-4 space-y-4 animate-fade-in shadow-md">
          {manualMode && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ Modo Manual: Você pode personalizar as sugestões abaixo
              </p>
            </div>
          )}
          
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

          {suggestions.subtasks.length > 0 && <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Subtarefas sugeridas:</p>
              <ul className="space-y-1">
                {suggestions.subtasks.map((subtask, idx) => <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{subtask}</span>
                  </li>)}
              </ul>
            </div>}

          <Button onClick={handleConfirm} className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-base">
            Confirmar Tarefa ✓
          </Button>
        </div>}
    </div>;
};
export default QuickAddInput;