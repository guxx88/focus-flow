import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  animationIndex?: number;
}

const GlassCard = ({ children, className, hover = false, animationIndex }: GlassCardProps) => {
  const animationClass = animationIndex !== undefined 
    ? `animate-card-enter animate-card-enter-${Math.min(animationIndex, 8)}` 
    : '';

  return (
    <div
      className={cn(
        "glass rounded-2xl p-5",
        hover && "glass-hover cursor-pointer",
        animationClass,
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
