import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Command, MousePointerClick } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import HeroLedger from "../components/HeroLedger";
import LifecycleScroll from "../components/LifecycleScroll";
import { BridgeVisual, ControlVisual, TieOutVisual } from "../components/MiniVisuals";
import PageShell from "../components/PageShell";
import { Avatar } from "../components/Portrait";
import { Chip, Counter, EASE, GlassCard, Marquee, Reveal, SplitText, Stagger, staggerChild } from "../components/ui";
import { accentVar, jobs, metrics, profile, projects, skills } from "../data/profile";
import { useApp } from "../lib/app-context";
import { ROUTES } from "../lib/routes";

/** Shown as clickable chips in the hero. Ids are resolved against `skills`. */
const FEATURED_SKILL_IDS = ["cash-position", "trade-settlement", "bsa-aml", "pvm", "driver-based", "sql"];

const PILLARS = [
  {
    title: "Tie it out",
    body: "Cash against position, custody against accounting. Every break classified by cause and worked through with operations and compliance until it clears, on JPMorgan Chase settlement systems today.",
    link: "/skills", cta: "The reconciliation stack", Visual: TieOutVisual, accent: "var(--accent)",
  },
  {
    title: "Make the control run itself",
    body: "Monitoring in Python and SQL that flags anomalous transactions for BSA/AML and OFAC review. FinSight takes it further: an agent that detects structuring at 94% precision and writes the audit report.",
    link: "/projects", cta: "Run the structuring lab", Visual: ControlVisual, accent: "var(--rose)",
  },
  {
    title: "Explain the variance",
    body: "Driver-based models, price-volume-mix bridges and scenarios through to a stress case, built in the IBM FP&A capstone with generative AI under human review.",
    link: "/impact", cta: "Drag the PVM bridge", Visual: BridgeVisual, accent: "var(--sky)",
  },
];

export default function Home() {
  const { openPalette, openSkill } = useApp();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const heroFade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const [activeMetric, setActiveMetric] = useState<string>(metrics[0].id);

  return (
    <PageShell>
      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[100svh] pt-[104px] pb-20">
        <motion.div style={{ y: heroY, opacity: heroFade }} className="shell-wide">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <div>
              <h1 className="display text-[clamp(3.2rem,8.4vw,6rem)]">
                <SplitText text="Rahul Reddy" delay={0.45} />{" "}
                <span style={{ color: "var(--accent)" }}><SplitText text="CH" delay={0.62} /></span>
              </h1>

              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.82, duration: 0.7, ease: EASE }}
                className="mt-6 flex items-center gap-4">
                <Avatar size={52} />
                <span className="min-w-0">
                  <span className="block text-[clamp(1.15rem,1.9vw,1.45rem)] font-semibold tracking-tight">{profile.role}</span>
                  <span className="mt-0.5 block text-[14px] text-muted">{profile.focus}</span>
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.8, ease: EASE }}
                className="mt-7 max-w-[54ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.65]">
                {profile.tagline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.08, duration: 0.8, ease: EASE }}
                className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/impact" data-cursor="Explore"
                  className="btn-primary shine group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-semibold">
                  See the impact
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link to="/experience" data-cursor="Read"
                  className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium">
                  The journey <ArrowUpRight size={14} />
                </Link>
                <button onClick={openPalette} data-cursor="⌘K"
                  className="hidden items-center gap-2 rounded-full px-4 py-3 text-[13px] text-muted transition-colors hover:text-[color:var(--text)] sm:inline-flex"
                  style={{ border: "1px dashed var(--border-strong)" }}>
                  <Command size={13} /> Search anything
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.8 }}
                className="mt-10">
                <p className="mb-3 flex items-center gap-1.5 text-[12.5px] text-faint">
                  <MousePointerClick size={13} /> Open a competency
                </p>
                <div className="flex flex-wrap gap-2">
                  {FEATURED_SKILL_IDS.map((id, i) => {
                    const skill = skills.find((s) => s.id === id);
                    if (!skill) return null;
                    return (
                      <motion.button key={id} onClick={() => openSkill(id)} data-cursor="Open"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.35 + i * 0.06, duration: 0.5 }}
                        whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
                        className="rounded-full px-3.5 py-1.5 text-[13px] transition-colors hover:border-[color:var(--accent)]"
                        style={{ border: "1px solid var(--border)", background: "var(--panel)" }}>
                        {skill.name}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <HeroLedger />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3, duration: 0.8 }}
          className="absolute inset-x-0 bottom-7 hidden flex-col items-center gap-2 md:flex" aria-hidden>
          <span className="text-[11.5px] text-faint">Scroll</span>
          <span className="relative h-9 w-[1px] overflow-hidden" style={{ background: "var(--border-strong)" }}>
            <motion.span className="absolute inset-x-0 h-3" style={{ background: "var(--accent)" }}
              animate={{ y: ["-100%", "320%"] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
          </span>
        </motion.div>
      </section>

      {/* ═════════════════════════════ METRICS ═════════════════════════════ */}
      <section className="shell-wide py-24">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 className="display max-w-[16ch] text-[clamp(2rem,4.2vw,3.2rem)]">
              Four numbers, each with a <span className="accent-word">source</span>
            </h2>
            <p className="max-w-[40ch] text-[16px] leading-relaxed text-muted">
              Select one. Every figure comes straight from a role or a project, with the work behind it.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => {
            const active = activeMetric === m.id;
            const c = accentVar[m.accent];
            return (
              <Reveal key={m.id} delay={i * 0.08}>
                <GlassCard
                  as="button" onClick={() => setActiveMetric(m.id)} ariaPressed={active}
                  className="flex h-full w-full flex-col justify-start p-6"
                  style={{
                    borderColor: active ? `color-mix(in oklab, ${c} 45%, transparent)` : undefined,
                    background: active ? `color-mix(in oklab, ${c} 8%, var(--panel-solid))` : undefined,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[12.5px] text-faint">{m.source}</span>
                    <motion.span animate={{ rotate: active ? 45 : 0 }} transition={{ duration: 0.35 }}>
                      <ArrowUpRight size={16} style={{ color: active ? c : "var(--text-faint)" }} />
                    </motion.span>
                  </div>
                  <p className="mt-8 text-[clamp(2.8rem,5vw,3.6rem)] leading-none font-semibold tracking-[-0.04em]" style={{ color: c }}>
                    <Counter to={m.value} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals} />
                  </p>
                  <p className="mt-3 text-[15px] font-semibold">{m.label}</p>
                  <motion.div
                    initial={false}
                    animate={{ height: active ? "auto" : 0, opacity: active ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="overflow-hidden">
                    <p className="pt-3 text-[15px] leading-relaxed text-muted">{m.detail}</p>
                  </motion.div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      <div className="rule" />
      <Marquee items={[
        "SQL", "Python · Pandas · NumPy", "Excel · XLOOKUP · Power Query", "Tableau", "Power BI",
        "IBM Planning Analytics", "Bloomberg Terminal", "AWS", "LangGraph", "AWS Bedrock", "FastAPI",
        "REST APIs", "Jira", "Confluence", "Docker", "Git",
      ]} />
      <div className="rule" />

      {/* ═════════════════════════════ PILLARS ═════════════════════════════ */}
      <section className="shell-wide py-28">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <h2 className="display text-[clamp(2.2rem,4.8vw,3.6rem)]">
              Reconcile, automate, <span className="accent-word">explain</span>
            </h2>
            <p className="max-w-[54ch] text-[16px] leading-relaxed text-muted">
              Most reporting problems are not chart problems. They are breaks nobody classified, controls that
              live in someone's head, and variances reported without a reason attached.
            </p>
          </div>
        </Reveal>

        <Stagger className="mt-14 grid gap-4 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <motion.div key={p.title} variants={staggerChild}>
              <GlassCard className="group flex h-full flex-col p-7">
                <div className="rounded-xl px-3 py-4" style={{ background: "var(--bg)" }}>
                  <p.Visual />
                </div>
                <h3 className="mt-7 text-[22px] font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 flex-1 text-[16px] leading-[1.65] text-muted">{p.body}</p>
                <Link to={p.link} data-cursor="Go"
                  className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold"
                  style={{ color: p.accent }}>
                  {p.cta}
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </Stagger>
      </section>

      {/* ═════════════════════ LIFECYCLE (signature scroll) ═════════════════ */}
      <LifecycleScroll />

      {/* ═══════════════════════ ROUTE / CHAPTER INDEX ══════════════════════ */}
      <section className="shell-wide py-24">
        <Reveal>
          <h2 className="display mb-10 text-[clamp(2rem,4vw,3rem)]">Take the tour</h2>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-2xl" style={{ background: "var(--border)", border: "1px solid var(--border)" }}>
          {ROUTES.filter((r) => r.path !== "/").map((r, i) => (
            <Reveal key={r.path} delay={i * 0.05} y={12}>
              <Link to={r.path} data-cursor="Open"
                className="group flex items-center gap-5 px-5 py-6 transition-colors duration-300 sm:px-8"
                style={{ background: "var(--panel-solid)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in oklab, var(--accent) 6%, var(--panel-solid))")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--panel-solid)")}>
                <span className="min-w-0 flex-1">
                  <span className="block text-[clamp(1.25rem,2.4vw,1.7rem)] font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1.5">
                    {r.label}
                  </span>
                  <span className="mt-1 block text-[15px] text-muted">{r.blurb}</span>
                </span>
                <span className="hidden gap-2 sm:flex">
                  {r.path === "/skills" && <Chip tone="accent">{skills.length} competencies</Chip>}
                  {r.path === "/experience" && <Chip tone="sky">{jobs.length} roles</Chip>}
                  {r.path === "/projects" && <Chip tone="brass">{projects.length} runnable builds</Chip>}
                  {r.path === "/impact" && <Chip tone="accent">Live report</Chip>}
                </span>
                <ArrowUpRight size={20} className="shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  style={{ color: "var(--text-faint)" }} />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════ CLOSING LINE ═══════════════════════════ */}
      <section className="shell py-16">
        <Reveal>
          <figure className="mx-auto max-w-3xl text-center">
            <blockquote className="text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.3] font-medium tracking-tight">
              “A number isn't finished when it ties out once. It's finished when the control that proves it
              runs every day <span className="accent-word">without me</span>.”
            </blockquote>
            <figcaption className="mt-6 text-[14px] text-faint">{profile.name}</figcaption>
          </figure>
        </Reveal>
      </section>
    </PageShell>
  );
}
