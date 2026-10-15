import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { AlertTriangle, CheckCircle2, Filter, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EASE } from "./ui";

const STAGES = ["Exec", "Capture", "Alloc", "Confirm", "Clear", "Settle", "Recon"];

type Phase = 0 | 1 | 2; // matching → break found → resolved

const ROWS = [
  { id: "TRD-48211", inst: "US equity", cust: "10,000", books: "10,000" },
  { id: "TRD-48214", inst: "UST 2034", cust: "2.50M", books: "2.50M" },
  { id: "TRD-48219", inst: "US equity", cust: "10,500", books: "10,000", watch: true },
  { id: "TRD-48223", inst: "USD cash", cust: "1.25M", books: "1.25M" },
];

/** A sample reconciliation monitor: trades flow through the lifecycle, one breaks at recon and gets resolved. */
export default function HeroLedger() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 160, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 160, damping: 20 });

  const [phase, setPhase] = useState<Phase>(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduce) { setPhase(2); return; }
    const id = setInterval(() => {
      setPhase((p) => {
        const next = ((p + 1) % 3) as Phase;
        if (next === 0) setCycle((c) => c + 1);
        return next;
      });
    }, 2400);
    return () => clearInterval(id);
  }, [reduce]);

  const kpis = [
    { k: "Matched", v: phase === 1 ? "99.1%" : phase === 2 ? "100%" : "98.7%", c: "var(--accent)" },
    { k: "Open breaks", v: phase === 1 ? "1" : "0", c: phase === 1 ? "var(--rose)" : "var(--text)" },
    { k: "Settles", v: "T+1", c: "var(--sky)" },
  ];

  return (
    <motion.div
      ref={wrap}
      onPointerMove={(e) => {
        const r = wrap.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
      className="relative w-full max-w-[468px]"
      aria-label="Sample reconciliation monitor"
      role="img"
      data-ui
    >
      <div className="card overflow-hidden rounded-[22px]" style={{ background: "var(--panel-solid)", boxShadow: "var(--shadow-lg)" }}>
        {/* chrome */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2.5">
            <span className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: "color-mix(in oklab, var(--rose) 65%, transparent)" }} />
              <span className="h-2 w-2 rounded-full" style={{ background: "color-mix(in oklab, var(--brass) 65%, transparent)" }} />
              <span className="h-2 w-2 rounded-full" style={{ background: "color-mix(in oklab, var(--accent) 65%, transparent)" }} />
            </span>
            <span className="text-[12px] font-medium text-muted">Recon monitor · sample feed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ color: "var(--accent)", background: "color-mix(in oklab, var(--accent) 12%, transparent)" }}>
              <ShieldCheck size={10} /> OFAC screened
            </span>
            <motion.span animate={{ rotate: phase === 0 ? 360 * (cycle + 1) : 360 * cycle }} transition={{ duration: 1, ease: "linear" }}>
              <RefreshCw size={11} style={{ color: phase === 0 ? "var(--accent)" : "var(--text-faint)" }} />
            </motion.span>
          </div>
        </div>

        {/* filters */}
        <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
          <Filter size={10} style={{ color: "var(--text-faint)" }} />
          {["Trade date T", "All desks", "USD"].map((f, i) => (
            <motion.span key={f}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }}
              className="rounded-full px-2 py-0.5 text-[10.5px]"
              style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              {f}
            </motion.span>
          ))}
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-3 gap-px" style={{ background: "var(--border)" }}>
          {kpis.map((t, i) => (
            <motion.div key={t.k}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + i * 0.09, duration: 0.6, ease: EASE }}
              className="px-3.5 py-3" style={{ background: "var(--panel-solid)" }}>
              <p className="text-[10.5px] text-faint">{t.k}</p>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p key={t.v}
                  initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="num mt-0.5 text-[19px] font-semibold tracking-tight" style={{ color: t.c }}>
                  {t.v}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* lifecycle rail */}
        <div className="px-4 pt-4 pb-3">
          <div className="mb-3 flex items-baseline justify-between">
            <p className="text-[12px] font-semibold">Trade lifecycle</p>
            <p className="text-[10.5px] text-faint">execution → reconciliation</p>
          </div>
          <div className="relative h-7">
            <div className="absolute inset-x-1 top-[9px] h-px" style={{ background: "var(--border-strong)" }} />
            <div className="absolute inset-x-1 top-0 flex justify-between">
              {STAGES.map((s, i) => {
                const isRecon = i === STAGES.length - 1;
                const c = isRecon && phase === 1 ? "var(--rose)" : isRecon ? "var(--accent)" : "var(--text-faint)";
                return (
                  <span key={s} className="flex flex-col items-center gap-1">
                    <motion.span className="h-[7px] w-[7px] rounded-full mt-[6px]"
                      animate={{ background: c, scale: isRecon && phase === 1 ? 1.5 : 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ border: "1.5px solid var(--panel-solid)" }} />
                    <span className="text-[9px] text-faint">{s}</span>
                  </span>
                );
              })}
            </div>
            {/* trades in flight */}
            {!reduce && [0, 1, 2].map((k) => (
              <motion.div key={`${cycle}-${k}`} className="absolute inset-x-1 top-[6px] h-2"
                initial={{ x: "0%", opacity: 0 }} animate={{ x: "100%", opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.2, delay: k * 0.7, ease: [0.45, 0, 0.55, 1], opacity: { duration: 2.2, delay: k * 0.7, times: [0, 0.1, 0.85, 1] } }}>
                <span className="absolute left-0 h-2 w-2 -translate-x-1/2 rounded-full"
                  style={{ background: k === 1 ? "var(--brass)" : "var(--accent)", boxShadow: "0 0 0 3px color-mix(in oklab, var(--accent) 18%, transparent)" }} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ledger */}
        <div className="px-4 pb-4">
          <div className="overflow-hidden rounded-xl" style={{ border: "1px solid var(--border)" }}>
            <div className="grid grid-cols-[1.15fr_1fr_0.8fr_0.8fr_1fr] gap-2 px-3 py-2 text-[10px] text-faint" style={{ background: "var(--panel-raised)" }}>
              <span>Trade</span><span>Instrument</span><span className="text-right">Custody</span><span className="text-right">Books</span><span className="text-right">Status</span>
            </div>
            {ROWS.map((r, i) => {
              const breakNow = r.watch && phase === 1;
              const status = !r.watch ? "Matched" : phase === 0 ? "Matching" : phase === 1 ? "Break +500" : "Resolved";
              const sc = !r.watch ? "var(--accent)" : phase === 0 ? "var(--text-faint)" : phase === 1 ? "var(--rose)" : "var(--accent)";
              return (
                <motion.div key={r.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + i * 0.08, duration: 0.5, ease: EASE }}
                  className="grid grid-cols-[1.15fr_1fr_0.8fr_0.8fr_1fr] items-center gap-2 px-3 py-2 text-[11px] transition-colors duration-500"
                  style={{
                    borderTop: "1px solid var(--border)",
                    background: breakNow ? "color-mix(in oklab, var(--rose) 9%, transparent)" : "transparent",
                  }}>
                  <span className="num font-mono text-[10.5px] text-muted">{r.id}</span>
                  <span className="truncate">{r.inst}</span>
                  <span className="num text-right" style={{ color: breakNow ? "var(--rose)" : undefined }}>{r.cust}</span>
                  <span className="num text-right">{r.watch && phase === 2 ? r.cust : r.books}</span>
                  <span className="flex items-center justify-end gap-1 text-[10.5px] font-medium" style={{ color: sc }}>
                    {r.watch && phase === 1 && <AlertTriangle size={10} />}
                    {(!r.watch || phase === 2) && <CheckCircle2 size={10} />}
                    {status}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={phase}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="mt-2.5 text-[11px] text-faint">
              {phase === 0 && "Matching custody against the books for trade date T…"}
              {phase === 1 && <span style={{ color: "var(--rose)" }}>TRD-48219: custody shows 500 more shares. Cause: 5% stock dividend not yet booked.</span>}
              {phase === 2 && <span>Corporate action booked. Custody and books tie out.</span>}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* floating notes */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 2.0, duration: 0.7, ease: EASE }}
        className="float-slow absolute -top-9 -left-10 hidden rounded-xl px-3 py-2 sm:block"
        style={{ background: "var(--panel-raised)", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-lg)" }}>
        <p className="text-[10px] text-faint">Cash vs. position</p>
        <p className="text-[12.5px] font-semibold" style={{ color: "var(--accent)" }}>Tied out</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }} animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 2.15, duration: 0.7, ease: EASE }}
        className="float-slow absolute -right-6 -bottom-5 hidden rounded-xl px-3 py-2 sm:block"
        style={{ background: "var(--panel-raised)", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-lg)", animationDelay: "1.4s" }}>
        <p className="text-[10px] text-faint">Custody vs. accounting</p>
        <p className="flex items-center gap-1.5 text-[12.5px] font-semibold" style={{ color: "var(--brass)" }}>
          <CheckCircle2 size={12} /> 0 open
        </p>
      </motion.div>
    </motion.div>
  );
}
