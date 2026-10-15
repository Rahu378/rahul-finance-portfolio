import { motion } from "framer-motion";
import { Activity, Filter, Info, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  Area, AreaChart, Cell, Legend, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import PageShell from "../components/PageShell";
import PvmBridge from "../components/PvmBridge";
import { Chip, Counter, EASE, Reveal, SectionHeading } from "../components/ui";
import { accentVar, areaSplit, capabilityRadar, metrics, reconEffort } from "../data/profile";

/* ----------------------------------------------------------- Custom tooltip */
function TT({ active, payload, label, unit = "" }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3.5 py-2.5"
      style={{ background: "var(--panel-solid)", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-lg)" }}>
      {label && <p className="mb-1.5 text-[12px] text-faint">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="flex items-center gap-2 text-[13px]">
          <span className="h-2 w-2 rounded-sm" style={{ background: p.color || p.payload?.color || p.fill }} />
          <span className="text-muted">{p.name}</span>
          <span className="num font-semibold">{typeof p.value === "number" ? p.value.toFixed(0) : p.value}{unit}</span>
        </p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- Report tile */
function Tile({
  title, subtitle, children, info, sample, dim = false,
}: { title: string; subtitle?: string; children: React.ReactNode; info?: string; sample?: boolean; dim?: boolean }) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <motion.div animate={{ opacity: dim ? 0.32 : 1 }} transition={{ duration: 0.35 }}
      className="flex min-w-0 flex-col" style={{ background: "var(--panel-solid)" }}>
      <div className="flex items-start justify-between gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="min-w-0">
          <p className="text-[14.5px] font-semibold tracking-tight">{title}</p>
          {subtitle && <p className="mt-0.5 text-[12.5px] text-faint">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {sample && <Chip tone="brass">Sample data</Chip>}
          {info && (
            <button onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)} onFocus={() => setShowInfo(true)} onBlur={() => setShowInfo(false)}
              onClick={() => setShowInfo((s) => !s)} aria-label="About this visual"
              className="relative" style={{ color: "var(--text-faint)" }}>
              <Info size={15} />
              {showInfo && (
                <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute top-6 right-0 z-20 w-64 rounded-lg p-3 text-left text-[12.5px] leading-relaxed"
                  style={{ background: "var(--panel-solid)", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-lg)", color: "var(--text-muted)" }}>
                  {info}
                </motion.span>
              )}
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 p-4 sm:p-5">{children}</div>
    </motion.div>
  );
}

export default function Impact() {
  const [area, setArea] = useState<string | null>(null);
  const [refreshedAt, setRefreshedAt] = useState(() => new Date());
  const [refreshing, setRefreshing] = useState(false);
  const activeMetric = areaSplit.find((a) => a.name === area)?.metric ?? null;

  const doRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); setRefreshedAt(new Date()); }, 1150);
  };

  return (
    <PageShell className="pt-[128px]">
      <section className="shell-wide">
        <SectionHeading
          title="The outcomes, as a "
          accentWord="live report"
          lead="An analyst's portfolio should behave like the reports an analyst ships. Use the slicer to cross-highlight the page, hover the visuals, and drag the inputs on the price-volume-mix bridge until the variance tells a different story."
        />

        {/* ───────────── Report canvas ───────────── */}
        <Reveal delay={0.18}>
          <div data-ui className="mt-14 overflow-hidden rounded-[22px]"
            style={{ border: "1px solid var(--border-strong)", background: "var(--panel-solid)", boxShadow: "var(--shadow-lg)" }}>

            {/* ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--border)", background: "var(--panel-raised)" }}>
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "var(--accent)" }}>
                  <Activity size={15} color="var(--on-accent)" />
                </span>
                <div>
                  <p className="text-[14.5px] font-semibold tracking-tight">Career impact · analyst scorecard</p>
                  <p className="num text-[12px] text-faint">
                    Last refresh {refreshedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Chip tone="accent"><ShieldCheck size={11} /> Tied to résumé</Chip>
                <button onClick={doRefresh} data-cursor="Refresh"
                  className="btn-ghost flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px]">
                  <motion.span animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 1, ease: "linear" }} className="grid place-items-center">
                    <RefreshCw size={12} />
                  </motion.span>
                  {refreshing ? "Refreshing" : "Refresh"}
                </button>
              </div>
            </div>

            {/* slicer */}
            <div className="flex flex-wrap items-center gap-2 px-5 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="mr-1 flex items-center gap-1.5 text-[12.5px] text-faint"><Filter size={12} /> Area</span>
              <SlicerBtn on={!area} color="var(--accent)" onClick={() => setArea(null)}>All</SlicerBtn>
              {areaSplit.map((d) => (
                <SlicerBtn key={d.name} on={area === d.name} color={d.color} onClick={() => setArea(area === d.name ? null : d.name)}>
                  <span className="h-2 w-2 rounded-sm" style={{ background: d.color }} /> {d.name}
                </SlicerBtn>
              ))}
              {area && (
                <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  className="ml-auto text-[12.5px] font-medium" style={{ color: "var(--accent)" }}>
                  1 filter applied · visuals cross-highlighted
                </motion.span>
              )}
            </div>

            {/* KPI row */}
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: "var(--border)" }}>
              {metrics.map((k, i) => {
                const c = accentVar[k.accent];
                const dim = !!activeMetric && activeMetric !== k.id;
                return (
                  <motion.div key={k.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: dim ? 0.32 : 1, y: 0 }}
                    transition={{ delay: dim ? 0 : 0.1 + i * 0.08, duration: 0.5, ease: EASE }}
                    className="group px-5 py-6" style={{ background: "var(--panel-solid)" }}>
                    <p className="text-[12.5px] text-faint">{k.source}</p>
                    <p className="mt-3 text-[clamp(2.2rem,3.6vw,2.9rem)] leading-none font-semibold tracking-[-0.04em]" style={{ color: c }}>
                      <Counter to={k.value} prefix={k.prefix} suffix={k.suffix} decimals={k.decimals} />
                    </p>
                    <p className="mt-2.5 text-[15px] font-medium">{k.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* visuals */}
            <div className="grid gap-px lg:grid-cols-[1.5fr_1fr]" style={{ background: "var(--border)" }}>
              <Tile title="Manual reconciliation effort, before vs. after pipelines"
                subtitle="Indexed, first month = 100 · lower is better"
                sample dim={!!area && activeMetric !== "recon"}
                info="The 35% reduction is the measured outcome at Appworks. The month-by-month shape is illustrative, drawn to show how effort falls as each feed moves onto a validated pipeline.">
                <ResponsiveContainer width="100%" height={270}>
                  <AreaChart data={reconEffort} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gBefore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--rose)" stopOpacity={0.22} />
                        <stop offset="100%" stopColor="var(--rose)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gAfter" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.32} />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} width={44} domain={[50, 110]} />
                    <Tooltip content={<TT />} cursor={{ stroke: "var(--border-strong)", strokeDasharray: "4 4" }} />
                    <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Area type="monotone" dataKey="before" name="Manual process" stroke="var(--rose)" strokeWidth={1.6}
                      strokeDasharray="4 3" fill="url(#gBefore)" animationDuration={1400} />
                    <Area type="monotone" dataKey="after" name="With pipelines" stroke="var(--accent)" strokeWidth={2.4}
                      fill="url(#gAfter)" animationDuration={1600} />
                  </AreaChart>
                </ResponsiveContainer>
              </Tile>

              <Tile title="Where the work sits"
                subtitle="Approximate share by area · click to cross-highlight"
                info="A rough weighting of the work across the four roles and three projects. Click a segment to cross-highlight the page, the same interaction as a slicer in a real report.">
                <ResponsiveContainer width="100%" height={270}>
                  <PieChart>
                    <Tooltip content={<TT unit="%" />} />
                    <Pie data={areaSplit} dataKey="value" nameKey="name" cx="50%" cy="45%"
                      innerRadius={58} outerRadius={92} paddingAngle={3} stroke="none" animationDuration={1200}
                      onClick={(d: any) => setArea((cur) => (cur === d.name ? null : d.name))}>
                      {areaSplit.map((d) => (
                        <Cell key={d.name} fill={d.color} cursor="pointer" opacity={!area || area === d.name ? 1 : 0.22} />
                      ))}
                    </Pie>
                    <Legend iconType="circle" iconSize={7} verticalAlign="bottom" wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Tile>
            </div>

            <div className="grid gap-px" style={{ background: "var(--border)", borderTop: "1px solid var(--border)" }}>
              <Tile title="Price-volume-mix bridge, budget to actual revenue"
                subtitle="Drag the inputs · the bridge recomputes and still ties to the dollar"
                sample dim={!!area && activeMetric !== "turnaround"}
                info="Three product lines with a sample budget. Volume is valued at budget mix and budget price, mix at actual volume and budget price, price at actual quantities. The three variances always sum exactly to the gap between budget and actual.">
                <PvmBridge />
              </Tile>
            </div>

            <div className="grid gap-px lg:grid-cols-[1fr_1fr]" style={{ background: "var(--border)", borderTop: "1px solid var(--border)" }}>
              <Tile title="Capability profile" subtitle="Self-assessed depth, 0 to 100"
                info="Averaged across the nine disciplines on the Skills page. The shape matters more than any one axis: operations, controls and planning, with the engineering to automate them.">
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={capabilityRadar} outerRadius="70%">
                    <PolarGrid stroke="var(--grid-line)" />
                    <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12, fill: "var(--text-faint)" }} />
                    <Tooltip content={<TT />} />
                    <Radar name="Depth" dataKey="v" stroke="var(--sky)" strokeWidth={2} fill="var(--sky)" fillOpacity={0.2} animationDuration={1500} />
                  </RadarChart>
                </ResponsiveContainer>
              </Tile>

              <Tile title="Where it touches the trade lifecycle" subtitle="Stage, the work, and the tools behind it">
                <ul className="pt-1">
                  {[
                    { s: "Capture & allocation", what: "Transaction capture and allocation support", tools: ["SQL", "REST APIs"], c: "var(--sky)" },
                    { s: "Settlement", what: "Payment processing and trade settlement systems", tools: ["Python", "SQL"], c: "var(--sky)" },
                    { s: "Reconciliation", what: "Cash vs. position, custody vs. accounting", tools: ["SQL", "Pandas", "Excel"], c: "var(--accent)" },
                    { s: "Monitoring", what: "BSA/AML/OFAC anomaly flags and the FinSight agent", tools: ["Python", "LangGraph"], c: "var(--rose)" },
                    { s: "Reporting", what: "KPIs, variance, scenarios, audit documentation", tools: ["Tableau", "Power BI", "IBM PA"], c: "var(--brass)" },
                  ].map((r, i) => (
                    <motion.li key={r.s}
                      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.5, ease: EASE }}
                      className="flex items-start gap-3 py-3" style={{ borderTop: i ? "1px solid var(--border)" : undefined }}>
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: r.c }} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-semibold">{r.s}</span>
                        <span className="block text-[13px] text-muted">{r.what}</span>
                      </span>
                      <span className="hidden shrink-0 flex-wrap justify-end gap-1 sm:flex">
                        {r.tools.map((t) => (
                          <span key={t} className="rounded-md px-2 py-0.5 text-[11.5px]" style={{ background: "var(--panel-raised)", color: "var(--text-muted)" }}>{t}</span>
                        ))}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </Tile>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-[12.5px] text-faint" style={{ borderTop: "1px solid var(--border)", background: "var(--panel-raised)" }}>
              <span>KPIs from the résumé · charts marked “sample data” are illustrative</span>
              <span>{area ? `Filtered: ${area}` : "No filters applied"}</span>
            </div>
          </div>
        </Reveal>

        {/* ───────────── Narrative behind the numbers ───────────── */}
        <div className="mt-28 pb-12">
          <Reveal>
            <h2 className="display text-[clamp(2rem,4.2vw,3rem)]">
              No number without a <span className="accent-word">method</span>
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {metrics.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.08}>
                <div className="card h-full p-7" style={{ background: "var(--panel-solid)" }}>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="text-[clamp(2.4rem,4.4vw,3.2rem)] leading-none font-semibold tracking-[-0.04em]" style={{ color: accentVar[m.accent] }}>
                      <Counter to={m.value} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals} />
                    </span>
                    <span className="text-[16px] font-semibold">{m.label}</span>
                  </div>
                  <p className="mt-2 text-[13px] text-faint">{m.source}</p>
                  <p className="mt-5 text-[16px] leading-[1.7] text-muted">{m.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function SlicerBtn({ on, color, onClick, children }: { on: boolean; color: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.95 }} aria-pressed={on} data-cursor="Cross-filter"
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] transition-colors"
      style={{
        border: `1px solid ${on ? color : "var(--border)"}`,
        background: on ? `color-mix(in oklab, ${color} 14%, transparent)` : "transparent",
        color: on ? color : "var(--text-muted)",
      }}>
      {children}
    </motion.button>
  );
}
