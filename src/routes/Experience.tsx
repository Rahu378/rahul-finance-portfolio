import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase, Building2, CheckCircle2, FastForward, FileText, MapPin, MessageSquare, Rewind,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageShell from "../components/PageShell";
import { Chip, EASE, Reveal, SectionHeading, Segmented } from "../components/ui";
import { jobs } from "../data/profile";

type Mode = "chat" | "resume";
const CHRONO = [...jobs].reverse();

export default function Experience() {
  const { hash } = useLocation();
  const [activeId, setActiveId] = useState(() => jobs.find((j) => `#${j.id}` === hash)?.id ?? jobs[0].id);
  const [mode, setMode] = useState<Mode>("chat");
  const job = jobs.find((j) => j.id === activeId)!;
  const [shown, setShown] = useState(0);
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    const fromHash = jobs.find((j) => `#${j.id}` === hash);
    if (fromHash) setActiveId(fromHash.id);
  }, [hash]);

  useEffect(() => {
    setShown(0);
    if (mode !== "chat") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(job.thread.length); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= job.thread.length) clearInterval(id);
    }, 820);
    return () => clearInterval(id);
  }, [activeId, mode, job.thread.length, replay]);

  return (
    <PageShell className="pt-[128px]">
      <section className="shell-wide">
        <SectionHeading
          title="Four roles, "
          accentWord="one conversation"
          lead="Every role started the same way: someone in operations, finance or compliance describing a problem in business language. These are those conversations, retold, and what got built in response. Prefer the formal version? Switch to résumé mode."
        />

        {/* ───────────── Timeline strip ───────────── */}
        <Reveal delay={0.2}>
          <div className="mt-14">
            <div className="mb-3 flex items-center justify-between text-[12.5px] text-faint">
              <span>May 2021</span><span>Present</span>
            </div>
            <div className="relative flex h-16 gap-1.5 overflow-hidden rounded-2xl p-1.5" role="tablist" aria-label="Roles"
              style={{ border: "1px solid var(--border)", background: "var(--panel)" }}>
              {CHRONO.map((j) => {
                const active = j.id === activeId;
                return (
                  <motion.button
                    key={j.id}
                    role="tab" aria-selected={active}
                    onClick={() => setActiveId(j.id)}
                    data-cursor={j.short}
                    whileTap={{ scale: 0.98 }}
                    className="relative flex min-w-0 items-center overflow-hidden rounded-xl px-3 text-left transition-colors duration-300"
                    style={{
                      flex: j.weight,
                      background: active ? `color-mix(in oklab, ${j.accent} 18%, transparent)` : "color-mix(in oklab, var(--text) 4%, transparent)",
                      border: `1px solid ${active ? `color-mix(in oklab, ${j.accent} 45%, transparent)` : "transparent"}`,
                    }}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13.5px] font-semibold" style={{ color: active ? j.accent : "var(--text-muted)" }}>{j.short}</span>
                      <span className="num block truncate text-[11.5px] text-faint">{j.period}</span>
                    </span>
                    {j.current && (
                      <span className="pulse-dot absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)", color: "var(--accent)" }} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* ───────────── Main panel ───────────── */}
        <div className="mt-8 grid gap-6 pb-16 lg:grid-cols-[400px_1fr]">
          <div className="lg:sticky lg:top-[92px] lg:self-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={job.id}
                id={job.id}
                initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="card scroll-mt-28 overflow-hidden" style={{ background: "var(--panel-solid)" }} data-ui
              >
                <div className="px-6 pt-6 pb-5" style={{ background: `color-mix(in oklab, ${job.accent} 9%, var(--panel-solid))` }}>
                  <div className="flex items-start gap-3.5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-[15px] font-bold tracking-tight"
                      style={{ background: `color-mix(in oklab, ${job.accent} 18%, transparent)`, color: job.accent }}>
                      {job.initials}
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-[18px] leading-tight font-semibold tracking-tight">{job.company}</h2>
                      <p className="mt-1 text-[14px] font-medium" style={{ color: job.accent }}>{job.role}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Chip>{job.period}</Chip>
                    {job.current ? <Chip tone="accent">Current</Chip> : <Chip>{job.duration}</Chip>}
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <p className="mt-5 flex items-start gap-2 text-[13.5px] text-faint">
                    <MapPin size={14} className="mt-0.5 shrink-0" /> {job.location}
                  </p>
                  {job.project && (
                    <p className="mt-2 flex items-start gap-2 text-[13.5px]">
                      <Briefcase size={14} className="mt-0.5 shrink-0 text-faint" />
                      <span><span className="text-faint">Project: </span>{job.project}</span>
                    </p>
                  )}
                  <p className="mt-4 text-[15px] leading-[1.65] text-muted">{job.headline}</p>

                  <p className="mt-6 mb-2.5 text-[13px] font-semibold">Environment</p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.environment.map((t) => (
                      <span key={t} className="rounded-md px-2 py-1 text-[12px]" style={{ background: "var(--panel-raised)", color: "var(--text-muted)" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4">
              <Segmented id="exp-mode" full value={mode} onChange={setMode}
                options={[["chat", MessageSquare, "Conversation"], ["resume", FileText, "Résumé"]] as const} />
            </div>
          </div>

          <div>
            <AnimatePresence mode="wait">
              {mode === "chat" ? (
                <motion.div key={`chat-${job.id}`}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="card overflow-hidden" style={{ background: "var(--panel-solid)" }}>
                  <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-3">
                      <span className="relative grid h-9 w-9 place-items-center rounded-full"
                        style={{ background: `color-mix(in oklab, ${job.accent} 16%, transparent)` }}>
                        <Building2 size={15} style={{ color: job.accent }} />
                        <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full"
                          style={{ background: "var(--accent)", border: "2px solid var(--panel-solid)" }} />
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold">{job.company} · stakeholders</p>
                        <p className="text-[12px] text-faint" aria-live="polite">
                          {shown < job.thread.length ? "typing…" : `${job.thread.length} messages`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => setReplay((r) => r + 1)} aria-label="Replay conversation" data-cursor="Replay"
                        className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:text-[color:var(--text)]"
                        style={{ border: "1px solid var(--border)", color: "var(--text-faint)" }}>
                        <Rewind size={13} />
                      </button>
                      <button onClick={() => setShown(job.thread.length)} aria-label="Show all messages" data-cursor="Skip"
                        className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:text-[color:var(--text)]"
                        style={{ border: "1px solid var(--border)", color: "var(--text-faint)" }}>
                        <FastForward size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 px-4 py-6 sm:px-6" style={{ background: "var(--bg)", minHeight: 520 }}>
                    {job.thread.slice(0, shown).map((m, i) => {
                      const mine = m.from === "me";
                      return (
                        <motion.div
                          key={`${job.id}-${replay}-${i}`}
                          initial={{ opacity: 0, y: 14, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.55, ease: EASE }}
                          className={`flex ${mine ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex max-w-[86%] flex-col gap-1 sm:max-w-[74%] ${mine ? "items-end" : "items-start"}`}>
                            {!mine && i === 0 && <span className="ml-1 text-[12px] text-faint">Business stakeholder</span>}
                            {mine && i > 0 && job.thread[i - 1].from !== "me" && (
                              <span className="mr-1 text-[12px] font-medium" style={{ color: job.accent }}>Rahul</span>
                            )}
                            <div className={`${mine ? "bubble-out" : "bubble-in"} px-4 py-3`}
                              style={mine ? { borderColor: `color-mix(in oklab, ${job.accent} 36%, transparent)`, background: `color-mix(in oklab, ${job.accent} 13%, var(--panel-solid))` } : undefined}>
                              <p className="text-[14.5px] leading-[1.6]">{m.text}</p>
                              <div className="mt-1.5 flex items-center justify-end gap-1.5">
                                {m.kind === "stack" && <Chip tone="sky">stack</Chip>}
                                {m.kind === "metric" && <Chip tone="accent">delivered</Chip>}
                                <span className="num text-[11px] text-muted">{m.time}</span>
                                {mine && <CheckCircle2 size={11} style={{ color: "var(--accent)" }} />}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {shown < job.thread.length && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex ${job.thread[shown]?.from === "me" ? "justify-end" : "justify-start"}`}>
                        <div className={`${job.thread[shown]?.from === "me" ? "bubble-out" : "bubble-in"} typing px-4 py-3.5`}>
                          <span /><span /><span />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div key={`resume-${job.id}`}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="card overflow-hidden" style={{ background: "var(--panel-solid)" }}>
                  <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
                    <p className="text-[16px] font-semibold">{job.role}</p>
                    <p className="mt-0.5 text-[13.5px] text-faint">{job.company} · {job.location} · {job.period}</p>
                  </div>
                  <ul>
                    {job.bullets.map((b, i) => (
                      <motion.li key={i}
                        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.45, ease: EASE }}
                        className="group flex gap-4 px-6 py-5 transition-colors hover:bg-[color:color-mix(in_oklab,var(--accent)_5%,transparent)]"
                        style={{ borderTop: i ? "1px solid var(--border)" : undefined }}>
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: job.accent }} />
                        <span className="text-[15px] leading-[1.68] text-muted transition-colors group-hover:text-[color:var(--text)]">{b}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="px-6 py-5" style={{ borderTop: "1px solid var(--border)", background: "var(--panel-raised)" }}>
                    <p className="text-[13px] font-semibold">Key functional areas</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.areas.map((a) => <Chip key={a} tone="accent">{a}</Chip>)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
