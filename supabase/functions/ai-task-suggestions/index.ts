import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    console.log('Processando input:', input);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente de produtividade especializado em adolescentes que precisam equilibrar escola, projetos e vida pessoal.

Ao receber uma tarefa do usuário, você deve analisar e sugerir:
1. Categoria (escola, projeto, pessoal ou urgente)
2. Prioridade (baixa, media, alta)
3. Tempo estimado em minutos
4. Até 3 subtarefas relevantes

Regras de categorização:
- "estudar", "prova", "matéria", "cap", "exercício" → escola
- "bug", "código", "app", "tela", "feature", "implementar" → projeto  
- "ligar", "familia", "amigos", "casa" → pessoal
- "urgente", "hoje", "agora", "importante" → urgente

Regras de prioridade:
- Palavras como "urgente", "prova", "hoje" → alta
- Palavras como "começar", "rever", "ler" → media
- Tarefas genéricas → baixa

Regras de tempo:
- Estudo: 30-60 min
- Exercícios: 20-40 min
- Leitura: 15-30 min
- Código/implementação: 45-120 min
- Tarefas rápidas: 5-15 min

Responda APENAS em JSON válido neste formato:
{
  "category": "escola" | "projeto" | "pessoal" | "urgente",
  "priority": "baixa" | "media" | "alta",
  "estimatedTime": number,
  "subtasks": ["subtarefa 1", "subtarefa 2", "subtarefa 3"]
}`
          },
          {
            role: 'user',
            content: input
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API:', response.status, errorText);
      throw new Error(`Erro da API: ${response.status}`);
    }

    const data = await response.json();
    console.log('Resposta da IA:', data);

    const aiResponse = data.choices[0].message.content;
    
    // Extrair JSON da resposta
    let suggestions;
    try {
      // Remove markdown code blocks se existirem
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        suggestions = JSON.parse(aiResponse);
      }
    } catch (e) {
      console.error('Erro ao parsear JSON:', e, 'Resposta:', aiResponse);
      // Fallback com valores padrão
      suggestions = {
        category: 'pessoal',
        priority: 'media',
        estimatedTime: 30,
        subtasks: []
      };
    }

    return new Response(
      JSON.stringify(suggestions),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Erro:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});