'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

/**
 * Simple left->right slide + fade transition on route change.
 * Respects prefers-reduced-motion.
 */
export default function PageTransition({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const variants = {
    initial: { x: reduce ? 0 : 40, opacity: 0 },
    in:      { x: 0,          opacity: 1 },
    out:     { x: reduce ? 0 : -40, opacity: 0 },
  };

  const transition = {
    type: 'tween' as const,
    ease: 'easeOut',
    duration: 0.28,
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}              // re-mount on route change
          initial="initial"
          animate="in"
          exit="out"
          variants={variants}
          transition={transition}
          className="min-h-[60vh]"   // keep layout stable while animating
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
