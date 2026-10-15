import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { EASE } from "./ui";

const STEPS = [
  "Loading positions from the book of record",
  "Matching cash against positions",
  "Tying custody to accounting",
  "Screening counterparties",
  "Closing the period",
];

/** A short close-the-books cold start. Runs once per browser session. */
export default function Boot({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(() => {
    if (typeof navigator !== "undefined" && navigator.webdriver) return false;
    try { return sessionStorage.getItem("rr-fin-booted") !== "1"; } catch { return true; }
  });
  const [step, setStep] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!show) { onDone(); return; }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = reduced ? 600 : 2300;
    const t0 = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / total);
      setPct(p * 100);
      setStep(Math.min(STEPS.length, Math.floor(p * STEPS.length + 0.0001)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        try { sessionStorage.setItem("rr-fin-booted", "1"); } catch { /* ignore */ }
        setTimeout(() => { setShow(false); onDone(); }, 380);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center px-6"
          style={{ background: "var(--bg)" }}
          exit={{ opacity: 0, filter: "blur(14px)", scale: 1.02 }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <div className="grid-bg grid-fade absolute inset-0 opacity-60" />

          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative w-full max-w-[360px]"
          >
            <p className="text-[17px] font-semibold tracking-tight">Rahul Reddy CH</p>
            <p className="mt-0.5 text-[13px] text-muted">Financial Analyst</p>

            <ul className="mt-7 space-y-2.5" aria-live="polite">
              {STEPS.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <motion.li key={s}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: done || active ? 1 : 0.35, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                    className="flex items-center gap-3 text-[13px]">
                    <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full transition-colors duration-300"
                      style={{
                        background: done ? "var(--accent)" : "transparent",
                        border: `1.5px solid ${done ? "var(--accent)" : active ? "color-mix(in oklab, var(--accent) 60%, transparent)" : "var(--border-strong)"}`,
                      }}>
                      {done && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 22 }}>
                          <Check size={11} strokeWidth={3} color="var(--on-accent)" />
                        </motion.span>
                      )}
                    </span>
                    <span style={{ color: done ? "var(--text)" : "var(--text-muted)" }}>
                      {s}{active && <span className="tick">…</span>}
                    </span>
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-7 flex items-center gap-3">
              <div className="h-[3px] flex-1 overflow-hidden rounded-full" style={{ background: "color-mix(in oklab, var(--text) 12%, transparent)" }}>
                <div className="h-full origin-left rounded-full" style={{ transform: `scaleX(${pct / 100})`, background: "var(--accent)" }} />
              </div>
              <span className="num w-10 text-right font-mono text-[11px] text-faint">{Math.round(pct)}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
