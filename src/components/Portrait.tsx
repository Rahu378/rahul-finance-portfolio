import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useRef, useState } from "react";

export const PORTRAIT_SRC = `${import.meta.env.BASE_URL}portrait.jpg`;

/** nudge the crop down a touch so the headroom shrinks and the face lifts to the upper third */
const SHIFT = "3.5%";

/* ------------------------------------------------------------------------ */
/*  Dev-only drop target: drag the photo onto the empty portrait slot and it  */
/*  is written to public/portrait.jpg by the vite-plugin-portrait middleware. */
/* ------------------------------------------------------------------------ */
function usePortraitDrop() {
  const [over, setOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const send = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setStatus("error"); setError("That isn't an image file.");
      return;
    }
    setStatus("saving"); setError(null);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch("/__portrait", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl: reader.result }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Save failed");
        window.location.reload();
      } catch (e: any) {
        setStatus("error"); setError(e?.message ?? "Save failed");
      }
    };
    reader.onerror = () => { setStatus("error"); setError("Could not read that file."); };
    reader.readAsDataURL(file);
  }, []);

  const handlers = {
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setOver(true); },
    onDragLeave: () => setOver(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault(); setOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) send(f);
    },
  };

  return { over, status, error, send, handlers };
}

function DropSlot({ label = "Drop your photo here" }: { label?: string }) {
  const { over, status, error, send, handlers } = usePortraitDrop();
  const input = useRef<HTMLInputElement>(null);

  return (
    <div
      {...handlers}
      onClick={() => input.current?.click()}
      className="absolute inset-0 z-20 grid cursor-pointer place-items-center transition-colors duration-300"
      style={{
        background: over ? "color-mix(in oklab, var(--accent) 24%, transparent)" : "transparent",
        border: over ? "2px dashed var(--accent)" : "2px dashed transparent",
        borderRadius: "inherit",
      }}
      data-cursor="Add photo"
    >
      <input
        ref={input} type="file" accept="image/*" hidden
        onChange={(e) => { const f = e.target.files?.[0]; if (f) send(f); }}
      />
      <div className="px-5 pb-16 text-center">
        <p className="text-[12px] font-medium"
          style={{ color: status === "error" ? "var(--rose)" : "var(--accent)" }}>
          {status === "saving" ? "Saving…" : status === "error" ? error : label}
        </p>
        {status !== "saving" && (
          <p className="mt-1.5 text-[11px] text-faint">drag &amp; drop, or click to browse</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Fallback --- */
function Monogram({ className = "", size = "text-[clamp(3rem,9vw,6rem)]" }: { className?: string; size?: string }) {
  return (
    <div className={`grid h-full w-full place-items-center ${className}`}
      style={{ background: "var(--panel-raised)" }}>
      <span className={`display ${size} select-none`} style={{ color: "var(--accent)" }}>RC</span>
    </div>
  );
}

/* --------------------------------------------------------------- Avatar --- */
export function Avatar({ size = 40, ring = true }: { size?: number; ring?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className="relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full"
      style={{
        width: size, height: size,
        border: ring ? "1px solid color-mix(in oklab, var(--accent) 45%, transparent)" : "1px solid var(--border)",
        boxShadow: ring ? "0 0 0 3px color-mix(in oklab, var(--accent) 10%, transparent)" : undefined,
      }}
    >
      {failed && import.meta.env.DEV && (
        <span className="absolute inset-0 z-10" title="Add public/portrait.jpg">
          <DropSlot label="+" />
        </span>
      )}
      {failed ? (
        <Monogram size="text-[0.72em]" />
      ) : (
        <img src={PORTRAIT_SRC} alt="Rahul Reddy CH" onError={() => setFailed(true)}
          className="h-full w-full object-cover"
          /* face sits ~17% above the frame centre: zoom, then re-centre on it */
          style={{ transform: "scale(1.62) translateY(16%)", transformOrigin: "50% 50%" }} />
      )}
    </span>
  );
}

/* ------------------------------------------------------ Feature portrait --- */
/**
 * Large treated portrait: duotone grade that lifts to full colour on hover,
 * data-grid overlay, sweeping scan line and annotation brackets.
 */
export function FeaturePortrait({
  annotations = true,
  className = "",
}: { annotations?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  const [hover, setHover] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 });

  return (
    <motion.div
      ref={wrap}
      onPointerMove={(e) => {
        const r = wrap.current?.getBoundingClientRect(); if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); setHover(false); }}
      onPointerEnter={() => setHover(true)}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative ${className}`}
      data-cursor="Hover to reveal"
    >
      {/* ambient glow */}
      <div className="absolute -inset-10 -z-10 rounded-[48px] opacity-60 blur-3xl"
        style={{ background: "radial-gradient(58% 55% at 50% 42%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 72%)" }} />

      {/* frame */}
      <div className="relative overflow-hidden rounded-[26px]"
        style={{ border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-lg)", background: "var(--panel-solid)", aspectRatio: "4 / 5" }}>

        {failed && import.meta.env.DEV && <DropSlot />}
        {failed ? <Monogram /> : (
          <>
            {/* base image */}
            <img
              src={PORTRAIT_SRC} alt="Rahul Reddy CH, Financial Analyst"
              onError={() => setFailed(true)}
              className="h-full w-full object-cover transition-all duration-700"
              style={{
                objectPosition: "50% 15%",
                filter: hover ? "saturate(1.06) contrast(1.02)" : "grayscale(.62) contrast(1.04) brightness(1.02)",
                transform: hover ? `scale(1.15) translateY(${SHIFT})` : `scale(1.09) translateY(${SHIFT})`,
                transformOrigin: "50% 50%",
              }}
            />
            {/* duotone wash */}
            <div className="pointer-events-none absolute inset-0 transition-opacity duration-700"
              style={{
                opacity: hover ? 0 : 0.42,
                background: "linear-gradient(158deg, color-mix(in oklab, var(--accent) 55%, transparent), transparent 52%), linear-gradient(330deg, color-mix(in oklab, var(--sky) 50%, transparent), transparent 56%)",
                mixBlendMode: "color",
              }} />
          </>
        )}

        {/* grid overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            maskImage: "radial-gradient(120% 90% at 50% 100%, #000 15%, transparent 72%)",
          }} />

        {/* scan sweep */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-24"
          style={{ background: "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--accent) 22%, transparent), transparent)" }}
          animate={{ y: ["-15%", "115%"] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.6 }}
        />

        {/* bottom fade + label */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
          style={{ background: "linear-gradient(to top, color-mix(in oklab, var(--bg) 92%, transparent), transparent)" }} />

        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-x-3 gap-y-2 p-5">
          <div className="min-w-0">
            <p className="text-[12px] font-medium whitespace-nowrap" style={{ color: "var(--accent)" }}>
              Financial Analyst
            </p>
            <p className="mt-1 text-[clamp(1.05rem,2.2vw,1.45rem)] leading-tight font-bold tracking-tight">
              Rahul Reddy CH
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap"
            style={{ border: "1px solid color-mix(in oklab, var(--brass) 34%, transparent)", background: "color-mix(in oklab, var(--brass) 14%, transparent)", color: "var(--brass)" }}>
            AWS Certified
          </span>
        </div>

        {/* corner brackets */}
        {(["tl", "tr", "bl", "br"] as const).map((c) => (
          <span key={c} className="pointer-events-none absolute h-5 w-5"
            style={{
              top: c.startsWith("t") ? 14 : undefined,
              bottom: c.startsWith("b") ? 14 : undefined,
              left: c.endsWith("l") ? 14 : undefined,
              right: c.endsWith("r") ? 14 : undefined,
              borderTop: c.startsWith("t") ? "1.5px solid var(--accent)" : undefined,
              borderBottom: c.startsWith("b") ? "1.5px solid var(--accent)" : undefined,
              borderLeft: c.endsWith("l") ? "1.5px solid var(--accent)" : undefined,
              borderRight: c.endsWith("r") ? "1.5px solid var(--accent)" : undefined,
              opacity: 0.75,
            }} />
        ))}
      </div>

      {/* floating annotations */}
      {annotations && (
        <>
          <motion.div
            initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="float-slow absolute -top-4 -left-6 hidden rounded-xl px-3.5 py-2.5 sm:block"
            style={{ background: "var(--panel-solid)", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-lg)" }}>
            <p className="text-[11px] text-faint">Now supporting</p>
            <p className="text-[14px] font-semibold tracking-tight" style={{ color: "var(--accent)" }}>Trade settlement</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="float-slow absolute -right-7 bottom-24 hidden rounded-xl px-3.5 py-2.5 sm:block"
            style={{ background: "var(--panel-solid)", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-lg)", animationDelay: "1.6s" }}>
            <p className="text-[11px] text-faint">Based in</p>
            <p className="text-[14px] font-semibold" style={{ color: "var(--sky)" }}>United States</p>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
