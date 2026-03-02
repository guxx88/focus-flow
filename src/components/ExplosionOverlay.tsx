import { useEffect, useState } from "react";

const particles = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * 360;
  const distance = 80 + Math.random() * 180;
  const rad = (angle * Math.PI) / 180;
  return {
    id: i,
    px: `${Math.cos(rad) * distance}px`,
    py: `${Math.sin(rad) * distance}px`,
    size: 3 + Math.random() * 5,
    delay: Math.random() * 0.15,
    hue: 200 + Math.random() * 60,
  };
});

const ExplosionOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="explosion-overlay">
      <div className="explosion-flash-circle" />
      <div className="explosion-ring" />
      <div className="explosion-ring explosion-ring-2" />
      <div className="explosion-ring explosion-ring-3" />
      {particles.map((p) => (
        <div
          key={p.id}
          className="explosion-particle"
          style={{
            width: p.size,
            height: p.size,
            background: `hsl(${p.hue} 90% 65%)`,
            animationDelay: `${p.delay}s`,
            // @ts-ignore
            "--px": p.px,
            "--py": p.py,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default ExplosionOverlay;
