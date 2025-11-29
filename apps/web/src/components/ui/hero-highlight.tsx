import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const HeroHighlight = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {

  const dotPattern = (color: string) => ({
    backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
    backgroundSize: '16px 16px',
  });

  return (
    <div
      className={cn(
        "relative h-[40rem] flex items-center bg-white dark:bg-black justify-center w-full group",
        containerClassName
      )}
      style={{ overflow: 'visible', transform: 'translateX(-192px)' }}
    >
      <div 
        className="absolute inset-0 pointer-events-none opacity-100" 
        style={dotPattern('rgb(212 212 212)')} // neutral-300 for light mode
      />
      <div 
        className="absolute inset-0 dark:opacity-100 opacity-0 pointer-events-none" 
        style={dotPattern('rgb(38 38 38)')} // neutral-800 for dark mode
      />

      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
};

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.span
      className={cn(
        `relative inline-block`,
        className
      )}
      style={{
        position: "relative",
        zIndex: 1,
      }}
    >
      <motion.span
      initial={{
          scaleX: 0,
      }}
      animate={{
          scaleX: 1,
      }}
      transition={{
        duration: 6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.5,
      }}
        className="absolute inset-0 bg-green-100 dark:bg-green-800 rounded-lg"
      style={{
          zIndex: -1,
          transformOrigin: "left center",
          top: '0.25rem',
          bottom: '0.25rem',
          left: '0.125rem',
          right: '0.125rem',
      }}
      />
      <span className="relative z-10 px-1">{children}</span>
    </motion.span>
  );
};

