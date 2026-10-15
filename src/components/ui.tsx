import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode, type CSSProperties } from "react";
import { useCountUp, useSheen } from "../lib/hooks";

export const EASE = [0.16, 1, 0.3, 1] as const;

/* --------------------------------------------------------------- REVEAL */
export function Reveal({
  children, delay = 0, y = 24, once = true, className = "",
}: { children: ReactNode; delay?: number; y?: number; once?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "0px 0px -10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.85, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------------------------- STAGGERED CHILDREN */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.05 } },
};
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function Stagger({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <motion.div ref={ref} variants={staggerParent} initial="hidden" animate={inView ? "show" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------- SPLIT HEADLINE */
export function SplitText({
  text, className = "", delay = 0, stagger = 0.04,
}: { text: string; className?: string; delay?: number; stagger?: number }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotate: 4 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{ duration: 1, delay: delay + i * stagger, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------ SECTION HEADING */
/** Heading + lead. No label above it: the heading carries its own weight. */
export function SectionHeading({
  title, accentWord, lead, align = "left", as = "h1", size = "lg",
}: {
  title: string; accentWord?: string; lead?: ReactNode;
  align?: "left" | "center"; as?: "h1" | "h2"; size?: "lg" | "md";
}) {
  const parts = accentWord ? title.split(accentWord) : [title];
  const Tag = as;
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <Reveal>
        <Tag className={`display ${size === "lg" ? "text-[clamp(2.4rem,6vw,4.6rem)]" : "text-[clamp(1.9rem,4.2vw,3rem)]"}`}>
          {parts[0]}
          {accentWord && <span className="accent-word">{accentWord}</span>}
          {parts[1]}
        </Tag>
      </Reveal>
      {lead && (
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[62ch] text-[clamp(1rem,1.45vw,1.125rem)] leading-[1.65] text-muted">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- COUNTER */
export function Counter({
  to, suffix = "", prefix = "", decimals = 0, className = "",
}: { to: number; suffix?: string; prefix?: string; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const v = useCountUp(to, inView);
  return (
    <span ref={ref} className={`num ${className}`}>
      {prefix}{v.toFixed(decimals)}{suffix}
    </span>
  );
}

/* ------------------------------------------------------------- GLASS CARD */
export function GlassCard({
  children, className = "", style, onClick, as = "div", ariaLabel, ariaPressed,
}: {
  children: ReactNode; className?: string; style?: CSSProperties;
  onClick?: () => void; as?: "div" | "button"; ariaLabel?: string; ariaPressed?: boolean;
}) {
  const { ref, onMove } = useSheen<HTMLDivElement>();
  const Tag: any = as;
  return (
    <Tag
      ref={ref as any}
      onMouseMove={onMove}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className={`card card-sheen overflow-hidden ${onClick ? "cursor-pointer text-left" : ""} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ CHIP */
export type Tone = "default" | "accent" | "sky" | "brass" | "rose";
const TONES: Record<Tone, string> = {
  default: "var(--text-faint)", accent: "var(--accent)", sky: "var(--sky)", brass: "var(--brass)", rose: "var(--rose)",
};

export function Chip({ children, tone = "default", className = "" }: { children: ReactNode; tone?: Tone; className?: string }) {
  const c = TONES[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium whitespace-nowrap ${className}`}
      style={{
        color: tone === "default" ? "var(--text-muted)" : c,
        background: `color-mix(in oklab, ${c} 11%, transparent)`,
        border: `1px solid color-mix(in oklab, ${c} 24%, transparent)`,
      }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------- KBD */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-[6px] px-1.5 py-0.5 font-mono text-[10px] font-medium"
      style={{ border: "1px solid var(--border-strong)", background: "var(--panel-raised)", color: "var(--text-muted)" }}>
      {children}
    </kbd>
  );
}

/* --------------------------------------------------------------- MAGNETIC */
export function Magnetic({ children, strength = 0.25, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={(e) => {
        const el = ref.current; if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }}
      onMouseLeave={() => { const el = ref.current; if (el) el.style.transform = "translate3d(0,0,0)"; }}
      style={{ transition: "transform .55s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------- PROGRESS */
export function Meter({ value, color = "var(--accent)", height = 4, delay = 0 }: { value: number; color?: string; height?: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <div ref={ref} className="w-full overflow-hidden rounded-full" style={{ height, background: "color-mix(in oklab, var(--text) 10%, transparent)" }}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: value / 100 } : {}}
        transition={{ duration: 1.2, delay, ease: EASE }}
        style={{ height: "100%", background: color, borderRadius: 99, transformOrigin: "0% 50%" }}
      />
    </div>
  );
}

/* --------------------------------------------------------------- MARQUEE */
export function Marquee({ items, speed = 48 }: { items: string[]; speed?: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-4" style={{ maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}>
      <div className="marquee-track gap-10" style={{ animationDuration: `${speed}s` }}>
        {doubled.map((t, i) => (
          <span key={i} className="flex items-center gap-10 text-[14px] font-medium whitespace-nowrap text-faint">
            {t}
            <span className="h-1 w-1 rounded-full" style={{ background: "var(--accent)" }} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- SEGMENTED */
export function Segmented<T extends string>({
  value, onChange, options, id, full = false,
}: {
  value: T; onChange: (v: T) => void; id: string; full?: boolean;
  options: readonly (readonly [T, React.ComponentType<{ size?: number }>, string])[];
}) {
  return (
    <div role="tablist" className={`flex rounded-full p-1 ${full ? "w-full" : ""}`} style={{ border: "1px solid var(--border)", background: "var(--panel)" }}>
      {options.map(([v, Icon, label]) => (
        <button key={v} role="tab" aria-selected={value === v} onClick={() => onChange(v)} data-cursor={label}
          className={`relative isolate flex items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${full ? "flex-1" : ""}`}
          style={{ color: value === v ? "var(--on-accent)" : "var(--text-muted)" }}>
          {value === v && (
            <motion.span layoutId={`seg-${id}`} className="absolute inset-0 -z-10 rounded-full"
              style={{ background: "var(--accent)" }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }} />
          )}
          <Icon size={13} /> {label}
        </button>
      ))}
    </div>
  );
}

/* -------------------------------------------------------- MONEY FORMAT */
export const fmtMoney = (n: number, compact = true) => {
  const sign = n < 0 ? "−" : "";
  const a = Math.abs(n);
  if (compact && a >= 1_000_000) return `${sign}$${(a / 1_000_000).toFixed(2)}M`;
  if (compact && a >= 1_000) return `${sign}$${(a / 1_000).toFixed(1)}K`;
  return `${sign}$${a.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
};
