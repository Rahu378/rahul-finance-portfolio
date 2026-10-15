import { motion, useScroll, useTransform } from "framer-motion";
import {
  Award, ClipboardCheck, FileCheck, FileCode, GraduationCap, Scale, SearchCheck, TrendingUp,
} from "lucide-react";
import { useRef, useState } from "react";
import PageShell from "../components/PageShell";
import { FeaturePortrait } from "../components/Portrait";
import Quiz from "../components/Quiz";
import { Chip, Counter, EASE, GlassCard, Reveal, SectionHeading } from "../components/ui";
import { certifications, education, leadership, principles, profile } from "../data/profile";

const ICONS: Record<string, any> = { Scale, SearchCheck, FileCode, TrendingUp, ClipboardCheck, FileCheck };

const PROCESS = [
  { step: "Discover", body: "Sit with operations or finance and find the decision or control they need, not the report they asked for." },
  { step: "Map", body: "Swimlane the current process and the data behind it. The gaps and failed handoffs show up on the page before anyone builds." },
  { step: "Specify", body: "Requirements, data mapping and acceptance criteria written down, so done means the same thing to everyone." },
  { step: "Automate", body: "SQL and Python for the matching, monitoring and reporting. Controls written as code, versioned and scheduled." },
  { step: "Validate", body: "UAT with the people who own the numbers. Exceptions reproduced, fixed and retested before sign-off." },
  { step: "Hand over", body: "Audit-ready documentation and a runbook. A control only I can operate is not a finished control." },
];

export default function About() {
  const [openPrinciple, setOpenPrinciple] = useState<string | null>(principles[0].id);

  return (
    <PageShell className="pt-[128px]">
      {/* ───────────────────────── Intro ───────────────────────── */}
      <section className="shell-wide">
        <div className="grid items-center gap-14 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <div>
            <SectionHeading title="Numbers that tie out, " accentWord="every day" lead={profile.summary} />
            <Reveal delay={0.18}>
              <p className="mt-5 max-w-[62ch] text-[clamp(1rem,1.45vw,1.125rem)] leading-[1.65] text-muted">{profile.summary2}</p>
            </Reveal>
          </div>
          <div className="mx-auto w-full max-w-[360px] lg:max-w-none">
            <FeaturePortrait />
          </div>
        </div>

        <Reveal delay={0.25}>
          <div className="mt-14 flex flex-wrap gap-2">
            <Chip tone="accent">Trade settlement & payments</Chip>
            <Chip tone="sky">Reconciliations</Chip>
            <Chip tone="rose">BSA/AML · OFAC</Chip>
            <Chip tone="brass">FP&A modeling</Chip>
            <Chip>Requirements → Process map → Automation → UAT → Audit trail</Chip>
          </div>
        </Reveal>
      </section>

      {/* ───────────────────── Operating principles ───────────────────── */}
      <section className="shell-wide mt-32">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <h2 className="display text-[clamp(2rem,4.4vw,3.2rem)]">
              Six rules I don't <span className="accent-word">bend</span>
            </h2>
            <p className="max-w-[46ch] text-[15px] text-muted">Open any one. They are the reasons behind how the work on the other pages was done.</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl" style={{ background: "var(--border)", border: "1px solid var(--border)" }}>
          {principles.map((p, i) => {
            const Icon = ICONS[p.icon] ?? Scale;
            const open = openPrinciple === p.id;
            return (
              <Reveal key={p.id} delay={i * 0.04} y={12}>
                <button
                  onClick={() => setOpenPrinciple(open ? null : p.id)}
                  aria-expanded={open}
                  data-cursor={open ? "Close" : "Open"}
                  className="w-full px-5 py-6 text-left transition-colors duration-300 sm:px-8"
                  style={{ background: open ? "color-mix(in oklab, var(--accent) 6%, var(--panel-solid))" : "var(--panel-solid)" }}>
                  <div className="flex items-center gap-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors duration-300"
                      style={{ background: open ? "color-mix(in oklab, var(--accent) 16%, transparent)" : "var(--panel-raised)" }}>
                      <Icon size={17} style={{ color: open ? "var(--accent)" : "var(--text-faint)" }} />
                    </span>
                    <span className="flex-1 text-[clamp(1.1rem,2.2vw,1.45rem)] font-semibold tracking-tight">{p.title}</span>
                    <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3 }}
                      className="text-[22px] leading-none" style={{ color: open ? "var(--accent)" : "var(--text-faint)" }} aria-hidden>+</motion.span>
                  </div>
                  <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.42, ease: EASE }} className="overflow-hidden">
                    <p className="max-w-[70ch] pt-4 text-[16px] leading-[1.7] text-muted sm:pl-[3.75rem]">{p.body}</p>
                  </motion.div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ───────────────────────── Process ───────────────────────── */}
      <ProcessRail />

      {/* ───────────────────────── Quiz ───────────────────────── */}
      <section className="shell-wide mt-32">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <div>
              <h2 className="display text-[clamp(2rem,4.4vw,3rem)]">
                Want to know how I <span className="accent-word">think</span>?
              </h2>
              <p className="mt-5 max-w-[48ch] text-[16px] leading-[1.7] text-muted">
                Anyone can list reconciliations on a résumé. Here are three questions where the right answer shows
                whether someone has actually worked a break queue, or only read about one.
              </p>
              <p className="mt-4 text-[14px] text-faint">Have a go. Nothing is recorded anywhere.</p>
            </div>
          </Reveal>
          <Reveal delay={0.12}><Quiz /></Reveal>
        </div>
      </section>

      {/* ───────────────────────── Certifications ───────────────────────── */}
      <section className="shell-wide mt-32">
        <Reveal>
          <h2 className="display flex items-center gap-4 text-[clamp(2rem,4.2vw,3rem)]">
            <Award size={30} style={{ color: "var(--brass)" }} aria-hidden />
            Certified, and <span className="accent-word -ml-2">current</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {certifications.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05} y={14}>
              <GlassCard className={`group flex h-full items-center gap-5 p-5 ${c.featured ? "md:p-7" : ""}`}
                style={c.featured ? { background: `color-mix(in oklab, ${c.accent} 8%, var(--panel-solid))` } : undefined}>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-[-8deg]"
                  style={{ background: `color-mix(in oklab, ${c.accent} 16%, transparent)`, color: c.accent }}>
                  <Award size={20} />
                </span>
                <span className="min-w-0">
                  <span className={`block font-semibold tracking-tight ${c.featured ? "text-[19px]" : "text-[16px]"}`}>{c.name}</span>
                  <span className="mt-0.5 block text-[14px] text-muted">{c.issuer}</span>
                </span>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────────────── Leadership ───────────────────────── */}
      <section className="shell-wide mt-32">
        <Reveal>
          <h2 className="display text-[clamp(2rem,4.2vw,3rem)]">
            Leading rooms, <span className="accent-word">not just models</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          {leadership.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.1}>
              <GlassCard className="h-full p-7 sm:p-8">
                <p className="text-[14px] font-medium" style={{ color: i === 0 ? "var(--accent)" : "var(--sky)" }}>{l.role}</p>
                <h3 className="mt-1.5 text-[clamp(1.25rem,2.4vw,1.6rem)] font-semibold tracking-tight">{l.org}</h3>
                <p className="mt-3 max-w-[56ch] text-[16px] leading-[1.65] text-muted">{l.body}</p>
                <div className={`mt-7 grid gap-5 ${l.stats.length > 1 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1"}`}>
                  {l.stats.map((s) => (
                    <div key={s.label}>
                      <p className="text-[clamp(2rem,3.6vw,2.6rem)] leading-none font-semibold tracking-[-0.04em]">
                        <Counter to={s.value} prefix={(s as any).prefix} suffix={s.suffix} />
                      </p>
                      <p className="mt-1.5 text-[13.5px] text-faint">{s.label}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────────────── Education ───────────────────────── */}
      <section className="shell-wide mt-32 pb-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-[22px] p-8 sm:p-12" style={{ background: "var(--panel-raised)" }}>
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
              <div>
                <p className="flex items-center gap-2 text-[14px] font-medium" style={{ color: "var(--accent)" }}>
                  <GraduationCap size={17} /> {education.degree} · {education.period}
                </p>
                <h2 className="display mt-4 text-[clamp(2.2rem,5vw,3.8rem)]">{education.field}</h2>
                <p className="mt-3 text-[17px] font-medium">{education.school} <span className="text-muted">· {education.location}</span></p>
                <p className="mt-5 inline-flex rounded-full px-3.5 py-1.5 text-[13px] font-medium"
                  style={{ background: "color-mix(in oklab, var(--brass) 16%, transparent)", color: "var(--brass)" }}>
                  {education.honor}
                </p>
              </div>
              <p className="max-w-[48ch] text-[16px] leading-[1.7] text-muted">{education.note}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-6 flex flex-col items-start gap-5 rounded-[22px] p-8 sm:flex-row sm:items-center sm:justify-between"
            style={{ background: "color-mix(in oklab, var(--accent) 9%, var(--panel-solid))" }}>
            <div>
              <p className="text-[17px] font-semibold">Currently {profile.current}.</p>
              <p className="mt-1.5 max-w-[60ch] text-[14.5px] text-muted">
                Working on JPMorgan Chase payment processing and trade settlement systems. Happy to talk about financial
                analyst, FP&A and business analysis work.
              </p>
            </div>
            <a href={`mailto:${profile.email}`} data-cursor="Email"
              className="btn-primary shine shrink-0 rounded-full px-5 py-3 text-[14px] font-semibold">
              Start a conversation
            </a>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}

/** The engagement as a rail that fills as you scroll past it. */
function ProcessRail() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="shell-wide mt-32">
      <Reveal>
        <h2 className="display text-[clamp(2rem,4.4vw,3.2rem)]">
          From frustration to <span className="accent-word">sign-off</span>
        </h2>
      </Reveal>

      <ol className="relative mt-14 grid gap-10 pl-8 lg:grid-cols-6 lg:gap-6 lg:pl-0 lg:pt-10">
        {/* vertical rail on phones, horizontal on desktop */}
        <span className="absolute top-1 bottom-1 left-[7px] w-[2px] rounded-full lg:hidden" style={{ background: "color-mix(in oklab, var(--text) 10%, transparent)" }} />
        <motion.span className="absolute top-1 bottom-1 left-[7px] w-[2px] origin-top rounded-full lg:hidden" style={{ scaleY: fill, background: "var(--accent)" }} />
        <span className="absolute top-[7px] right-0 left-0 hidden h-[2px] rounded-full lg:block" style={{ background: "color-mix(in oklab, var(--text) 10%, transparent)" }} />
        <motion.span className="absolute top-[7px] right-0 left-0 hidden h-[2px] origin-left rounded-full lg:block" style={{ scaleX: fill, background: "var(--accent)" }} />

        {PROCESS.map((p, i) => (
          <motion.li key={p.step} className="relative"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}>
            <span className="absolute -left-8 top-1 h-4 w-4 rounded-full lg:-top-10 lg:left-0"
              style={{ background: "var(--bg)", border: "3px solid var(--accent)" }} />
            <h3 className="text-[19px] font-semibold tracking-tight">{p.step}</h3>
            <p className="mt-2 text-[15.5px] leading-[1.65] text-muted">{p.body}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
