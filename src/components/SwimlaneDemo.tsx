import { motion } from "framer-motion";
import { Check, Download, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { EASE } from "./ui";

const PRESETS = [
  {
    id: "break", label: "Trade break escalation",
    text: "When a reconciliation break is detected, Operations investigates the cause. If the break is over $10,000, Compliance reviews the exception. Accounting books the correcting entry. Operations confirms the break has cleared.",
  },
  {
    id: "ap", label: "Vendor payment approval",
    text: "When an invoice arrives, Accounts Payable matches it to the purchase order. If the amounts differ, the Controller approves the exception. Treasury releases the payment. Accounts Payable records the payment in the ledger.",
  },
  {
    id: "kyc", label: "Client onboarding (KYC)",
    text: "When a new client applies, Operations verifies their identity. Compliance screens the client against the OFAC list. If there is a potential match, Compliance escalates to the BSA officer. Operations opens the account.",
  },
];

const KNOWN = [
  "Accounts Payable", "Accounts Receivable", "Middle Office", "Back Office", "Front Office", "BSA officer",
  "Operations", "Compliance", "Accounting", "Treasury", "Controller", "Manager", "Client", "Customer", "Finance",
  "Risk", "Trading", "Audit", "Analyst", "Engineering", "Custodian", "Legal", "Payroll", "Sales", "Ops",
];

type FlowNode = { id: number; lane: string; label: string; kind: "start" | "task" | "decision" | "end"; conditional?: boolean };

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const imperative = (w: string) => {
  if (/ies$/i.test(w)) return w.replace(/ies$/i, "y");
  if (/(ches|shes|sses|xes|zes)$/i.test(w)) return w.slice(0, -2);
  if (/[^s]s$/i.test(w)) return w.slice(0, -1);
  return w;
};

function splitActor(clause: string, fallback: string) {
  const c = clause.replace(/^(the|a|an)\s+/i, "");
  const known = KNOWN.find((k) => c.toLowerCase().startsWith(k.toLowerCase() + " "));
  if (known) return { actor: known === "Ops" ? "Operations" : known, rest: c.slice(known.length).trim() };
  const m = /^([A-Z][\w&]*(?:\s+[A-Z][\w&]*)?)\s+(.*)$/.exec(c);
  if (m) return { actor: m[1], rest: m[2] };
  return { actor: fallback, rest: c };
}

function toLabel(rest: string) {
  const words = rest.replace(/[.;!?]+$/, "").split(/\s+/);
  if (!words.length) return "Step";
  words[0] = imperative(words[0]);
  return cap(words.join(" "));
}

export function parse(text: string) {
  const sentences = text.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim().replace(/[.!?]+$/, "")).filter(Boolean);
  const nodes: FlowNode[] = [];
  let lastLane = "Team";
  let id = 0;

  for (const s of sentences) {
    const when = /^when\s+(.+?),\s+(.+)$/i.exec(s);
    const iff = /^if\s+(.+?),\s+(.+)$/i.exec(s);
    if (when) {
      const { actor, rest } = splitActor(when[2], lastLane);
      nodes.push({ id: id++, lane: actor, label: cap(when[1]), kind: "start" });
      nodes.push({ id: id++, lane: actor, label: toLabel(rest), kind: "task" });
      lastLane = actor;
    } else if (iff) {
      const { actor, rest } = splitActor(iff[2], lastLane);
      nodes.push({ id: id++, lane: lastLane, label: `${cap(iff[1])}?`, kind: "decision" });
      nodes.push({ id: id++, lane: actor, label: toLabel(rest), kind: "task", conditional: true });
      lastLane = actor;
    } else {
      const { actor, rest } = splitActor(s, lastLane);
      nodes.push({ id: id++, lane: actor, label: toLabel(rest), kind: "task" });
      lastLane = actor;
    }
  }
  if (nodes.length && nodes[0].kind !== "start") nodes.unshift({ id: -1, lane: nodes[0].lane, label: "Start", kind: "start" });
  if (nodes.length) nodes.push({ id: id++, lane: lastLane, label: "Done", kind: "end" });

  const lanes = Array.from(new Set(nodes.map((n) => n.lane)));
  const decisions = nodes.filter((n) => n.kind === "decision");
  const checks = [
    { ok: nodes.filter((n) => n.kind === "start").length === 1 && nodes.filter((n) => n.kind === "end").length === 1, text: "One start, one end" },
    { ok: nodes.every((n) => n.lane && n.lane !== "Team"), text: "Every step has an owner" },
    { ok: decisions.every((d) => nodes[nodes.indexOf(d) + 2] !== undefined), text: "Every decision has two exits" },
    { ok: lanes.length >= 2, text: "At least one handoff between teams" },
  ];
  return { nodes, lanes, checks };
}

function wrap(label: string, max = 18) {
  const words = label.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) { lines.push(cur); cur = w; }
    else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  if (lines.length > 3) return [...lines.slice(0, 2), lines.slice(2).join(" ").slice(0, max - 1) + "…"];
  return lines;
}

const LANE_W = 128, COL_W = 152, LANE_H = 104, PAD = 18;

export default function SwimlaneDemo() {
  const [text, setText] = useState(PRESETS[0].text);
  const [preset, setPreset] = useState(PRESETS[0].id);
  const svgRef = useRef<SVGSVGElement>(null);
  const { nodes, lanes, checks } = useMemo(() => parse(text), [text]);
  const key = useMemo(() => nodes.map((n) => n.label).join("|"), [nodes]);

  const W = LANE_W + Math.max(1, nodes.length) * COL_W + PAD;
  const H = lanes.length * LANE_H + PAD * 2;
  const pos = (i: number) => {
    const n = nodes[i];
    return { x: LANE_W + i * COL_W + COL_W / 2, y: PAD + lanes.indexOf(n.lane) * LANE_H + LANE_H / 2 };
  };
  const half = (n: FlowNode) => (n.kind === "decision" ? { w: 66, h: 40 } : n.kind === "task" ? { w: 72, h: 32 } : { w: 58, h: 20 });

  const edges: { d: string; label?: string; dashed?: boolean }[] = [];
  nodes.forEach((n, i) => {
    if (i === nodes.length - 1) return;
    const a = pos(i), b = pos(i + 1);
    const ha = half(n), hb = half(nodes[i + 1]);
    const x1 = a.x + ha.w, x2 = b.x - hb.w;
    const mid = (x1 + x2) / 2;
    edges.push({
      d: a.y === b.y ? `M ${x1} ${a.y} L ${x2} ${b.y}` : `M ${x1} ${a.y} L ${mid} ${a.y} L ${mid} ${b.y} L ${x2} ${b.y}`,
      label: n.kind === "decision" ? "Yes" : undefined,
    });
    if (n.kind === "decision" && nodes[i + 2]) {
      const t = pos(i + 2), ht = half(nodes[i + 2]);
      const below = Math.max(a.y, t.y) + LANE_H * 0.44;
      edges.push({ d: `M ${a.x} ${a.y + ha.h} L ${a.x} ${below} L ${t.x} ${below} L ${t.x} ${t.y + ht.h}`, label: "No", dashed: true });
    }
  });

  const exportSvg = () => {
    const el = svgRef.current;
    if (!el) return;
    const cs = getComputedStyle(document.documentElement);
    let markup = new XMLSerializer().serializeToString(el);
    markup = markup.replace(/var\((--[\w-]+)\)/g, (_, v) => cs.getPropertyValue(v).trim() || "#888");
    const blob = new Blob([markup], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "swimlane.svg"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const laneColor = (i: number) => ["var(--accent)", "var(--sky)", "var(--brass)", "var(--rose)"][i % 4];

  return (
    <div className="card overflow-hidden" style={{ background: "var(--panel-solid)" }} data-ui>
      <div>
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.25fr_0.75fr]" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
          <p className="text-[13px] font-semibold">Describe a process in plain English</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button key={p.id} onClick={() => { setPreset(p.id); setText(p.text); }}
                className="rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors"
                aria-pressed={preset === p.id}
                style={{
                  background: preset === p.id ? "color-mix(in oklab, var(--accent) 14%, transparent)" : "var(--panel-raised)",
                  color: preset === p.id ? "var(--accent)" : "var(--text-muted)",
                }}>
                {p.label}
              </button>
            ))}
          </div>
          <textarea value={text} onChange={(e) => { setText(e.target.value); setPreset(""); }} rows={4}
            aria-label="Process description"
            className="mt-4 w-full resize-y rounded-xl px-4 py-3 text-[14px] leading-[1.65] outline-none transition-colors focus:border-[color:var(--accent)]"
            style={{ border: "1px solid var(--border)", background: "var(--bg)" }} />
          </div>
          <div className="lg:pt-8">
          <p className="text-[13.5px] leading-relaxed text-muted">
            Write steps as sentences. Start with “When…” for the trigger and “If…,” for a decision. Edit the text and the diagram redraws.
          </p>
          <p className="mt-5 text-[13px] font-semibold">Validation</p>
          <ul className="mt-2 space-y-1.5">
            {checks.map((c) => (
              <li key={c.text} className="flex items-center gap-2 text-[13.5px]" style={{ color: c.ok ? "var(--text)" : "var(--rose)" }}>
                <span className="grid h-4 w-4 place-items-center rounded-full" style={{ background: c.ok ? "var(--accent)" : "var(--rose)" }}>
                  {c.ok ? <Check size={10} strokeWidth={3} color="var(--on-accent)" /> : <X size={10} strokeWidth={3} color="#fff" />}
                </span>
                {c.text}
              </li>
            ))}
          </ul>
          </div>
        </div>

        <div className="flex min-w-0 flex-col p-5 sm:p-6" style={{ background: "var(--bg)" }}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[13px] font-semibold">Swimlane blueprint · {lanes.length} lanes, {nodes.length} steps</p>
            <button onClick={exportSvg} className="btn-ghost inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px]" data-cursor="Export">
              <Download size={12} /> Export SVG
            </button>
          </div>
          <div className="scrollbar-none -mx-1 overflow-x-auto px-1">
            <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} width={W} height={H}
              style={{ fontFamily: "Geist, system-ui, sans-serif", maxWidth: "100%", minWidth: Math.min(W, 760), height: "auto" }} role="img" aria-label="Generated swimlane diagram">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-faint)" />
                </marker>
              </defs>
              {lanes.map((l, i) => (
                <g key={l}>
                  <rect x={0} y={PAD + i * LANE_H} width={W} height={LANE_H - 4} rx={10}
                    fill={`color-mix(in oklab, ${laneColor(i)} ${i % 2 ? 5 : 8}%, var(--panel-solid))`} />
                  <text x={16} y={PAD + i * LANE_H + LANE_H / 2 + 4} fontSize="13" fontWeight="600" fill={laneColor(i)}>{l}</text>
                </g>
              ))}

              {edges.map((e, i) => (
                <g key={`${key}-e${i}`}>
                  <motion.path d={e.d} fill="none" stroke="var(--text-faint)" strokeWidth={1.5}
                    strokeDasharray={e.dashed ? "5 4" : undefined} markerEnd="url(#arrow)"
                    initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.25 + i * 0.09, duration: 0.5, ease: EASE }} />
                </g>
              ))}

              {nodes.map((n, i) => {
                const p = pos(i), h = half(n);
                const lines = wrap(n.label, n.kind === "decision" ? 14 : 18);
                const fill = n.kind === "decision" ? "color-mix(in oklab, var(--brass) 18%, var(--panel-solid))"
                  : n.kind === "task" ? "var(--panel-solid)" : "color-mix(in oklab, var(--accent) 20%, var(--panel-solid))";
                const stroke = n.kind === "decision" ? "var(--brass)" : n.kind === "task" ? "var(--border-strong)" : "var(--accent)";
                return (
                  <motion.g key={`${key}-n${i}`}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.09, duration: 0.45, ease: EASE }}
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}>
                    {n.kind === "decision" ? (
                      <path d={`M ${p.x} ${p.y - h.h} L ${p.x + h.w} ${p.y} L ${p.x} ${p.y + h.h} L ${p.x - h.w} ${p.y} Z`} fill={fill} stroke={stroke} strokeWidth={1.4} />
                    ) : (
                      <rect x={p.x - h.w} y={p.y - h.h} width={h.w * 2} height={h.h * 2} rx={n.kind === "task" ? 9 : h.h} fill={fill} stroke={stroke} strokeWidth={1.2}
                        strokeDasharray={n.conditional ? "4 3" : undefined} />
                    )}
                    {lines.map((ln, j) => (
                      <text key={j} x={p.x} y={p.y + (j - (lines.length - 1) / 2) * 14 + 4} textAnchor="middle" fontSize="11.5"
                        fontWeight={n.kind === "task" ? 500 : 600} fill="var(--text)">{ln}</text>
                    ))}
                  </motion.g>
                );
              })}

              {edges.map((e, i) => {
                if (!e.label) return null;
                const m = /M ([\d.]+) ([\d.]+)/.exec(e.d)!;
                const x = Number(m[1]), y = Number(m[2]);
                return (
                  <motion.text key={`${key}-l${i}`} x={e.label === "Yes" ? x + 8 : x + 8} y={e.label === "Yes" ? y - 7 : y + 18}
                    fontSize="11" fontWeight="600" fill={e.label === "Yes" ? "var(--accent)" : "var(--rose)"}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.09 }}>
                    {e.label}
                  </motion.text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
