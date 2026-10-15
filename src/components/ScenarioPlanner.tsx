import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { EASE, fmtMoney } from "./ui";

type Drivers = { customers: number; orders: number; aov: number; margin: number; opex: number };

const BASE: Drivers = { customers: 12000, orders: 3.2, aov: 85, margin: 0.42, opex: 1_050_000 };

const SCENARIOS: { id: string; name: string; note: string; d: Drivers }[] = [
  { id: "base", name: "Base", note: "The plan as approved.", d: BASE },
  { id: "up", name: "Upside", note: "Stronger acquisition and a little pricing power; costs follow volume.",
    d: { customers: BASE.customers * 1.08, orders: BASE.orders * 1.05, aov: BASE.aov * 1.03, margin: 0.43, opex: BASE.opex * 1.04 } },
  { id: "down", name: "Downside", note: "Softer demand and some discounting; costs held flat.",
    d: { customers: BASE.customers * 0.94, orders: BASE.orders * 0.96, aov: BASE.aov * 0.98, margin: 0.41, opex: BASE.opex } },
  { id: "stress", name: "Stress", note: "A demand shock with sticky costs. The case the plan has to survive.",
    d: { customers: BASE.customers * 0.85, orders: BASE.orders * 0.9, aov: BASE.aov * 0.94, margin: 0.38, opex: BASE.opex * 1.03 } },
];

const calc = (d: Drivers) => {
  const revenue = d.customers * d.orders * d.aov;
  const gp = revenue * d.margin;
  return { revenue, gp, op: gp - d.opex };
};

/** Driver-based scenario model: change the drivers, not the totals. Sample figures. */
export default function ScenarioPlanner() {
  const [id, setId] = useState("base");
  const s = SCENARIOS.find((x) => x.id === id)!;
  const r = useMemo(() => calc(s.d), [s]);
  const b = useMemo(() => calc(BASE), []);
  const max = calc(SCENARIOS[1].d).revenue * 1.05;

  const drivers = [
    { k: "Customers", v: Math.round(s.d.customers).toLocaleString("en-US"), ch: s.d.customers / BASE.customers - 1 },
    { k: "Orders per customer", v: s.d.orders.toFixed(2), ch: s.d.orders / BASE.orders - 1 },
    { k: "Average order value", v: `$${s.d.aov.toFixed(2)}`, ch: s.d.aov / BASE.aov - 1 },
    { k: "Gross margin", v: `${(s.d.margin * 100).toFixed(0)}%`, ch: s.d.margin - BASE.margin, pts: true },
    { k: "Operating costs", v: fmtMoney(s.d.opex), ch: s.d.opex / BASE.opex - 1, cost: true },
  ];

  const lines = [
    { k: "Revenue", v: r.revenue, base: b.revenue, c: "var(--sky)" },
    { k: "Gross profit", v: r.gp, base: b.gp, c: "var(--brass)" },
    { k: "Operating profit", v: r.op, base: b.op, c: r.op >= 0 ? "var(--accent)" : "var(--rose)" },
  ];

  return (
    <div className="card overflow-hidden" style={{ background: "var(--panel-solid)" }} data-ui>
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex rounded-full p-1" style={{ background: "var(--panel-raised)" }} role="tablist" aria-label="Scenario">
          {SCENARIOS.map((x) => (
            <button key={x.id} role="tab" aria-selected={id === x.id} onClick={() => setId(x.id)}
              className="relative isolate rounded-full px-3.5 py-1.5 text-[13px] font-medium"
              style={{ color: id === x.id ? "var(--on-accent)" : "var(--text-muted)" }}>
              {id === x.id && <motion.span layoutId="scen" className="absolute inset-0 -z-10 rounded-full"
                style={{ background: x.id === "stress" ? "var(--rose)" : "var(--accent)" }} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              {x.name}
            </button>
          ))}
        </div>
        <p className="text-[13.5px] text-muted">{s.note}</p>
      </div>

      <div className="grid gap-px md:grid-cols-[0.9fr_1.1fr]" style={{ background: "var(--border)" }}>
        <div className="p-5 sm:p-6" style={{ background: "var(--panel-solid)" }}>
          <p className="text-[13px] font-semibold">Drivers</p>
          <ul className="mt-3">
            {drivers.map((d) => {
              const good = d.cost ? d.ch <= 0 : d.ch >= 0;
              const zero = Math.abs(d.ch) < 1e-9;
              return (
                <li key={d.k} className="flex items-baseline justify-between gap-3 py-2" style={{ borderTop: "1px solid var(--border)" }}>
                  <span className="text-[14px] text-muted">{d.k}</span>
                  <span className="flex items-baseline gap-2.5">
                    <motion.span key={`${id}-${d.k}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}
                      className="num text-[14.5px] font-semibold">{d.v}</motion.span>
                    <span className="num w-14 text-right text-[12.5px]" style={{ color: zero ? "var(--text-faint)" : good ? "var(--accent)" : "var(--rose)" }}>
                      {zero ? "—" : `${d.ch > 0 ? "+" : "−"}${Math.abs(d.ch * 100).toFixed(d.pts ? 0 : 1)}${d.pts ? " pts" : "%"}`}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-5 sm:p-6" style={{ background: "var(--panel-solid)" }}>
          <p className="text-[13px] font-semibold">Outcome against base</p>
          <div className="mt-4 space-y-5">
            {lines.map((l) => {
              const frac = Math.max(0.015, Math.abs(l.v) / max);
              const diff = l.v - l.base;
              return (
                <div key={l.k}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[14px]">{l.k}</span>
                    <span className="flex items-baseline gap-2">
                      <span className="num text-[16px] font-semibold" style={{ color: l.v < 0 ? "var(--rose)" : undefined }}>{fmtMoney(l.v)}</span>
                      {id !== "base" && (
                        <span className="num text-[12.5px]" style={{ color: diff >= 0 ? "var(--accent)" : "var(--rose)" }}>
                          {diff >= 0 ? "+" : "−"}{fmtMoney(Math.abs(diff))}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="relative mt-2 h-3 overflow-hidden rounded-full" style={{ background: "color-mix(in oklab, var(--text) 7%, transparent)" }}>
                    <motion.div className="absolute inset-y-0 left-0 w-full origin-left rounded-full"
                      initial={false} animate={{ scaleX: frac }} transition={{ type: "spring", stiffness: 140, damping: 22 }}
                      style={{ background: l.c }} />
                    <span className="absolute inset-y-0 w-[2px]" style={{ left: `${(Math.abs(l.base) / max) * 100}%`, background: "var(--text)" }} title="Base" />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-[12.5px] leading-relaxed text-faint">
            Sample figures. The marker on each bar is the base case. Revenue = customers × orders × order value; nothing is typed in as a total.
          </p>
        </div>
      </div>
    </div>
  );
}
