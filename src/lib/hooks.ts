import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ THEME */
export type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    try {
      const saved = localStorage.getItem("rr-fin-theme") as Theme | null;
      if (saved === "dark" || saved === "light") return saved;
    } catch { /* ignore */ }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    try { localStorage.setItem("rr-fin-theme", theme); } catch { /* ignore */ }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  return { theme, setTheme, toggle };
}

/* ------------------------------------------------------- SCROLL REVEAL OBS */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.16) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ------------------------------------------------------------- COUNT UP */
export function useCountUp(target: number, run: boolean, duration = 1700) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setValue(target); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return value;
}

/* ----------------------------------------------------- POINTER SHEEN CARD */
export function useSheen<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);
  return { ref, onMove };
}

/* ------------------------------------------------------------ MEDIA QUERY */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

/* ------------------------------------------------------------ LOCK SCROLL */
export function useLockScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [locked]);
}

/* --------------------------------------------------------- KEYBOARD HOTKEY */
export function useHotkey(combo: (e: KeyboardEvent) => boolean, handler: () => void) {
  useEffect(() => {
    const on = (e: KeyboardEvent) => { if (combo(e)) { e.preventDefault(); handler(); } };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [combo, handler]);
}

/* ---------------------------------------------------------- COPY TO CLIP */
export function useCopy(resetMs = 1800) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback((text: string, id?: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id ?? text);
      setTimeout(() => setCopied(null), resetMs);
    }).catch(() => { /* ignore */ });
  }, [resetMs]);
  return { copied, copy };
}
