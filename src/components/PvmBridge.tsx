import { motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { pvmBudget } from "../data/profile";
import { EASE, fmtMoney } from "./ui";

type Inputs = { price: number; volume: number; mix: number };
const DEFAULTS: Inputs = { price: 3, volume: -5, mix: 4 };

/** Price-volume-mix decomposition: budget + volume + mix + price = actual, exactly. */
export function computePvm({ price, volume, mix }: Inputs) {
  const bq = pvmBudget.reduce((s, p) => s + p.qty, 0);
  const bMix = pvmBudget.map((p) => p.qty / bq);
  const aq = bq * (1 + volume / 100);
  // shift share from Core (index 0) to Premium (index 1); Add-ons keep their share
  const shift = mix / 100;
  const aMixRaw = [bMix[0] - shift, bMix[1] + shift, bMix[2]].map((m) => Math.max(0, m));
  const sum = aMixRaw.reduce((a, b) => a + b, 0);
  const aMix = aMixRaw.map((m) => m / sum);
  const bp = pvmBudget.map((p) => p.price);
  const ap = bp.map((p) => p * (1 + price / 100));
  const aQty = aMix.map((m) => m * aq);

  const budgetRev = pvmBudget.reduce((s, p) => s + p.price * p.qty, 0);
  const volumeVar = (aq - bq) * bMix.reduce((s, m, i) => s + m * bp[i], 0);
  const mixVar = aq * aMix.reduce((s, m, i) => s + (m - bMix[i]) * bp[i], 0);
  const priceVar = ap.reduce((s, p, i) => s + (p - bp[i]) * aQty[i], 0);
  const actualRev = ap.reduce((s, p, i) => s + p * aQty[i], 0);
  return { budgetRev, volumeVar, mixVar, priceVar, actualRev, aMix };
}

export default function PvmBridge() {
  const [inp, setInp] = useState<Inputs>(DEFAULTS);
  const r = useMemo(() => computePvm(inp), [inp]);
  const delta = r.actualRev - r.budgetRev;
  const ties = Math.abs(r.budgetRev + r.volumeVar + r.mixVar + r.priceVar - r.actualRev) < 0.5;

  const bars = [
    { label: "Budget", start: 0, end: r.budgetRev, kind: "total" as const },
    { label: "Volume", start: r.budgetRev, end: r.budgetRev + r.volumeVar, kind: "delta" as const },
    { label: "Mix", start: r.budgetRev + r.volumeVar, end: r.budgetRev + r.volumeVar + r.mixVar, kind: "delta" as const },
    { label: "Price", start: r.budgetRev + r.volumeVar + r.mixVar, end: r.actualRev, kind: "delta" as const },
    { label: "Actual", start: 0, end: r.actualRev, kind: "total" as const },
  ];

  // y scale: start the axis below zero so small variances stay visible
  const maxV = Math.max(...bars.map((b) => Math.max(b.start, b.end))) * 1.08;
  const minV = Math.min(...bars.map((b) => Math.min(b.start || Infinity, b.end))) * 0.78;
  const W = 640, H = 300, top = 28, bottom = 36, left = 8, right = 8;
  const plotH = H - top - bottom;
  const y = (v: number) => top + (1 - (Math.max(v, minV) - minV) / (maxV - minV)) * plotH;
  const colW = (W - left - right) / bars.length;
  const bw = Math.min(78, colW * 0.62);

  const set = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) => setInp((s) => ({ ...s, [k]: Number(e.target.value) }));
  const sliders: { k: keyof Inputs; label: string; min: number; max: number; unit: string; hint: string }[] = [
    { k: "price", label: "Price change", min: -10, max: 10, unit: "%", hint: "applied to every product line" },
    { k: "volume", label: "Volume change", min: -20, max: 20, unit: "%", hint: "total units against budget" },
    { k: "mix", label: "Mix shift to Premium", min: -10, max: 10, unit: " pts", hint: "share of units moved from Core" },
  ];

  const commentary = (() => {
    const parts = [
      { n: "volume", v: r.volumeVar },
      { n: `mix ${inp.mix >= 0 ? "toward" : "away from"} Premium`, v: r.mixVar },
      { n: "pricing", v: r.priceVar },
    ].sort((a, b) => Math.abs(b.v) - Math.abs(a.v));
    const word = (v: number) => (v >= 0 ? "added" : "cost");
    return `Revenue landed ${fmtMoney(Math.abs(delta))} ${delta >= 0 ? "above" : "below"} budget. ` +
      parts.map((p, i) => `${i === 0 ? capital(p.n) : p.n} ${word(p.v)} ${fmtMoney(Math.abs(p.v))}`).join(", ") + ".";
  })();

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="flex flex-col">
        <div className="space-y-6">
          {sliders.map((s) => {
            const v = inp[s.k];
            const fill = ((v - s.min) / (s.max - s.min)) * 100;
            return (
              <label key={s.k} className="block">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-[14px] font-semibold">{s.label}</span>
                  <span className="num text-[15px] font-semibold" style={{ color: v === 0 ? "var(--text-muted)" : v > 0 ? "var(--accent)" : "var(--rose)" }}>
                    {v > 0 ? "+" : ""}{v}{s.unit}
                  </span>
                </span>
                <input type="range" className="slider mt-2" min={s.min} max={s.max} step={1} value={v} onChange={set(s.k)}
                  style={{ ["--fill" as any]: `${fill}%` }} aria-label={s.label} />
                <span className="text-[12.5px] text-faint">{s.hint}</span>
              </label>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl p-4" style={{ background: "var(--panel-raised)" }}>
          <p className="text-[14px] leading-relaxed">{commentary}</p>
          <p className="mt-2 flex items-center gap-1.5 text-[12.5px]" style={{ color: ties ? "var(--accent)" : "var(--rose)" }}>
            <Check size={13} /> Budget + volume + mix + price = actual {ties ? "(ties to the dollar)" : "(does not tie)"}
          </p>
        </div>

        <button onClick={() => setInp(DEFAULTS)} className="btn-ghost mt-4 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[13px]">
          <RotateCcw size={13} /> Reset inputs
        </button>
      </div>

      <div className="min-w-0">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
          aria-label={`Revenue bridge from budget ${fmtMoney(r.budgetRev)} to actual ${fmtMoney(r.actualRev)}`}>
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1={left} x2={W - right} y1={top + plotH * g} y2={top + plotH * g} stroke="var(--grid-line)" />
          ))}
          {bars.map((b, i) => {
            const x = left + i * colW + (colW - bw) / 2;
            const lo = b.kind === "total" ? minV : Math.min(b.start, b.end);
            const hi = Math.max(b.start, b.end);
            const yTop = y(hi);
            const h = Math.max(2, y(lo) - y(hi));
            const v = b.end - b.start;
            const color = b.kind === "total" ? (i === 0 ? "var(--text-faint)" : "var(--sky)") : v >= 0 ? "var(--accent)" : "var(--rose)";
            const value = b.kind === "total" ? fmtMoney(b.end) : `${v >= 0 ? "+" : "−"}${fmtMoney(Math.abs(v))}`;
            return (
              <g key={b.label}>
                <motion.rect x={x} width={bw} rx={5} fill={color}
                  initial={false}
                  animate={{ y: yTop, height: h }}
                  transition={{ type: "spring", stiffness: 170, damping: 24 }} />
                {i < bars.length - 1 && (
                  <motion.line x1={x + bw} x2={x + colW} stroke="var(--border-strong)" strokeDasharray="3 3"
                    initial={false} animate={{ y1: y(b.end), y2: y(b.end) }} transition={{ type: "spring", stiffness: 170, damping: 24 }} />
                )}
                <motion.text x={x + bw / 2} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--text)"
                  className="num" initial={false} animate={{ y: yTop - 8 }} transition={{ type: "spring", stiffness: 170, damping: 24 }}>
                  {value}
                </motion.text>
                <text x={x + bw / 2} y={H - 12} textAnchor="middle" fontSize="13" fill="var(--text-muted)">{b.label}</text>
              </g>
            );
          })}
        </svg>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {pvmBudget.map((p, i) => (
            <div key={p.name} className="rounded-lg px-3 py-2" style={{ background: "var(--panel-raised)" }}>
              <p className="text-[12px] text-faint">{p.name} mix</p>
              <motion.p className="num text-[15px] font-semibold" key={Math.round(r.aMix[i] * 1000)}
                initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: EASE }}>
                {(r.aMix[i] * 100).toFixed(1)}%
              </motion.p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
