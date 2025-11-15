import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast({
          title: "Bem-vindo de volta! 👋",
          description: "Login realizado com sucesso."
        });
      } else {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        toast({
          title: "Conta criada! 🎉",
          description: "Você já pode começar a usar o dashboard."
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-lg bg-blue-100">
        <div className="text-center space-y-2">
          <h1 className="text-3xl bg-gradient-primary bg-clip-text font-bold text-sky-600">ALWAYS FOCUSED  </h1>
          
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="h-12" />
          </div>

          <div className="space-y-2">
            <Input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required className="h-12" />
          </div>

          <Button type="submit" className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isLogin ? "Entrar" : "Criar Conta"}
          </Button>
        </form>

        <div className="text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground hover:text-primary transition-colors">
            {isLogin ? "Não tem conta? Criar uma" : "Já tem conta? Entrar"}
          </button>
        </div>
      </Card>
    </div>;
};
export default AuthForm;