import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASE } from "./ui";

/** Small drawings for the three home pillars. Drawn from the work itself, not icons. */

function useOnce() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return { ref, inView };
}

/** Two books side by side, matched row by row; one connector breaks. */
export function TieOutVisual() {
  const { ref, inView } = useOnce();
  const rows = [0, 1, 2, 3, 4];
  return (
    <svg ref={ref} viewBox="0 0 280 132" className="w-full" aria-hidden>
      <text x="8" y="12" fontSize="10" fill="var(--text-faint)">Cash</text>
      <text x="272" y="12" fontSize="10" fill="var(--text-faint)" textAnchor="end">Positions</text>
      {rows.map((r) => {
        const y = 24 + r * 21;
        const broken = r === 3;
        return (
          <g key={r}>
            <motion.rect x="8" y={y} height="11" rx="3" fill="var(--panel-raised)"
              initial={{ width: 0 }} animate={inView ? { width: 64 + (r % 3) * 14 } : {}}
              transition={{ delay: r * 0.08, duration: 0.7, ease: EASE }} />
            <motion.rect y={y} height="11" rx="3" fill="var(--panel-raised)"
              initial={{ width: 0, x: 272 }} animate={inView ? { width: 64 + (r % 3) * 14 - (broken ? 18 : 0), x: 272 - (64 + (r % 3) * 14 - (broken ? 18 : 0)) } : {}}
              transition={{ delay: r * 0.08, duration: 0.7, ease: EASE }} />
            <motion.path
              d={`M ${8 + 64 + (r % 3) * 14 + 6} ${y + 5.5} L ${272 - (64 + (r % 3) * 14 - (broken ? 18 : 0)) - 6} ${y + 5.5}`}
              stroke={broken ? "var(--rose)" : "var(--accent)"} strokeWidth="1.6" strokeLinecap="round"
              strokeDasharray={broken ? "3 4" : undefined}
              initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ delay: 0.6 + r * 0.12, duration: 0.6, ease: EASE }} />
            {broken && (
              <motion.circle cx="140" cy={y + 5.5} r="5" fill="var(--rose)"
                initial={{ scale: 0 }} animate={inView ? { scale: [0, 1.4, 1] } : {}}
                transition={{ delay: 1.3, duration: 0.5 }} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Deposits against the $10,000 reporting line: the ones kept just under it light up. */
export function ControlVisual() {
  const { ref, inView } = useOnce();
  const bars = [32, 55, 92, 94, 28, 93, 46, 91, 38, 60];
  const H = 104, base = 120, line = base - H * 0.97;
  return (
    <svg ref={ref} viewBox="0 0 280 132" className="w-full" aria-hidden>
      <motion.line x1="4" x2="276" y1={line} y2={line} stroke="var(--brass)" strokeWidth="1.2" strokeDasharray="4 4"
        initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 0.9, ease: EASE }} />
      <text x="276" y={line - 5} fontSize="10" fill="var(--brass)" textAnchor="end">$10,000</text>
      {bars.map((b, i) => {
        const flagged = b > 88;
        const h = (b / 100) * H;
        return (
          <motion.rect key={i} x={10 + i * 27} width="17" rx="3"
            fill={flagged ? "var(--rose)" : "var(--panel-raised)"}
            initial={{ height: 0, y: base }}
            animate={inView ? { height: h, y: base - h } : {}}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease: EASE }} />
        );
      })}
      <line x1="4" x2="276" y1={base} y2={base} stroke="var(--border-strong)" />
    </svg>
  );
}

/** A tiny price-volume-mix bridge from budget to actual. */
export function BridgeVisual() {
  const { ref, inView } = useOnce();
  const steps = [
    { label: "Budget", from: 0, to: 70, c: "var(--text-faint)" },
    { label: "Volume", from: 70, to: 88, c: "var(--accent)" },
    { label: "Price", from: 88, to: 76, c: "var(--rose)" },
    { label: "Mix", from: 76, to: 83, c: "var(--accent)" },
    { label: "Actual", from: 0, to: 83, c: "var(--sky)" },
  ];
  const base = 112, k = 1.05;
  return (
    <svg ref={ref} viewBox="0 0 280 132" className="w-full" aria-hidden>
      {steps.map((s, i) => {
        const top = base - Math.max(s.from, s.to) * k;
        const h = Math.abs(s.to - s.from) * k;
        return (
          <g key={s.label}>
            <motion.rect x={14 + i * 53} width="36" rx="3" fill={s.c}
              initial={{ height: 0, y: base - s.from * k }}
              animate={inView ? { height: h, y: top } : {}}
              transition={{ delay: 0.15 + i * 0.14, duration: 0.6, ease: EASE }} />
            {i < steps.length - 1 && (
              <motion.line x1={14 + i * 53 + 36} x2={14 + (i + 1) * 53} y1={base - s.to * k} y2={base - s.to * k}
                stroke="var(--border-strong)" strokeDasharray="2 3"
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 + i * 0.14 }} />
            )}
            <text x={14 + i * 53 + 18} y="127" fontSize="9.5" fill="var(--text-faint)" textAnchor="middle">{s.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
