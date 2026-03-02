import { useEffect, useMemo, useState } from "react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"feather" | "morph" | "text" | "fadeout" | "done">("feather");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("morph"), 3400),
      setTimeout(() => setPhase("text"), 5600),
      setTimeout(() => setPhase("fadeout"), 8600),
      setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 9400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const particles = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        left: `${22 + i * 6.5}%`,
        delay: `${3.55 + i * 0.14}s`,
        duration: `${1.25 + (i % 4) * 0.18}s`,
      })),
    []
  );

  if (phase === "done") return null;

  const isMorphing = phase === "morph" || phase === "text" || phase === "fadeout";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-700 ${
        phase === "fadeout" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className="relative flex items-center justify-center splash-logo-stage"
        style={{ minHeight: 240, width: "min(94vw, 980px)" }}
      >
        {/* Feather SVG — falls to center and morphs into F */}
        <svg
          viewBox="0 0 84 170"
          className={`splash-feather absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
            isMorphing ? "splash-feather-morph" : ""
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: 86, height: 172 }}
        >
          <defs>
            <linearGradient id="featherGrad" x1="42" y1="0" x2="42" y2="170" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.62" />
              <stop offset="46%" stopColor="hsl(var(--primary))" stopOpacity="0.98" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.56" />
            </linearGradient>
            <linearGradient id="featherEdge" x1="16" y1="84" x2="62" y2="84" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.09" />
              <stop offset="100%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.24" />
            </linearGradient>
            <filter id="featherGlow" x="-40%" y="-20%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.2" floodColor="hsl(var(--primary))" floodOpacity="0.26" />
            </filter>
          </defs>

          <path
            d="M42 7 C41 8 20 29 17 58 C14 84 20 106 28 122 C33 133 38 145 42 162 C45 145 50 133 56 122 C65 106 71 84 67 58 C64 29 43 8 42 7Z"
            fill="url(#featherGrad)"
            filter="url(#featherGlow)"
          />

          <path
            d="M42 11 C41 20 40 45 40 76 C40 106 40.6 133 42 160"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="1.35"
            opacity="0.38"
            strokeLinecap="round"
          />

          <path d="M42 22 C36 31 29 42 23 54 C20 60 19 66 20 73" stroke="url(#featherEdge)" strokeWidth="0.85" fill="none" />
          <path d="M42 42 C37 51 31 61 26 71 C24 76 23 82 24 88" stroke="url(#featherEdge)" strokeWidth="0.75" fill="none" opacity="0.9" />
          <path d="M42 61 C38 70 34 79 30 88 C28 93 27 98 28 103" stroke="url(#featherEdge)" strokeWidth="0.7" fill="none" opacity="0.8" />

          <path d="M42 22 C48 31 55 42 61 54 C64 60 65 66 64 73" stroke="url(#featherEdge)" strokeWidth="0.85" fill="none" />
          <path d="M42 42 C47 51 53 61 58 71 C60 76 61 82 60 88" stroke="url(#featherEdge)" strokeWidth="0.75" fill="none" opacity="0.9" />
          <path d="M42 61 C46 70 50 79 54 88 C56 93 57 98 56 103" stroke="url(#featherEdge)" strokeWidth="0.7" fill="none" opacity="0.8" />

          <path
            d="M31 42 C29 52 26 62 24 74"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="0.55"
            opacity="0.2"
            strokeLinecap="round"
          />
        </svg>

        <span
          className={`splash-letter-f text-7xl md:text-9xl font-bold leading-none tracking-tight absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
            isMorphing ? "splash-f-morph-in" : "splash-f-hide"
          }`}
          style={{ color: "hsl(var(--primary))" }}
        >
          F
        </span>

        <span
          className={`splash-rest-text text-7xl md:text-9xl font-bold leading-none tracking-tight absolute left-1/2 top-1/2 -translate-y-1/2 ${
            phase === "text" || phase === "fadeout" ? "splash-text-show" : "splash-text-hide"
          }`}
          style={{ color: "hsl(var(--foreground))", marginLeft: "0.5em" }}
        >
          <span className="splash-char" style={{ animationDelay: "0ms" }}>o</span>
          <span className="splash-char" style={{ animationDelay: "220ms" }}>c</span>
          <span className="splash-char" style={{ animationDelay: "440ms" }}>u</span>
          <span className="splash-char" style={{ animationDelay: "660ms" }}>s</span>
          <span className="splash-char" style={{ animationDelay: "900ms" }}>&nbsp;</span>
          <span className="splash-char splash-flow" style={{ animationDelay: "1220ms", color: "hsl(var(--primary))" }}>F</span>
          <span className="splash-char splash-flow" style={{ animationDelay: "1460ms", color: "hsl(var(--primary))" }}>l</span>
          <span className="splash-char splash-flow" style={{ animationDelay: "1700ms", color: "hsl(var(--primary))" }}>o</span>
          <span className="splash-char splash-flow" style={{ animationDelay: "1940ms", color: "hsl(var(--primary))" }}>w</span>
        </span>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="splash-particle"
            style={{
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;

