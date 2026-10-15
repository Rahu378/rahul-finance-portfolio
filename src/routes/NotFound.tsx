import { ArrowLeft, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import { Reveal } from "../components/ui";
import { ROUTES } from "../lib/routes";

export default function NotFound() {
  return (
    <PageShell className="pt-[140px]">
      <section className="shell flex min-h-[60vh] flex-col items-center justify-center pb-24 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium"
            style={{ background: "color-mix(in oklab, var(--rose) 12%, transparent)", color: "var(--rose)" }}>
            <TriangleAlert size={13} /> Unmatched record
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="display num mt-8 text-[clamp(4rem,14vw,9rem)]">404</h1>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-muted">
            This page has no matching entry on the other side of the ledger. One of these will tie out.
          </p>
        </Reveal>
        <Reveal delay={0.26}>
          <div className="mt-9 flex flex-wrap justify-center gap-2">
            {ROUTES.map((r) => (
              <Link key={r.path} to={r.path} data-cursor="Go" className="btn-ghost rounded-full px-4 py-2 text-[14px]">{r.label}</Link>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.34}>
          <Link to="/" data-cursor="Home" className="btn-primary shine mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-semibold">
            <ArrowLeft size={15} /> Back to the start
          </Link>
        </Reveal>
      </section>
    </PageShell>
  );
}
