import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Mail, MapPin, Phone, Send, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import GithubMark from "../components/GithubMark";
import PageShell from "../components/PageShell";
import { Avatar } from "../components/Portrait";
import { Chip, GlassCard, Reveal, SectionHeading } from "../components/ui";
import { profile } from "../data/profile";
import { useCopy } from "../lib/hooks";

const INTENTS = [
  { id: "role", label: "A role to discuss", subject: "Financial Analyst role: let's talk",
    body: "Hi Rahul,\n\nWe're hiring for a financial analyst / FP&A / business analyst role and your background looks like a strong fit.\n\nRole:\nTeam:\nSystems and tools:\n\nWould you be open to a short call this week?" },
  { id: "recon", label: "Reconciliation or reporting automation", subject: "Our reconciliations need automating",
    body: "Hi Rahul,\n\nOur reconciliation and reporting still lean on manual matching and spreadsheets.\n\nWhat we reconcile (cash, positions, custody, GL):\nRough volumes:\nWhere breaks pile up:\n\nCould we talk it through?" },
  { id: "compliance", label: "Compliance & AML tooling", subject: "BSA/AML and OFAC monitoring question",
    body: "Hi Rahul,\n\nWe're looking at our transaction monitoring and sanctions screening.\n\nCurrent setup:\nAlert volumes / false positives:\nWhat audit or examiners have asked for:\n\nCan we set up a conversation?" },
  { id: "other", label: "Something else", subject: "Hello from your portfolio", body: "Hi Rahul,\n\n" },
];

export default function Contact() {
  const { copy, copied } = useCopy();
  const [intent, setIntent] = useState(INTENTS[0]);
  const [from, setFrom] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState(INTENTS[0].body);

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(company ? `${intent.subject} (${company})` : intent.subject);
    const body = encodeURIComponent(`${message}\n\n${from || "(your name)"}${company ? `\n${company}` : ""}`);
    return `mailto:${profile.email}?subject=${subject}&body=${body}`;
  }, [intent, message, from, company]);

  const pickIntent = (it: typeof INTENTS[number]) => { setIntent(it); setMessage(it.body); };

  return (
    <PageShell className="pt-[128px]">
      <section className="shell-wide">
        <SectionHeading
          title="Tell me where the numbers "
          accentWord="don't tie"
          lead="The most useful first message is usually the problem rather than the job description: a reconciliation that eats every Monday, an alert queue nobody trusts, a variance nobody can explain. Start there and I'll tell you honestly how I'd approach it."
        />

        <div className="mt-16 grid gap-6 pb-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <Reveal>
              <GlassCard className="p-7">
                <div className="flex items-center gap-4">
                  <Avatar size={64} />
                  <div>
                    <p className="display text-[clamp(1.6rem,3.2vw,2.1rem)]">{profile.name}</p>
                    <p className="mt-1 text-[14.5px] text-muted">{profile.role} · {profile.location}</p>
                  </div>
                </div>

                <div className="my-6 rule" />

                <ul className="space-y-2">
                  <ContactRow icon={<Mail size={15} />} label="Email" value={profile.email}
                    href={`mailto:${profile.email}`} onCopy={() => copy(profile.email, "email")} copied={copied === "email"} />
                  <ContactRow icon={<Phone size={15} />} label="Phone" value={profile.phone}
                    href={profile.phoneHref} onCopy={() => copy(profile.phone, "phone")} copied={copied === "phone"} />
                  <ContactRow icon={<GithubMark size={15} />} label="GitHub" value="github.com/Rahu378" href={profile.github} external />
                  <ContactRow icon={<MapPin size={15} />} label="Location" value={profile.location} />
                </ul>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.1}>
              <GlassCard className="p-7">
                <p className="text-[15px] font-semibold">What's useful to include</p>
                <ul className="mt-4 space-y-3">
                  {[
                    "What you reconcile or report on: cash, positions, custody, the general ledger, KPIs.",
                    "The systems and tools involved: SQL databases, Excel, Tableau or Power BI, a planning tool.",
                    "The painful part: breaks that age, alerts that swamp reviewers, a close that runs late.",
                    "Whether you need analysis, automation, requirements and UAT, or all of it.",
                  ].map((t, i) => (
                    <motion.li key={i}
                      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                      className="flex gap-3 text-[14.5px] leading-relaxed text-muted">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
                      {t}
                    </motion.li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="flex flex-wrap gap-2">
                <Chip tone="accent">JPMorgan Chase settlement systems</Chip>
                <Chip tone="brass">AWS Certified Developer</Chip>
                <Chip tone="sky">US-based</Chip>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <GlassCard className="overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <p className="flex items-center gap-2.5 text-[15px] font-semibold">
                  <Sparkles size={15} style={{ color: "var(--accent)" }} /> Compose an intro
                </p>
                <p className="text-[12.5px] text-faint">Opens your mail app</p>
              </div>

              <div className="px-6 py-6">
                <p className="mb-3 text-[13.5px] font-semibold">What's this about?</p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Topic">
                  {INTENTS.map((it) => {
                    const on = it.id === intent.id;
                    return (
                      <motion.button key={it.id} onClick={() => pickIntent(it)} whileTap={{ scale: 0.96 }}
                        role="radio" aria-checked={on} data-cursor="Select"
                        className="rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors"
                        style={{
                          border: `1px solid ${on ? "color-mix(in oklab, var(--accent) 50%, transparent)" : "var(--border)"}`,
                          background: on ? "color-mix(in oklab, var(--accent) 12%, transparent)" : "var(--panel-raised)",
                          color: on ? "var(--accent)" : "var(--text-muted)",
                        }}>
                        {it.label}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Field label="Your name" value={from} onChange={setFrom} placeholder="Alex Morgan" />
                  <Field label="Company" value={company} onChange={setCompany} placeholder="Northwind Capital" />
                </div>

                <div className="mt-3">
                  <label htmlFor="msg" className="mb-2 block text-[13.5px] font-semibold">Message</label>
                  <textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} rows={9}
                    className="w-full resize-y rounded-xl px-4 py-3 text-[14px] leading-[1.7] outline-none transition-colors focus:border-[color:var(--accent)]"
                    style={{ border: "1px solid var(--border)", background: "var(--bg)" }} />
                </div>

                <a href={mailto} data-cursor="Send"
                  className="btn-primary shine mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[14.5px] font-semibold">
                  <Send size={15} /> Open in mail app
                </a>
                <p className="mt-3 text-center text-[12.5px] text-faint">
                  Nothing is submitted or stored here. This builds a draft in your own email client.
                </p>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  const id = `f-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13.5px] font-semibold">{label}</label>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl px-4 py-2.5 text-[14px] outline-none transition-colors placeholder:text-[color:var(--text-faint)] focus:border-[color:var(--accent)]"
        style={{ border: "1px solid var(--border)", background: "var(--bg)" }} />
    </div>
  );
}

function ContactRow({
  icon, label, value, href, onCopy, copied, external,
}: { icon: React.ReactNode; label: string; value: string; href?: string; onCopy?: () => void; copied?: boolean; external?: boolean }) {
  const inner = (
    <span className="flex min-w-0 flex-1 items-center gap-3.5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: "var(--panel-raised)", color: "var(--accent)" }}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] text-faint">{label}</span>
        <span className="block truncate text-[15px] font-medium">{value}</span>
      </span>
    </span>
  );

  return (
    <li className="flex items-center gap-2 rounded-xl px-1 py-1.5">
      {href ? (
        <a href={href} data-cursor="Open" target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}
          className="group flex min-w-0 flex-1 items-center gap-2">
          {inner}
          <ArrowUpRight size={14} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: "var(--text-faint)" }} />
        </a>
      ) : inner}
      {onCopy && (
        <button onClick={onCopy} aria-label={`Copy ${label}`} data-cursor="Copy"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors hover:bg-[color:var(--panel-raised)]"
          style={{ border: "1px solid var(--border)", color: copied ? "var(--accent)" : "var(--text-faint)" }}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      )}
    </li>
  );
}
