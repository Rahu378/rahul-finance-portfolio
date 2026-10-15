import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import GithubMark from "../components/GithubMark";
import PageShell from "../components/PageShell";
import ScenarioPlanner from "../components/ScenarioPlanner";
import StructuringLab from "../components/StructuringLab";
import SwimlaneDemo from "../components/SwimlaneDemo";
import { Counter, Reveal, SectionHeading } from "../components/ui";
import { projects, type Project } from "../data/profile";

const LABS: Record<string, { title: string; body: string; node: ReactNode; extra?: ReactNode }> = {
  finsight: {
    title: "Try the structuring check",
    body: "Change the lookback window and the near-threshold band, then run the review. Watch which deposits get grouped, and how quickly a tight rule stops seeing a pattern a looser one catches.",
    node: <StructuringLab />,
  },
  text2workflow: {
    title: "Turn a paragraph into a swimlane",
    body: "Pick a process or write your own. The parser finds the owners, the trigger and the decisions, validates the flow and draws the blueprint. Export it as SVG.",
    node: <SwimlaneDemo />,
  },
  fpa: {
    title: "Four scenarios, one driver model",
    body: "Switch between base, upside, downside and stress. Only the drivers change; revenue, gross profit and operating profit fall out of them.",
    node: <ScenarioPlanner />,
    extra: (
      <Link to="/impact" data-cursor="Open"
        className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: "var(--accent)" }}>
        The price-volume-mix bridge from the same capstone is on the Impact page <ArrowRight size={14} />
      </Link>
    ),
  },
};

export default function Projects() {
  return (
    <PageShell className="pt-[128px]">
      <section className="shell-wide">
        <SectionHeading
          title="Three builds you can "
          accentWord="run"
          lead="A compliance agent, a process-mapping engine and an FP&A capstone. Each one comes with a working piece in the browser, using sample data, so you can see how it thinks rather than read that it does."
        />
      </section>

      {projects.map((p, i) => (
        <ProjectBlock key={p.id} p={p} flip={i % 2 === 1} />
      ))}
    </PageShell>
  );
}

function ProjectBlock({ p, flip }: { p: Project; flip: boolean }) {
  const lab = LABS[p.id];
  return (
    <section id={p.id} className="shell-wide scroll-mt-24 pt-28">
      <div className={`grid gap-10 lg:items-end ${flip ? "lg:grid-cols-[0.8fr_1.2fr]" : "lg:grid-cols-[1.2fr_0.8fr]"}`}>
        <Reveal className={flip ? "lg:order-2" : ""}>
          <p className="text-[14px] font-medium" style={{ color: p.accent }}>{p.kind}</p>
          <h2 className="display mt-3 text-[clamp(2.4rem,5.4vw,4.2rem)]">{p.name}</h2>
          <div className="mt-6 space-y-3">
            {p.bullets.map((b) => (
              <p key={b} className="max-w-[62ch] text-[16px] leading-[1.7] text-muted">{b}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {p.environment.map((e) => (
              <span key={e} className="rounded-md px-2.5 py-1 text-[12.5px]" style={{ background: "var(--panel-raised)", color: "var(--text-muted)" }}>{e}</span>
            ))}
            {p.repo && (
              <a href={p.repo} target="_blank" rel="noopener noreferrer" data-cursor="GitHub"
                className="btn-ghost ml-1 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium">
                <GithubMark size={13} /> Source <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1} className={flip ? "lg:order-1" : ""}>
          <div className="rounded-[22px] p-7" style={{ background: `color-mix(in oklab, ${p.accent} 10%, var(--panel-solid))` }}>
            <p className="text-[clamp(3.2rem,7vw,5rem)] leading-none font-semibold tracking-[-0.045em]" style={{ color: p.accent }}>
              <Counter to={p.metric.value} prefix={p.metric.prefix} suffix={p.metric.suffix} />
            </p>
            <p className="mt-3 max-w-[30ch] text-[15px] font-medium">{p.metric.label}</p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.05}>
        <div className="mt-14 mb-5 flex flex-wrap items-end justify-between gap-4">
          <h3 className="text-[clamp(1.35rem,2.4vw,1.75rem)] font-semibold tracking-tight">{lab.title}</h3>
          <p className="max-w-[60ch] text-[15px] leading-relaxed text-muted">{lab.body}</p>
        </div>
      </Reveal>
      <Reveal delay={0.1}>{lab.node}</Reveal>
      {lab.extra && <Reveal delay={0.15}>{lab.extra}</Reveal>}
    </section>
  );
}
