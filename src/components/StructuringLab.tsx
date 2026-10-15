import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock, FileText, Play, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EASE, fmtMoney } from "./ui";

const CTR = 10_000;

type Txn = { id: string; h: number; branch: string; type: "Cash deposit" | "Card payment" | "Wire out"; amount: number };

/** Sample activity for one customer over four days. Hours are measured from Monday 00:00. */
const TXNS: Txn[] = [
  { id: "T1", h: 9.23, branch: "Branch A", type: "Cash deposit", amount: 9500 },
  { id: "T2", h: 15.67, branch: "Branch B", type: "Cash deposit", amount: 9400 },
  { id: "T3", h: 17.08, branch: "Online", type: "Card payment", amount: 120 },
  { id: "T4", h: 34.37, branch: "Branch C", type: "Cash deposit", amount: 9800 },
  { id: "T5", h: 35.5, branch: "Branch A", type: "Wire out", amount: 27000 },
  { id: "T6", h: 61.17, branch: "Branch A", type: "Cash deposit", amount: 4200 },
  { id: "T7", h: 81.75, branch: "Branch B", type: "Cash deposit", amount: 9700 },
  { id: "T8", h: 88.33, branch: "Branch A", type: "Cash deposit", amount: 2000 },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu"];
const when = (h: number) => {
  const d = Math.floor(h / 24);
  const mins = Math.round((h - d * 24) * 60);
  return `${DAYS[d]} ${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
};

function detect(windowH: number, bandPct: number) {
  const cash = TXNS.filter((t) => t.type === "Cash deposit");
  const near = cash.filter((t) => t.amount >= (bandPct / 100) * CTR && t.amount < CTR);
  const flagged = new Set<string>();
  for (const t of near) {
    const win = near.filter((o) => o.h <= t.h && o.h > t.h - windowH);
    const sum = win.reduce((s, o) => s + o.amount, 0);
    if (win.length >= 2 && sum >= CTR) win.forEach((o) => flagged.add(o.id));
  }
  const hits = TXNS.filter((t) => flagged.has(t.id));
  const total = hits.reduce((s, t) => s + t.amount, 0);
  const span = hits.length ? hits[hits.length - 1].h - hits[0].h : 0;
  const branches = new Set(hits.map((t) => t.branch)).size;
  return { cash, near, flagged, hits, total, span, branches };
}

export default function StructuringLab() {
  const [windowH, setWindowH] = useState(72);
  const [band, setBand] = useState(80);
  const [run, setRun] = useState(0);
  const [stepShown, setStepShown] = useState(6);
  const r = useMemo(() => detect(windowH, band), [windowH, band]);
  const alert = r.hits.length > 0;

  const steps = [
    { icon: Clock, text: `Pulled ${TXNS.length} transactions for customer C-1042 across four days` },
    { icon: ShieldCheck, text: "Screened counterparties against the sanctions list: no match" },
    { icon: FileText, text: `Kept ${r.cash.length} cash deposits; ${r.near.length} sit between ${fmtMoney((band / 100) * CTR, false)} and the $10,000 CTR line` },
    { icon: Clock, text: `Aggregated near-threshold deposits inside rolling ${windowH}-hour windows` },
    alert
      ? { icon: AlertTriangle, text: `${r.hits.length} deposits totalling ${fmtMoney(r.total, false)} in ${r.span.toFixed(0)} hours at ${r.branches} branches`, bad: true }
      : { icon: CheckCircle2, text: "No window adds up past the reporting line", good: true },
    { icon: FileText, text: alert ? "Drafted an audit-ready narrative for SAR review" : "Closed with no alert; evidence retained" },
  ];

  useEffect(() => {
    if (run === 0) return;
    setStepShown(0);
    let i = 0;
    const id = setInterval(() => { i += 1; setStepShown(i); if (i >= steps.length) clearInterval(id); }, 420);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  const narrative = alert
    ? `Between ${when(r.hits[0].h)} and ${when(r.hits[r.hits.length - 1].h)}, customer C-1042 made ${r.hits.length} cash deposits of ${fmtMoney(Math.min(...r.hits.map((t) => t.amount)), false)} to ${fmtMoney(Math.max(...r.hits.map((t) => t.amount)), false)} at ${r.branches} branches, totalling ${fmtMoney(r.total, false)}. Each was below the $10,000 Currency Transaction Report threshold; together they exceed it within ${windowH} hours. A $27,000 wire left the account on ${when(35.5)}. The pattern is consistent with structuring. Recommend SAR review.`
    : "No combination of near-threshold cash deposits exceeds $10,000 inside the selected window. Widen the window or lower the band to see how sensitive the rule is.";

  return (
    <div className="card overflow-hidden" style={{ background: "var(--panel-solid)" }} data-ui>
      {/* controls */}
      <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-[13px] font-semibold">Lookback window</p>
            <div className="mt-2 flex rounded-full p-1" style={{ background: "var(--panel-raised)" }} role="radiogroup" aria-label="Lookback window">
              {[24, 48, 72].map((w) => (
                <button key={w} onClick={() => setWindowH(w)} role="radio" aria-checked={windowH === w}
                  className="relative isolate rounded-full px-3.5 py-1.5 text-[13px] font-medium"
                  style={{ color: windowH === w ? "var(--on-accent)" : "var(--text-muted)" }}>
                  {windowH === w && <motion.span layoutId="lab-win" className="absolute inset-0 -z-10 rounded-full" style={{ background: "var(--accent)" }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  {w}h
                </button>
              ))}
            </div>
          </div>
          <label className="block min-w-[200px]">
            <span className="flex items-baseline justify-between text-[13px] font-semibold">
              Near-threshold band <span className="num font-semibold" style={{ color: "var(--brass)" }}>≥ {fmtMoney((band / 100) * CTR, false)}</span>
            </span>
            <input type="range" className="slider mt-2" min={70} max={95} step={5} value={band} onChange={(e) => setBand(Number(e.target.value))}
              style={{ ["--fill" as any]: `${((band - 70) / 25) * 100}%` }} aria-label="Near-threshold band" />
          </label>
        </div>
        <motion.button onClick={() => setRun((n) => n + 1)} whileTap={{ scale: 0.96 }} data-cursor="Run"
          className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold">
          <Play size={14} /> Run the review
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        {/* transactions */}
        <div className="overflow-x-auto p-5 sm:p-6">
          <table className="w-full min-w-[440px] text-[13px]">
            <caption className="mb-3 text-left text-[13px] font-semibold">Customer C-1042 · sample activity</caption>
            <thead>
              <tr className="text-left text-[12px] text-faint">
                <th className="pb-2 font-normal">When</th><th className="pb-2 font-normal">Where</th>
                <th className="pb-2 font-normal">Type</th><th className="pb-2 text-right font-normal">Amount</th>
              </tr>
            </thead>
            <tbody>
              {TXNS.map((t) => {
                const hit = r.flagged.has(t.id);
                const near = r.near.some((n) => n.id === t.id);
                return (
                  <motion.tr key={t.id} layout
                    animate={{ backgroundColor: hit ? "color-mix(in oklab, var(--rose) 12%, transparent)" : "rgba(0,0,0,0)" }}
                    transition={{ duration: 0.35 }}
                    style={{ borderTop: "1px solid var(--border)" }}>
                    <td className="num py-2.5 pl-1 text-muted">{when(t.h)}</td>
                    <td className="py-2.5">{t.branch}</td>
                    <td className="py-2.5 text-muted">{t.type}</td>
                    <td className="num py-2.5 pr-1 text-right font-medium" style={{ color: hit ? "var(--rose)" : near ? "var(--brass)" : undefined }}>
                      <span className="inline-flex items-center gap-1.5">
                        {hit && <AlertTriangle size={12} />}
                        {fmtMoney(t.amount, false)}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-4 text-[12.5px] leading-relaxed text-faint">
            Sample data and a simplified rule, so the shape of the reasoning is visible. FinSight layers multi-step LLM
            review and tool calls on top of rules like this one.
          </p>
        </div>

        {/* trace */}
        <div className="p-5 sm:p-6" style={{ background: "var(--panel-raised)" }}>
          <p className="text-[13px] font-semibold">Agent trace</p>
          <ol className="mt-3 space-y-2.5" aria-live="polite">
            {steps.map((s, i) => (
              <AnimatePresence key={`${run}-${i}`}>
                {i < stepShown && (
                  <motion.li
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="flex items-start gap-2.5 text-[13.5px] leading-snug">
                    <s.icon size={14} className="mt-0.5 shrink-0"
                      style={{ color: (s as any).bad ? "var(--rose)" : (s as any).good ? "var(--accent)" : "var(--text-faint)" }} />
                    <span style={{ color: (s as any).bad ? "var(--rose)" : undefined }}>{s.text}</span>
                  </motion.li>
                )}
              </AnimatePresence>
            ))}
          </ol>

          <AnimatePresence mode="wait">
            {stepShown >= steps.length && (
              <motion.div key={`${run}-${windowH}-${band}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="mt-5 rounded-xl p-4" style={{ background: "var(--panel-solid)", border: `1px solid ${alert ? "color-mix(in oklab, var(--rose) 35%, transparent)" : "var(--border)"}` }}>
                <p className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: alert ? "var(--rose)" : "var(--accent)" }}>
                  {alert ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                  {alert ? "Possible structuring" : "No alert"}
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{narrative}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
