import { useEffect, useRef, useState } from "react";

/** Corporate-precision cursor: a crosshair ring that snaps to interactive targets. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [hot, setHot] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    let rx = window.innerWidth / 2, ry = window.innerHeight / 2;
    let tx = rx, ty = ry;
    let raf = 0;

    const loop = () => {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      if (dot.current) dot.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor],a,button,[role='button']") as HTMLElement | null;
      if (el) {
        setHot(true);
        setLabel(el.getAttribute("data-cursor"));
      } else {
        setHot(false);
        setLabel(null);
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    document.body.style.cursor = "none";
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.body.style.cursor = "";
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block" aria-hidden>
      <div
        ref={ring}
        className="absolute top-0 left-0 flex items-center justify-center rounded-full"
        style={{
          width: hot ? 54 : 30,
          height: hot ? 54 : 30,
          border: `1px solid ${hot ? "var(--accent)" : "var(--border-strong)"}`,
          background: hot ? "color-mix(in oklab, var(--accent) 10%, transparent)" : "transparent",
          backdropFilter: hot ? "blur(2px)" : "none",
          transition: "width .32s cubic-bezier(.16,1,.3,1), height .32s cubic-bezier(.16,1,.3,1), border-color .3s, background .3s",
        }}
      >
        {label && (
          <span
            className="absolute top-full mt-2 rounded-full px-2 py-0.5 font-mono text-[9.5px] tracking-[0.14em] whitespace-nowrap uppercase"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            {label}
          </span>
        )}
      </div>
      <div
        ref={dot}
        className="absolute top-0 left-0 rounded-full"
        style={{
          width: 4, height: 4,
          background: hot ? "var(--accent)" : "var(--text)",
          opacity: hot ? 0 : 0.9,
          transition: "opacity .25s",
        }}
      />
    </div>
  );
}
