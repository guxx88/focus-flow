import { useState, useEffect } from "react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"feather" | "morph" | "text" | "fadeout" | "done">("feather");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("morph"), 2800),
      setTimeout(() => setPhase("text"), 3800),
      setTimeout(() => setPhase("fadeout"), 6200),
      setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 7000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-700 ${
        phase === "fadeout" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Feather falling */}
      <div className="relative flex items-center justify-center">
        {/* Feather SVG */}
        <svg
          viewBox="0 0 64 128"
          className={`absolute w-16 h-32 splash-feather ${
            phase === "morph" || phase === "text" || phase === "fadeout"
              ? "splash-feather-hide"
              : ""
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 4C32 4 12 28 12 56C12 72 18 88 24 100C28 108 30 116 32 124C34 116 36 108 40 100C46 88 52 72 52 56C52 28 32 4 32 4Z"
            fill="hsl(var(--primary))"
            opacity="0.9"
          />
          <path
            d="M32 4C32 4 22 32 22 56C22 72 26 88 30 100C31 104 31.5 108 32 112"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="1.5"
            opacity="0.5"
            strokeLinecap="round"
          />
          <path
            d="M32 20C28 32 24 44 24 56C24 68 27 80 30 90"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="0.8"
            opacity="0.3"
            strokeLinecap="round"
          />
          <path
            d="M32 20C36 32 40 44 40 56C40 68 37 80 34 90"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="0.8"
            opacity="0.3"
            strokeLinecap="round"
          />
        </svg>

        {/* The F letter that appears */}
        <span
          className={`splash-letter-f text-6xl md:text-8xl font-bold tracking-tight ${
            phase === "morph" || phase === "text" || phase === "fadeout"
              ? "splash-f-show"
              : "splash-f-hide"
          }`}
          style={{ color: "hsl(var(--primary))" }}
        >
          F
        </span>

        {/* "ocus Flow" text */}
        <span
          className={`splash-rest-text text-6xl md:text-8xl font-bold tracking-tight ${
            phase === "text" || phase === "fadeout"
              ? "splash-text-show"
              : "splash-text-hide"
          }`}
          style={{ color: "hsl(var(--foreground))" }}
        >
          <span className="splash-char" style={{ animationDelay: "0ms" }}>o</span>
          <span className="splash-char" style={{ animationDelay: "150ms" }}>c</span>
          <span className="splash-char" style={{ animationDelay: "300ms" }}>u</span>
          <span className="splash-char" style={{ animationDelay: "450ms" }}>s</span>
          <span className="splash-char" style={{ animationDelay: "700ms" }}>&nbsp;</span>
          <span className="splash-char splash-flow" style={{ animationDelay: "900ms", color: "hsl(var(--primary))" }}>F</span>
          <span className="splash-char splash-flow" style={{ animationDelay: "1050ms", color: "hsl(var(--primary))" }}>l</span>
          <span className="splash-char splash-flow" style={{ animationDelay: "1200ms", color: "hsl(var(--primary))" }}>o</span>
          <span className="splash-char splash-flow" style={{ animationDelay: "1350ms", color: "hsl(var(--primary))" }}>w</span>
        </span>
      </div>

      {/* Subtle particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="splash-particle"
            style={{
              left: `${30 + Math.random() * 40}%`,
              animationDelay: `${1.4 + i * 0.15}s`,
              animationDuration: `${1 + Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;
