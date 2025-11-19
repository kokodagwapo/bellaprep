import { cn } from "../../lib/utils";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
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
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

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
      onMouseMove={handleMouseMove}
    >
      <div 
        className="absolute inset-0 pointer-events-none opacity-70" 
        style={dotPattern('rgb(212 212 212)')} // neutral-300 for light mode
      />
      <div 
        className="absolute inset-0 dark:opacity-70 opacity-0 pointer-events-none" 
        style={dotPattern('rgb(38 38 38)')} // neutral-800 for dark mode
      />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          ...dotPattern('rgb(99 102 241)'), // indigo-500
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}
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
        `relative inline-block text-3xl sm:text-4xl md:text-5xl lg:text-6xl`,
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
        duration: 2,
        ease: "linear",
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

