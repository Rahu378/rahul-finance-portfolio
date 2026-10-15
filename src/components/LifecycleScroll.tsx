import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useMediaQuery } from "../lib/hooks";
import { EASE, Reveal } from "./ui";

const STAGES = [
  { name: "Execution", when: "T", body: "The trade is agreed. Everything downstream depends on it being captured exactly as it was executed." },
  { name: "Capture", when: "T", body: "Booked into the system of record: quantity, price, account and settlement instructions. A typo here becomes a break two days later." },
  { name: "Allocation", when: "T", body: "Block trades split across client accounts. An allocation error looks like a position break by the time anyone sees it." },
  { name: "Confirmation", when: "T", body: "Both sides agree the terms. Mismatches caught here are the cheapest ones to fix." },
  { name: "Clearing", when: "T to T+1", body: "Obligations netted and guaranteed. What cash and which securities are owed is now fixed." },
  { name: "Settlement", when: "T+1", body: "Cash and securities change hands. Since May 2024, one business day after trade date for US equities." },
  { name: "Reconciliation", when: "T+1", body: "Cash against position, custody against accounting. The stage where I find what went wrong upstream, and why, and route it to whoever can fix it." },
];

/**
 * Signature move: the page scrolls a trade through its lifecycle.
 * Desktop pins the rail and advances a token stage by stage; phones get a plain stacked list.
 */
export default function LifecycleScroll() {
  const wide = useMediaQuery("(min-width: 1024px)");
  return wide ? <Pinned /> : <Stacked />;
}

function Pinned() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.0005 });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(STAGES.length - 1, Math.max(0, Math.round(v * (STAGES.length - 1)))));
  });
  const fill = useTransform(p, [0, 1], [0.04, 1]);
  const tokenLeft = useTransform(p, [0, 1], ["0%", "100%"]);
  const stage = STAGES[active];
  const last = active === STAGES.length - 1;

  return (
    <section ref={ref} className="relative" style={{ height: `${STAGES.length * 34 + 70}vh` }} aria-label="Trade lifecycle">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center">
        <div className="shell-wide">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_1fr]">
            <h2 className="display text-[clamp(2.2rem,4.6vw,3.6rem)]">
              Every break was born <span className="accent-word">upstream</span>
            </h2>
            <p className="max-w-[52ch] text-[17px] leading-[1.6] text-muted">
              Scroll a trade from execution to reconciliation. Knowing which stage a break started in is most
              of the work of fixing it.
            </p>
          </div>

          {/* rail */}
          <div className="relative mx-14 mt-20">
            <div className="absolute inset-x-0 top-[11px] h-[3px] rounded-full" style={{ background: "color-mix(in oklab, var(--text) 10%, transparent)" }} />
            <motion.div className="absolute inset-x-0 top-[11px] h-[3px] origin-left rounded-full"
              style={{ scaleX: fill, background: last ? "var(--accent)" : "var(--sky)" }} />
            <motion.div className="pointer-events-none absolute top-0 h-6 w-0" style={{ left: tokenLeft }}>
              <span className="absolute left-0 top-[3px] h-[19px] w-[19px] -translate-x-1/2 rounded-full"
                style={{ background: "var(--panel-solid)", border: `3px solid ${last ? "var(--accent)" : "var(--sky)"}` }} />
            </motion.div>

            <ol className="relative flex justify-between">
              {STAGES.map((s, i) => {
                const reached = i <= active;
                return (
                  <li key={s.name} className="flex w-0 flex-col items-center">
                    <span className="h-[25px] w-[25px] rounded-full transition-[background,transform,border-color] duration-500"
                      style={{
                        background: reached ? (last ? "var(--accent)" : "var(--sky)") : "var(--bg)",
                        border: `2px solid ${reached ? "var(--bg)" : "var(--border-strong)"}`,
                        transform: reached ? "scale(0.72)" : "scale(1)",
                      }} />
                    <span className="mt-4 text-[14px] font-semibold whitespace-nowrap transition-colors duration-500"
                      style={{ color: i === active ? "var(--text)" : reached ? "var(--text-muted)" : "var(--text-faint)" }}>
                      {s.name}
                    </span>
                    <span className="num mt-1 text-[12px] whitespace-nowrap text-faint">{s.when}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* stage narrative */}
          <div className="mt-16 grid gap-8 lg:grid-cols-[0.4fr_0.6fr]">
            <AnimatePresence mode="wait">
              <motion.p key={stage.name}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="display text-[clamp(3rem,6.4vw,5.6rem)]" style={{ color: last ? "var(--accent)" : "var(--text)" }}>
                {stage.name}
              </motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p key={stage.body}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, delay: 0.05, ease: EASE }}
                className="max-w-[46ch] self-center text-[clamp(1.15rem,1.8vw,1.5rem)] leading-[1.5]">
                {stage.body}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stacked() {
  return (
    <section className="shell-wide py-24" aria-label="Trade lifecycle">
      <Reveal>
        <h2 className="display text-[clamp(2rem,8vw,2.8rem)]">
          Every break was born <span className="accent-word">upstream</span>
        </h2>
        <p className="mt-5 text-[16px] leading-[1.6] text-muted">
          Knowing which stage of the lifecycle a break started in is most of the work of fixing it.
        </p>
      </Reveal>
      <ol className="relative mt-10 space-y-7 pl-8">
        <span className="absolute top-2 bottom-2 left-[9px] w-[2px] rounded-full" style={{ background: "color-mix(in oklab, var(--text) 10%, transparent)" }} />
        {STAGES.map((s, i) => (
          <motion.li key={s.name} className="relative"
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: EASE }}>
            <span className="absolute top-[5px] -left-8 h-5 w-5 rounded-full"
              style={{ background: "var(--bg)", border: `3px solid ${i === STAGES.length - 1 ? "var(--accent)" : "var(--sky)"}` }} />
            <p className="flex items-baseline gap-3">
              <span className="text-[19px] font-semibold tracking-tight">{s.name}</span>
              <span className="num text-[12.5px] text-faint">{s.when}</span>
            </p>
            <p className="mt-1.5 text-[15px] leading-[1.6] text-muted">{s.body}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
