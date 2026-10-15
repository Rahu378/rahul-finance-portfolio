import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number; pulse: number };
type Packet = { a: number; b: number; t: number; speed: number; hue: "accent" | "brass" };

/**
 * Ambient "settlement network": drifting nodes joined by relationship lines,
 * with small packets travelling the links like payments clearing between accounts.
 * The pointer pushes nodes aside and lights up the ones nearby.
 */
export default function Background({ theme }: { theme: "dark" | "light" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -9999, y: -9999, active: false });
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0, h = 0, dpr = 1;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let lastSpawn = 0;
    const LINK = 140;

    const seed = () => {
      const area = w * h;
      const count = Math.max(24, Math.min(80, Math.round(area / 24000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.6 + 0.8,
        pulse: Math.random() * Math.PI * 2,
      }));
      packets = [];
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const spawn = () => {
      // pick a random node and one of its current neighbours
      for (let tries = 0; tries < 6; tries++) {
        const a = Math.floor(Math.random() * nodes.length);
        const na = nodes[a];
        let best = -1, bestD = LINK;
        for (let j = 0; j < nodes.length; j++) {
          if (j === a) continue;
          const d = Math.hypot(na.x - nodes[j].x, na.y - nodes[j].y);
          if (d < bestD && Math.random() > 0.35) { best = j; bestD = d; }
        }
        if (best >= 0) {
          packets.push({ a, b: best, t: 0, speed: 0.006 + Math.random() * 0.008, hue: Math.random() > 0.8 ? "brass" : "accent" });
          return;
        }
      }
    };

    const draw = (now: number) => {
      const dark = themeRef.current === "dark";
      ctx.clearRect(0, 0, w, h);

      const nodeColor = dark ? "52,224,161" : "10,122,82";
      const linkColor = dark ? "255,255,255" : "10,20,32";
      const hotColor = dark ? "108,182,255" : "26,98,196";
      const brassColor = dark ? "226,179,94" : "147,101,13";

      // relationship lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const d = Math.sqrt(d2);
          ctx.strokeStyle = `rgba(${linkColor},${(1 - d / LINK) * (dark ? 0.13 : 0.11)})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // packets
      if (!reduced) {
        if (now - lastSpawn > 420 && packets.length < 14) { spawn(); lastSpawn = now; }
        packets = packets.filter((p) => {
          p.t += p.speed;
          const a = nodes[p.a], b = nodes[p.b];
          if (!a || !b || p.t >= 1 || Math.hypot(a.x - b.x, a.y - b.y) > LINK * 1.15) return false;
          const x = a.x + (b.x - a.x) * p.t;
          const y = a.y + (b.y - a.y) * p.t;
          const c = p.hue === "brass" ? brassColor : nodeColor;
          const fade = Math.sin(p.t * Math.PI);
          ctx.beginPath();
          ctx.arc(x, y, 1.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c},${0.85 * fade})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c},${0.1 * fade})`;
          ctx.fill();
          return true;
        });
      }

      // nodes
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx; n.y += n.vy; n.pulse += 0.016;
          if (n.x < -20) n.x = w + 20; if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20; if (n.y > h + 20) n.y = -20;

          if (pointer.current.active) {
            const dx = n.x - pointer.current.x;
            const dy = n.y - pointer.current.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 24000 && d2 > 1) {
              const d = Math.sqrt(d2);
              const force = (1 - d / 155) * 0.85;
              n.x += (dx / d) * force;
              n.y += (dy / d) * force;
            }
          }
        }

        const near = pointer.current.active &&
          Math.hypot(n.x - pointer.current.x, n.y - pointer.current.y) < 165;
        const breathe = 0.55 + Math.sin(n.pulse) * 0.28;
        const c = near ? hotColor : nodeColor;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (near ? 1.9 : 1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},${(near ? 0.9 : 0.42) * breathe + 0.14})`;
        ctx.fill();

        if (near) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 5.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c},0.07)`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      pointer.current.active = true;
    };
    const onLeave = () => { pointer.current.active = false; };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div className="grid-bg grid-fade absolute inset-0" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-x-0 bottom-0 h-64" style={{ background: "linear-gradient(to top, var(--bg), transparent)" }} />
    </div>
  );
}
