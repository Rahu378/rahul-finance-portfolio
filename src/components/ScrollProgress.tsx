import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left"
      style={{ scaleX: x, background: "var(--accent)" }}
      aria-hidden
    />
  );
}
