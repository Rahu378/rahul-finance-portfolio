import { ArrowUpRight, Check, Copy, Mail, MapPin, Phone } from "lucide-react";
import GithubMark from "./GithubMark";
import { Link } from "react-router-dom";
import { profile } from "../data/profile";
import { useCopy } from "../lib/hooks";
import { ROUTES } from "../lib/routes";
import { Marquee, Reveal } from "./ui";

export default function Footer() {
  const { copy, copied } = useCopy();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-32" style={{ borderTop: "1px solid var(--border)", background: "color-mix(in oklab, var(--bg) 70%, transparent)" }}>
      <Marquee
        speed={56}
        items={[
          "Cash vs. position", "Custody vs. accounting", "Break resolution", "T+1 settlement",
          "BSA / AML", "OFAC screening", "Driver-based planning", "Price-volume-mix",
          "Scenario & stress testing", "Month-end close", "UAT", "Audit readiness",
        ]}
      />
      <div className="rule" />

      <div className="shell-wide grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="display text-[clamp(1.8rem,3.6vw,2.7rem)]">
            Let's make the numbers <span className="accent-word">tie out</span>.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}`} data-cursor="Email"
              className="btn-primary shine inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-semibold">
              <Mail size={14} /> {profile.email}
            </a>
            <button onClick={() => copy(profile.email, "e")} data-cursor="Copy"
              className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13.5px]">
              {copied === "e" ? <><Check size={14} style={{ color: "var(--accent)" }} /> Copied</> : <><Copy size={14} /> Copy address</>}
            </button>
          </div>
        </div>

        <nav aria-label="Footer">
          <p className="text-[13px] font-semibold">Pages</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {ROUTES.map((r) => (
              <li key={r.path}>
                <Link to={r.path} className="group inline-flex items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-[color:var(--accent)]">
                  {r.label}
                  <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-[13px] font-semibold">Direct</p>
          <ul className="mt-4 space-y-3 text-[14px] text-muted">
            <li className="flex items-center gap-2.5"><MapPin size={14} style={{ color: "var(--accent)" }} /> {profile.location}</li>
            <li><a href={profile.phoneHref} className="flex items-center gap-2.5 transition-colors hover:text-[color:var(--accent)]"><Phone size={14} style={{ color: "var(--accent)" }} /> {profile.phone}</a></li>
            <li><a href={`mailto:${profile.email}`} className="flex items-center gap-2.5 transition-colors hover:text-[color:var(--accent)]"><Mail size={14} style={{ color: "var(--accent)" }} /> {profile.email}</a></li>
            <li><a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 transition-colors hover:text-[color:var(--accent)]"><GithubMark size={14} style={{ color: "var(--accent)" }} /> github.com/Rahu378</a></li>
          </ul>
        </div>
      </div>

      {/* the name returns at full width as the close */}
      <div className="shell-wide overflow-hidden pb-4">
        <Reveal y={40}>
          <p aria-hidden className="display select-none text-center leading-[0.82] whitespace-nowrap"
            style={{ fontSize: "clamp(3rem, 12.4vw, 13.5rem)", color: "color-mix(in oklab, var(--text) 7%, transparent)", letterSpacing: "-0.05em" }}>
            Rahul Reddy CH
          </p>
        </Reveal>
      </div>

      <div className="rule" />
      <div className="shell-wide flex flex-col items-center justify-between gap-2 py-6 text-[12.5px] text-faint sm:flex-row">
        <span>© {year} {profile.name}</span>
        <span>Built in React, reconciled to the résumé line by line.</span>
      </div>
    </footer>
  );
}
