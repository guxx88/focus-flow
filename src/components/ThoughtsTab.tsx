import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GlassCard from "./GlassCard";
import { Brain, Trash2, CheckCircle, Circle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Distraction {
  id: string;
  thought: string;
  processed: boolean | null;
  captured_at: string | null;
}

const ThoughtsTab = () => {
  const [thoughts, setThoughts] = useState<Distraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "processed">("all");
  const { toast } = useToast();

  useEffect(() => {
    loadThoughts();
  }, []);

  const loadThoughts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("distractions")
      .select("*")
      .order("captured_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar pensamentos:", error);
    } else {
      setThoughts(data || []);
    }
    setLoading(false);
  };

  const toggleProcessed = async (id: string, currentStatus: boolean | null) => {
    const { error } = await supabase
      .from("distractions")
      .update({ processed: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Erro", description: "Não foi possível atualizar", variant: "destructive" });
    } else {
      setThoughts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, processed: !currentStatus } : t))
      );
    }
  };

  const deleteThought = async (id: string) => {
    const { error } = await supabase.from("distractions").delete().eq("id", id);

    if (error) {
      toast({ title: "Erro", description: "Não foi possível excluir", variant: "destructive" });
    } else {
      setThoughts((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Pensamento removido", description: "Excluído com sucesso." });
    }
  };

  const filteredThoughts = thoughts.filter((t) => {
    if (filter === "pending") return !t.processed;
    if (filter === "processed") return t.processed;
    return true;
  });

  const pendingCount = thoughts.filter((t) => !t.processed).length;
  const processedCount = thoughts.filter((t) => t.processed).length;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard animationIndex={1}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{thoughts.length}</p>
              <p className="text-xs text-muted-foreground">Total capturado</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard animationIndex={2}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard animationIndex={3}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{processedCount}</p>
              <p className="text-xs text-muted-foreground">Processados</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filter */}
      <GlassCard animationIndex={4}>
        <div className="flex gap-2">
          {(["all", "pending", "processed"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilter(f)}
              className="text-xs"
            >
              {f === "all" ? "Todos" : f === "pending" ? "Pendentes" : "Processados"}
            </Button>
          ))}
        </div>
      </GlassCard>

      {/* Thoughts List */}
      {filteredThoughts.length === 0 ? (
        <GlassCard animationIndex={5}>
          <div className="text-center py-10 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum pensamento capturado ainda.</p>
            <p className="text-xs mt-1">Use o Brain Dump ou o botão "Tive um pensamento" no Pomodoro.</p>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filteredThoughts.map((thought, index) => (
            <GlassCard
              key={thought.id}
              hover
              animationIndex={Math.min(index + 5, 8)}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleProcessed(thought.id, thought.processed)}
                  className="mt-0.5 flex-shrink-0 transition-colors"
                >
                  {thought.processed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm",
                      thought.processed && "line-through text-muted-foreground"
                    )}
                  >
                    {thought.thought}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(thought.captured_at)}
                  </p>
                </div>
                <button
                  onClick={() => deleteThought(thought.id)}
                  className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThoughtsTab;
