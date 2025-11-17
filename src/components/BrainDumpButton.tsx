import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BrainDumpButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [thought, setThought] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!thought.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para usar o Brain Dump",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from('distractions').insert({
        user_id: user.id,
        thought: thought.trim(),
        processed: false,
      });

      if (error) throw error;

      toast({
        title: "Pensamento capturado! 🧠",
        description: "Sua mente está livre agora. Continue focado!",
      });

      setThought("");
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao salvar pensamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar seu pensamento",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-glow bg-gradient-purple hover:scale-110 transition-all z-50 p-0"
        size="icon"
      >
        <Brain className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Brain Dump
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Despeje seus pensamentos, preocupações e ideias aqui. Libere espaço mental para focar no que realmente importa agora.
            </p>
            <Textarea
              placeholder="O que está passando pela sua cabeça?..."
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[120px] resize-none"
              autoFocus
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Ctrl/⌘ + Enter para enviar
              </p>
              <Button
                onClick={handleSubmit}
                disabled={!thought.trim() || isSubmitting}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Capturar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BrainDumpButton;
