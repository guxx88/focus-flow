import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
}

export const useKeyboardShortcuts = (shortcuts: Shortcut[]) => {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Check for help shortcut (?)
      if (e.key === "?") {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      // Check other shortcuts
      shortcuts.forEach((shortcut) => {
        if (e.key.toLowerCase() === shortcut.key.toLowerCase()) {
          e.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);

  const ShortcutsHelp = () => (
    <Dialog open={showHelp} onOpenChange={setShowHelp}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atalhos de Teclado</DialogTitle>
          <DialogDescription>
            Use esses atalhos para navegar mais rapidamente
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors"
            >
              <span className="text-sm text-foreground">
                {shortcut.description}
              </span>
              <Badge variant="outline" className="font-mono">
                {shortcut.key.toUpperCase()}
              </Badge>
            </div>
          ))}
          <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors border-t pt-3 mt-3">
            <span className="text-sm text-foreground">
              Mostrar esta ajuda
            </span>
            <Badge variant="outline" className="font-mono">
              ?
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return { ShortcutsHelp };
};
