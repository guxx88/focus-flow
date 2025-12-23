import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, ChevronDown, ChevronUp, Trash2, X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Subtask {
  text: string;
  completed: boolean;
}

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
  const [editingSubtasks, setEditingSubtasks] = useState<Subtask[]>(
    subtasks.map(s => ({ text: s, completed: false }))
  );
  const [newSubtask, setNewSubtask] = useState("");
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

  const updateSubtasks = async (newSubtasks: Subtask[]) => {
    try {
      const subtasksText = newSubtasks.map(s => s.text);
      const { error } = await supabase
        .from('tasks')
        .update({ subtasks: subtasksText })
        .eq('id', id);

      if (error) throw error;

      setEditingSubtasks(newSubtasks);
      onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar subtarefas:', error);
    }
  };

  const toggleSubtask = (index: number) => {
    const updated = [...editingSubtasks];
    updated[index].completed = !updated[index].completed;
    setEditingSubtasks(updated);
  };

  const deleteSubtask = (index: number) => {
    const updated = editingSubtasks.filter((_, i) => i !== index);
    updateSubtasks(updated);
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const updated = [...editingSubtasks, { text: newSubtask, completed: false }];
      updateSubtasks(updated);
      setNewSubtask("");
    }
  };

  return (
    <div className={`glass-subtle rounded-xl p-4 transition-all hover:bg-card/60 ${completed ? 'opacity-50' : ''}`}>
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

          {(subtasks.length > 0 || expanded) && (
            <div className="pt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-fast"
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {editingSubtasks.length} subtarefas
              </button>
              
              {expanded && (
                <div className="mt-3 space-y-2 animate-fade-in">
                  {editingSubtasks.map((subtask, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <Checkbox
                        checked={subtask.completed}
                        onCheckedChange={() => toggleSubtask(idx)}
                        className="h-4 w-4"
                      />
                      <span className={`text-sm flex-1 ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {subtask.text}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSubtask(idx)}
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2 mt-3">
                    <Input
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                      placeholder="Nova subtarefa..."
                      className="text-sm h-8"
                    />
                    <Button
                      onClick={addSubtask}
                      size="icon"
                      className="h-8 w-8"
                      disabled={!newSubtask.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;