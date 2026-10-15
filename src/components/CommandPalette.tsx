import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Copy, CornerDownLeft, Mail, Moon, Phone, Search, Sun, Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobs, profile, projects, skills, skillCategories } from "../data/profile";
import { ROUTES } from "../lib/routes";
import { useCopy, useLockScroll } from "../lib/hooks";
import { Kbd } from "./ui";

type Item = {
  id: string; label: string; hint: string; group: string;
  /** extra terms matched by search but not displayed */
  terms?: string;
  run: () => void; icon?: React.ReactNode;
};

export default function CommandPalette({
  open, onClose, onToggleTheme, theme, onOpenSkill,
}: {
  open: boolean; onClose: () => void; onToggleTheme: () => void;
  theme: "dark" | "light"; onOpenSkill: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const nav = useNavigate();
  const { copy, copied } = useCopy();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useLockScroll(open);

  const items: Item[] = useMemo(() => {
    const pages: Item[] = ROUTES.map((r) => ({
      id: `page-${r.path}`, label: r.label, hint: r.blurb, group: "Pages",
      run: () => nav(r.path), icon: <ArrowRight size={13} />,
    }));

    const skillItems: Item[] = skills.map((s) => ({
      id: `skill-${s.id}`,
      label: s.name,
      hint: skillCategories.find((c) => c.id === s.category)?.name ?? "Skill",
      group: "Skills",
      terms: [s.id, ...s.tags, s.blurb.slice(0, 140)].join(" "),
      run: () => { nav("/skills"); setTimeout(() => onOpenSkill(s.id), 380); },
      icon: <Sparkles size={13} />,
    }));

    const jobItems: Item[] = jobs.map((j) => ({
      id: `job-${j.id}`, label: j.company, hint: `${j.role} · ${j.period}`, group: "Experience",
      terms: [j.project ?? "", j.headline, ...j.environment, ...j.areas].join(" "),
      run: () => nav(`/experience#${j.id}`), icon: <ArrowRight size={13} />,
    }));

    const projectItems: Item[] = projects.map((p) => ({
      id: `proj-${p.id}`, label: p.name, hint: p.kind, group: "Projects",
      terms: [...p.environment, ...p.bullets].join(" "),
      run: () => nav(`/projects#${p.id}`), icon: <ArrowRight size={13} />,
    }));

    const actions: Item[] = [
      { id: "a-email", label: "Copy email address", hint: profile.email, group: "Actions",
        run: () => copy(profile.email, "email"), icon: <Copy size={13} /> },
      { id: "a-mailto", label: "Send an email", hint: profile.email, group: "Actions",
        run: () => { window.location.href = `mailto:${profile.email}`; }, icon: <Mail size={13} /> },
      { id: "a-phone", label: "Call", hint: profile.phone, group: "Actions",
        run: () => { window.location.href = profile.phoneHref; }, icon: <Phone size={13} /> },
      { id: "a-theme", label: `Switch to ${theme === "dark" ? "light" : "dark"} theme`, hint: "Appearance", group: "Actions",
        run: onToggleTheme, icon: theme === "dark" ? <Sun size={13} /> : <Moon size={13} /> },
    ];

    return [...pages, ...actions, ...projectItems, ...jobItems, ...skillItems];
  }, [nav, copy, theme, onToggleTheme, onOpenSkill]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items.slice(0, 12);
    return items
      .map((it) => {
        const l = it.label.toLowerCase();
        const h = it.hint.toLowerCase();
        const t = (it.terms ?? "").toLowerCase();
        // initials of a multi-word label, so "rls" finds "Row-Level Security"
        const initials = it.label.split(/[\s/&·-]+/).filter(Boolean).map((w) => w[0]).join("").toLowerCase();
        let score = -1;
        if (l.startsWith(needle)) score = 100;
        else if (initials === needle) score = 92;
        else if (l.includes(needle)) score = 70;
        else if (initials.startsWith(needle) && needle.length > 1) score = 58;
        else if (h.includes(needle)) score = 40;
        else if (t.includes(needle)) score = 26;
        return { it, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 22)
      .map((x) => x.it);
  }, [q, items]);

  useEffect(() => { setSel(0); }, [q, open]);
  useEffect(() => {
    if (open) { setQ(""); setTimeout(() => inputRef.current?.focus(), 60); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(filtered.length - 1, s + 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
      if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[sel];
        if (item) { item.run(); if (!item.id.startsWith("a-email")) onClose(); }
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [open, filtered, sel, onClose]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${sel}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0" style={{ background: "rgba(2,6,10,.62)", backdropFilter: "blur(6px)" }} />
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 22, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="dialog" aria-modal="true" aria-label="Command palette"
            className="relative w-full max-w-[600px] overflow-hidden rounded-2xl"
            style={{ background: "var(--panel-solid)", border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-lg)" }}
          >
            <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: "1px solid var(--border)" }}>
              <Search size={15} style={{ color: "var(--text-faint)" }} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search skills, roles, projects or actions…" aria-label="Search"
                className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[color:var(--text-faint)]"
              />
              <Kbd>ESC</Kbd>
            </div>

            <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-8 text-center text-[13px] text-muted">
                  Nothing matched “{q}”. Try “OFAC”, “PVM”, “reconciliation” or “JPMorgan”.
                </p>
              )}
              {filtered.map((it, i) => {
                const showGroup = it.group !== lastGroup;
                lastGroup = it.group;
                const active = i === sel;
                return (
                  <div key={it.id}>
                    {showGroup && (
                      <div className="px-3 pt-3 pb-1.5 text-[12px] font-medium text-faint">
                        {it.group}
                      </div>
                    )}
                    <button
                      data-idx={i}
                      onMouseEnter={() => setSel(i)}
                      onClick={() => { it.run(); if (!it.id.startsWith("a-email")) onClose(); }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                      style={{ background: active ? "color-mix(in oklab, var(--accent) 12%, transparent)" : "transparent" }}
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                        style={{ background: "var(--panel-raised)", color: active ? "var(--accent)" : "var(--text-faint)" }}>
                        {it.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-medium">{it.label}</span>
                        <span className="block truncate text-[11.5px] text-faint">{it.hint}</span>
                      </span>
                      {copied === "email" && it.id === "a-email"
                        ? <span className="text-[12px] font-medium" style={{ color: "var(--accent)" }}>Copied</span>
                        : active && <CornerDownLeft size={13} style={{ color: "var(--text-faint)" }} />}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 text-[12px] text-faint"
              style={{ borderTop: "1px solid var(--border)" }}>
              <span className="flex items-center gap-2"><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
              <span className="flex items-center gap-2"><Kbd>↵</Kbd> open</span>
              <span className="hidden sm:block">{skills.length} skills indexed</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
