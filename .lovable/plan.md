

## Remover a Vinheta de Abertura

Vou remover completamente a animacao de splash screen do projeto.

### Mudancas

1. **Deletar `src/components/SplashScreen.tsx`** - Remover o componente inteiro

2. **Limpar `src/pages/Index.tsx`**
   - Remover import do `SplashScreen`
   - Remover estados `showSplash` e `handleSplashComplete`
   - Remover renderizacao condicional do splash

3. **Limpar `src/index.css`**
   - Remover todos os keyframes relacionados ao splash (`feather-fall`, `feather-morph`, `f-morph-in`, `char-appear`, `particle-float`)
   - Remover todas as classes `.splash-*`

O site vai abrir direto no dashboard sem nenhuma animacao de abertura.

