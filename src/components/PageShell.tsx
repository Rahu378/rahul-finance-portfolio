import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Wraps every route: consistent enter transition + top padding under the fixed nav. */
export default function PageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`relative z-10 ${className}`}
    >
      {children}
    </motion.main>
  );
}
