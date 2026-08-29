import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  // Honour the OS "reduce motion" setting: cross-fade only, no travel.
  const reduceMotion = useReducedMotion();
  const offset = reduceMotion ? 0 : 20;

  return (
    <motion.div
      initial={{ opacity: 0, y: offset }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -offset }}
      transition={{
        duration: reduceMotion ? 0.12 : 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
