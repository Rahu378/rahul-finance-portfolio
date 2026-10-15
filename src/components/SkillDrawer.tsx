import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BadgeCheck, ExternalLink, Gauge, Layers, X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { skillCategories, skills, type Basis, type Skill } from "../data/profile";
import { useLockScroll } from "../lib/hooks";
import CodeBlock from "./CodeBlock";
import { Chip, Meter } from "./ui";

export const BASIS_NOTE: Record<Basis, string> = {
  Production: "Used in a professional role.",
  Project: "Built with it in a project or capstone.",
  Certified: "Backed by a certification.",
  "Working knowledge": "Understood and applied alongside the core work.",
};

export default function SkillDrawer({
  skillId, onClose, onSelect,
}: { skillId: string | null; onClose: () => void; onSelect: (id: string) => void }) {
  const skill: Skill | undefined = skills.find((s) => s.id === skillId);
  const nav = useNavigate();
  useLockScroll(!!skill);

  useEffect(() => {
    if (!skill) return;
    const on = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [skill, onClose]);

  const cat = skill ? skillCategories.find((c) => c.id === skill.category) : undefined;
  const related = skill ? skills.filter((s) => s.category === skill.category && s.id !== skill.id).slice(0, 6) : [];
  const step = (d: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.5 } });

  return (
    <AnimatePresence>
      {skill && (
        <motion.div className="fixed inset-0 z-[95]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0" onClick={onClose} style={{ background: "rgba(2,6,10,.62)", backdropFilter: "blur(6px)" }} />

          <motion.aside
            role="dialog" aria-modal="true" aria-label={`${skill.name} details`}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[580px] flex-col overflow-y-auto"
            style={{ background: "var(--panel-solid)", borderLeft: "1px solid var(--border-strong)", boxShadow: "var(--shadow-lg)" }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
              style={{ background: "var(--panel-solid)", borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full" style={{ background: cat?.accent }} />
                <span className="text-[13px] font-medium text-muted">{cat?.name}</span>
              </div>
              <button onClick={onClose} aria-label="Close" autoFocus
                className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-[color:var(--panel-raised)]"
                style={{ border: "1px solid var(--border)" }}>
                <X size={15} />
              </button>
            </div>

            <div className="px-6 pt-6 pb-12">
              <AnimatePresence mode="wait">
                <motion.div key={skill.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <motion.h2 {...step(0.06)} className="display text-[clamp(1.8rem,4.4vw,2.4rem)]">{skill.name}</motion.h2>

                  <motion.div {...step(0.12)} className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl px-4 py-3" style={{ background: "var(--panel-raised)" }}>
                      <div className="flex items-center gap-1.5 text-[12px] text-faint"><Gauge size={12} /> Depth, self-assessed</div>
                      <div className="mt-1.5 flex items-baseline gap-1">
                        <span className="num text-[28px] font-semibold tracking-tight" style={{ color: cat?.accent }}>{skill.level}</span>
                        <span className="text-[12px] text-faint">/ 100</span>
                      </div>
                      <div className="mt-2"><Meter value={skill.level} color={cat?.accent} delay={0.2} /></div>
                    </div>
                    <div className="rounded-xl px-4 py-3" style={{ background: "var(--panel-raised)" }}>
                      <div className="flex items-center gap-1.5 text-[12px] text-faint"><Layers size={12} /> Basis</div>
                      <p className="mt-1.5 text-[18px] font-semibold tracking-tight">{skill.basis}</p>
                      <p className="mt-1.5 text-[12px] leading-snug text-faint">{BASIS_NOTE[skill.basis]}</p>
                    </div>
                  </motion.div>

                  <motion.p {...step(0.18)} className="mt-6 text-[15.5px] leading-[1.7]">{skill.blurb}</motion.p>

                  <motion.div {...step(0.24)} className="mt-5 rounded-xl p-4"
                    style={{ background: `color-mix(in oklab, ${cat?.accent} 9%, var(--panel-solid))` }}>
                    <div className="flex items-center gap-1.5 text-[12.5px] font-semibold" style={{ color: cat?.accent }}>
                      <BadgeCheck size={14} /> Where it shows up
                    </div>
                    <p className="mt-2 text-[14px] leading-relaxed">{skill.proof}</p>
                  </motion.div>

                  {skill.demo && (
                    <motion.button {...step(0.28)}
                      onClick={() => { onClose(); setTimeout(() => nav(skill.demo!.to), 180); }}
                      data-cursor="Try it"
                      className="btn-primary mt-4 flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-[14px] font-semibold">
                      {skill.demo.label}
                      <ArrowRight size={16} />
                    </motion.button>
                  )}

                  {skill.snippet && (
                    <motion.div {...step(0.32)} className="mt-7">
                      <p className="mb-2.5 text-[13px] font-semibold">How it looks in practice</p>
                      <CodeBlock code={skill.snippet.code} lang={skill.snippet.lang} />
                    </motion.div>
                  )}

                  <motion.div {...step(0.36)} className="mt-6 flex flex-wrap gap-2">
                    {skill.tags.map((t) => <Chip key={t}>{t}</Chip>)}
                  </motion.div>

                  {skill.link && (
                    <motion.a {...step(0.4)}
                      href={skill.link} target="_blank" rel="noopener noreferrer" data-cursor="Open"
                      className="mt-6 flex items-center justify-between rounded-xl px-4 py-3.5 transition-colors hover:bg-[color:var(--panel-raised)]"
                      style={{ border: "1px solid var(--border)" }}>
                      <span className="flex items-center gap-2.5 text-[14px]">
                        <ExternalLink size={14} style={{ color: cat?.accent }} />
                        Official reference
                      </span>
                      <ArrowUpRight size={15} style={{ color: "var(--text-faint)" }} />
                    </motion.a>
                  )}

                  {related.length > 0 && (
                    <motion.div {...step(0.44)} className="mt-9">
                      <p className="mb-3 text-[13px] font-semibold">Sits next to</p>
                      <div className="flex flex-wrap gap-2">
                        {related.map((r) => (
                          <button key={r.id} onClick={() => onSelect(r.id)} data-cursor="Open"
                            className="btn-ghost rounded-full px-3 py-1.5 text-[13px]">
                            {r.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
