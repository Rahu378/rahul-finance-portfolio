import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight, BarChart3, BookOpen, Cpu, Database, Grid2X2, LayoutList, Scale, Search,
  ShieldCheck, Sparkles, TrendingUp, Umbrella, Workflow, X,
} from "lucide-react";
import { useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import { Meter, Reveal, SectionHeading, Segmented } from "../components/ui";
import { skillCategories, skills, type Basis, type SkillCategoryId } from "../data/profile";
import { useApp } from "../lib/app-context";

const ICONS: Record<string, any> = {
  Scale, ArrowLeftRight, BookOpen, ShieldCheck, TrendingUp, Umbrella, Workflow, Database, Cpu,
};

const BASIS_TONE: Record<Basis, string> = {
  Production: "var(--accent)", Project: "var(--sky)", Certified: "var(--brass)", "Working knowledge": "var(--text-faint)",
};

type View = "cards" | "chart";

export default function Skills() {
  const { openSkill } = useApp();
  const [cat, setCat] = useState<SkillCategoryId | "all">("all");
  const [q, setQ] = useState("");
  const [view, setView] = useState<View>("cards");

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return skills.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
      if (!n) return true;
      const initials = s.name.split(/[\s/&·.()-]+/).filter(Boolean).map((w) => w[0]).join("").toLowerCase();
      return (
        s.name.toLowerCase().includes(n) ||
        s.id.toLowerCase().includes(n) ||
        initials.startsWith(n) ||
        s.blurb.toLowerCase().includes(n) ||
        s.proof.toLowerCase().includes(n) ||
        s.basis.toLowerCase().includes(n) ||
        s.tags.some((t) => t.toLowerCase().includes(n))
      );
    });
  }, [cat, q]);

  const sortedForChart = useMemo(() => [...filtered].sort((a, b) => b.level - a.level), [filtered]);
  const accentFor = (id: SkillCategoryId) => skillCategories.find((c) => c.id === id)?.accent ?? "var(--accent)";
  const activeCat = skillCategories.find((c) => c.id === cat);

  return (
    <PageShell className="pt-[128px]">
      <section className="shell-wide">
        <SectionHeading
          title="Every competency, "
          accentWord="explained"
          lead={`${skills.length} competencies across ${skillCategories.length} disciplines, from break resolution to LLM agents. Nothing here is a logo on a wall. Open any one and it tells you what it is, why it matters, and exactly where it showed up: in production, in a project, through a certification, or as working knowledge.`}
        />

        {/* ───────────── Controls ───────────── */}
        <Reveal delay={0.2}>
          <div className="mt-14 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[380px]">
              <Search size={15} className="absolute top-1/2 left-4 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search: try “OFAC”, “recon”, “PVM”…"
                aria-label="Search skills"
                className="w-full rounded-full py-3 pr-10 pl-11 text-[14px] outline-none transition-colors placeholder:text-[color:var(--text-faint)] focus:border-[color:var(--accent)]"
                style={{ border: "1px solid var(--border)", background: "var(--panel)" }}
              />
              {q && (
                <button onClick={() => setQ("")} aria-label="Clear search"
                  className="absolute top-1/2 right-3.5 -translate-y-1/2" style={{ color: "var(--text-faint)" }}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="num text-[13px] text-faint" aria-live="polite">{filtered.length} of {skills.length}</span>
              <Segmented id="skills-view" value={view} onChange={setView}
                options={[["cards", Grid2X2, "Cards"], ["chart", LayoutList, "Chart"]] as const} />
            </div>
          </div>
        </Reveal>

        {/* ───────────── Category rail ───────────── */}
        <Reveal delay={0.26}>
          <div className="scrollbar-none mt-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
            <CatBtn active={cat === "all"} onClick={() => setCat("all")} label="All" count={skills.length} accent="var(--accent)" />
            {skillCategories.map((c) => {
              const Icon = ICONS[c.icon] ?? Sparkles;
              return (
                <CatBtn key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} label={c.short}
                  count={skills.filter((s) => s.category === c.id).length} accent={c.accent} icon={<Icon size={13} />} />
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          {activeCat && (
            <motion.p key={activeCat.id}
              initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-4 max-w-2xl text-[15px] text-muted">
              <span className="font-semibold" style={{ color: activeCat.accent }}>{activeCat.name}</span>{": "}{activeCat.desc}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ───────────── Views ───────────── */}
        <div className="mt-9 pb-16">
          <AnimatePresence mode="wait">
            {view === "cards" ? (
              <motion.div key="cards"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((s, i) => {
                    const accent = accentFor(s.category);
                    return (
                      <motion.button
                        key={s.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.34, delay: Math.min(i * 0.016, 0.3), ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openSkill(s.id)}
                        data-cursor="Explain"
                        className="card card-sheen group relative flex flex-col overflow-hidden p-5 text-left"
                      >
                        <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                          style={{ background: accent }} />
                        <div className="flex items-start justify-between gap-3">
                          <h2 className="text-[15.5px] leading-snug font-semibold tracking-tight">{s.name}</h2>
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                        </div>
                        <p className="mt-2.5 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-muted">{s.blurb}</p>
                        <div className="mt-4 flex items-center gap-2.5">
                          <Meter value={s.level} color={accent} height={3} delay={0.1} />
                          <span className="num shrink-0 text-[12px] text-faint">{s.level}</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[12px] font-medium" style={{ color: BASIS_TONE[s.basis] }}>{s.basis}</span>
                          <span className="text-[12px] font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ color: accent }}>
                            Open →
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div key="chart"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="card overflow-hidden" style={{ background: "var(--panel-solid)" }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <p className="text-[14.5px] font-semibold">Depth by competency</p>
                    <p className="mt-0.5 text-[12.5px] text-faint">Self-assessed, sorted descending. Click any bar to drill through.</p>
                  </div>
                  <BarChart3 size={16} style={{ color: "var(--accent)" }} />
                </div>

                <div>
                  {sortedForChart.map((s, i) => {
                    const accent = accentFor(s.category);
                    return (
                      <motion.button
                        key={s.id}
                        onClick={() => openSkill(s.id)}
                        data-cursor="Drill through"
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(i * 0.015, 0.5), duration: 0.45 }}
                        className="group grid w-full grid-cols-[minmax(0,200px)_1fr_auto] items-center gap-4 px-5 py-2.5 text-left transition-colors hover:bg-[color:color-mix(in_oklab,var(--accent)_6%,transparent)]"
                        style={{ borderTop: i ? "1px solid var(--border)" : undefined }}
                      >
                        <span className="truncate text-[13.5px] font-medium">{s.name}</span>
                        <span className="relative h-[16px] overflow-hidden rounded-[4px]" style={{ background: "color-mix(in oklab, var(--text) 5%, transparent)" }}>
                          <motion.span
                            className="absolute inset-y-0 left-0 w-full origin-left rounded-[4px]"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: s.level / 100 }}
                            transition={{ delay: 0.1 + Math.min(i * 0.015, 0.5), duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            style={{ background: accent }}
                          />
                        </span>
                        <span className="num w-10 text-right text-[12.5px] text-muted">{s.level}</span>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3.5" style={{ borderTop: "1px solid var(--border)" }}>
                  {skillCategories.map((c) => (
                    <span key={c.id} className="flex items-center gap-1.5 text-[12px] text-faint">
                      <span className="h-2 w-2 rounded-[3px]" style={{ background: c.accent }} /> {c.short}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="card mt-2 px-6 py-16 text-center">
              <p className="text-[16px] font-semibold">No competency matched “{q}”.</p>
              <p className="mt-2 text-[14px] text-muted">
                Try <button onClick={() => setQ("OFAC")} className="underline" style={{ color: "var(--accent)" }}>OFAC</button>,{" "}
                <button onClick={() => setQ("reconciliation")} className="underline" style={{ color: "var(--accent)" }}>reconciliation</button> or{" "}
                <button onClick={() => { setQ(""); setCat("all"); }} className="underline" style={{ color: "var(--accent)" }}>reset everything</button>.
              </p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function CatBtn({
  active, onClick, label, count, accent, icon,
}: { active: boolean; onClick: () => void; label: string; count: number; accent: string; icon?: React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      aria-pressed={active}
      data-cursor="Filter"
      className="relative flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium whitespace-nowrap transition-colors"
      style={{
        border: `1px solid ${active ? `color-mix(in oklab, ${accent} 50%, transparent)` : "var(--border)"}`,
        background: active ? `color-mix(in oklab, ${accent} 12%, transparent)` : "var(--panel)",
        color: active ? accent : "var(--text-muted)",
      }}
    >
      {icon}
      {label}
      <span className="num text-[11.5px] opacity-70">{count}</span>
    </motion.button>
  );
}
