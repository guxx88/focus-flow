import { useState, useEffect } from "react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"feather" | "morph" | "text" | "fadeout" | "done">("feather");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("morph"), 2600),
      setTimeout(() => setPhase("text"), 4200),
      setTimeout(() => setPhase("fadeout"), 6800),
      setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 7600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (phase === "done") return null;

  const isMorphing = phase === "morph" || phase === "text" || phase === "fadeout";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-700 ${
        phase === "fadeout" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex items-center justify-center" style={{ minHeight: 120 }}>
        {/* Feather SVG — morphs into F */}
        <svg
          viewBox="0 0 80 160"
          className={`splash-feather ${isMorphing ? "splash-feather-morph" : ""}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: 72, height: 144 }}
        >
          {/* Main feather body */}
          <defs>
            <linearGradient id="featherGrad" x1="40" y1="0" x2="40" y2="160" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            </linearGradient>
            <filter id="featherGlow">
              <feGaussianBlur stdDeviation="2" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Outer feather shape */}
          <path
            d="M40 6 C40 6 18 30 16 60 C14 85 20 105 28 120 C33 130 37 140 40 152 C43 140 47 130 52 120 C60 105 66 85 64 60 C62 30 40 6 40 6Z"
            fill="url(#featherGrad)"
            filter="url(#featherGlow)"
          />
          {/* Left barbs */}
          <path d="M40 20 C36 30 28 42 22 52 C20 56 19 62 20 68" stroke="hsl(var(--primary))" strokeWidth="0.6" opacity="0.4" fill="none" />
          <path d="M40 40 C36 48 30 58 24 66 C22 70 21 76 22 82" stroke="hsl(var(--primary))" strokeWidth="0.6" opacity="0.3" fill="none" />
          <path d="M40 60 C37 68 32 76 28 84 C26 88 25 92 26 98" stroke="hsl(var(--primary))" strokeWidth="0.6" opacity="0.25" fill="none" />
          {/* Right barbs */}
          <path d="M40 20 C44 30 52 42 58 52 C60 56 61 62 60 68" stroke="hsl(var(--primary))" strokeWidth="0.6" opacity="0.4" fill="none" />
          <path d="M40 40 C44 48 50 58 56 66 C58 70 59 76 58 82" stroke="hsl(var(--primary))" strokeWidth="0.6" opacity="0.3" fill="none" />
          <path d="M40 60 C43 68 48 76 52 84 C54 88 55 92 54 98" stroke="hsl(var(--primary))" strokeWidth="0.6" opacity="0.25" fill="none" />
          {/* Central rachis (quill) */}
          <path
            d="M40 8 C40 8 39 40 39 70 C39 95 39.5 120 40 150"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="1.2"
            opacity="0.35"
            strokeLinecap="round"
          />
          {/* Highlight on left */}
          <path
            d="M30 40 C28 50 24 62 22 72"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="0.5"
            opacity="0.15"
            strokeLinecap="round"
          />
        </svg>

        {/* The F letter — fades in as feather morphs */}
        <span
          className={`splash-letter-f text-7xl md:text-9xl font-bold tracking-tight absolute ${
            isMorphing ? "splash-f-morph-in" : "splash-f-hide"
          }`}
          style={{ color: "hsl(var(--primary))" }}
        >
          F
        </span>

        {/* "ocus Flow" text */}
        <span
          className={`splash-rest-text text-7xl md:text-9xl font-bold tracking-tight ${
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
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="splash-particle"
            style={{
              left: `${25 + Math.random() * 50}%`,
              animationDelay: `${2.6 + i * 0.12}s`,
              animationDuration: `${1.2 + Math.random() * 0.6}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;
