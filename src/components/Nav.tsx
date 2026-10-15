import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Command, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { profile } from "../data/profile";
import { useLockScroll } from "../lib/hooks";
import { ROUTES } from "../lib/routes";
import { EASE, Kbd } from "./ui";

export function Monogram({ size = 36 }: { size?: number }) {
  return (
    <span className="relative grid shrink-0 place-items-center overflow-hidden rounded-[11px]"
      style={{ width: size, height: size, background: "var(--panel-raised)", border: "1px solid var(--border-strong)" }}>
      <svg viewBox="0 0 24 24" style={{ width: size * 0.56, height: size * 0.56 }} fill="none">
        <rect x="3" y="4.5" width="10" height="2.4" rx="1.2" fill="var(--text)" opacity=".9" />
        <rect x="3" y="10.3" width="7" height="2.4" rx="1.2" fill="var(--text)" opacity=".55" />
        <rect x="3" y="16.1" width="4.5" height="2.4" rx="1.2" fill="var(--text)" opacity=".3" />
        <path d="M12.5 16.4l2.6 2.6 5.4-6.6" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function Nav({
  theme, toggleTheme, openPalette,
}: { theme: "dark" | "light"; toggleTheme: () => void; openPalette: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useLockScroll(open);
  useEffect(() => { setOpen(false); }, [loc.pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className="transition-[background,border-color] duration-500"
          style={{
            background: scrolled ? "color-mix(in oklab, var(--bg) 88%, transparent)" : "transparent",
            backdropFilter: scrolled ? "blur(18px) saturate(150%)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(18px) saturate(150%)" : "none",
            borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
          }}
        >
          <div className="shell-wide flex h-[68px] items-center justify-between gap-4">
            <Link to="/" className="group flex items-center gap-3" data-cursor="Home" aria-label="Rahul Reddy CH, home">
              <Monogram />
              <span className="hidden leading-tight whitespace-nowrap sm:block">
                <span className="block text-[14px] font-semibold tracking-tight">{profile.name}</span>
                <span className="block text-[11.5px] text-faint">{profile.role}</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
              {ROUTES.map((r) => (
                <NavLink key={r.path} to={r.path} end={r.path === "/"} data-cursor={r.label}>
                  {({ isActive }) => (
                    <span className="relative isolate block px-3.5 py-2 text-[13.5px] font-medium transition-colors duration-300 hover:text-[color:var(--text)]"
                      style={{ color: isActive ? "var(--text)" : "var(--text-muted)" }}>
                      {r.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full"
                          style={{ background: "var(--panel-raised)", border: "1px solid var(--border)" }}
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={openPalette}
                data-cursor="Search"
                className="hidden items-center gap-2 rounded-full py-1.5 pr-1.5 pl-3 text-[12.5px] whitespace-nowrap transition-colors hover:text-[color:var(--text)] xl:flex"
                style={{ border: "1px solid var(--border)", background: "var(--panel)", color: "var(--text-muted)" }}
                aria-label="Open command palette"
              >
                <Command size={12.5} />
                <span>Jump to</span>
                <Kbd>⌘K</Kbd>
              </button>

              <button
                onClick={toggleTheme}
                data-cursor={theme === "dark" ? "Light" : "Dark"}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                className="grid h-9 w-9 place-items-center rounded-full transition-colors"
                style={{ border: "1px solid var(--border)", background: "var(--panel)" }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ rotate: -80, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 80, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.28 }}
                    className="grid place-items-center"
                  >
                    {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                  </motion.span>
                </AnimatePresence>
              </button>

              <Link
                to="/contact"
                data-cursor="Let's talk"
                className="btn-primary shine hidden items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold whitespace-nowrap sm:inline-flex"
              >
                Get in touch <ArrowUpRight size={13} />
              </Link>

              <button
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="grid h-9 w-9 place-items-center rounded-full xl:hidden"
                style={{ border: "1px solid var(--border)", background: "var(--panel)" }}
              >
                <Menu size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] overflow-y-auto xl:hidden"
            style={{ background: "var(--bg)" }}
            role="dialog" aria-modal="true" aria-label="Navigation"
          >
            <div className="shell flex h-[68px] items-center justify-between">
              <Monogram />
              <button onClick={() => setOpen(false)} aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-full"
                style={{ border: "1px solid var(--border)" }}>
                <X size={16} />
              </button>
            </div>
            <nav className="shell mt-4 flex flex-col" aria-label="Mobile">
              {ROUTES.map((r, i) => (
                <motion.div key={r.path}
                  initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: EASE }}>
                  <NavLink to={r.path} end={r.path === "/"}
                    className="flex items-center gap-4 border-b py-4"
                    style={{ borderColor: "var(--border)" }}>
                    {({ isActive }) => (
                      <>
                        <span className="flex-1">
                          <span className="block text-[26px] font-semibold tracking-tight"
                            style={{ color: isActive ? "var(--accent)" : "var(--text)" }}>{r.label}</span>
                          <span className="mt-0.5 block text-[13px] text-muted">{r.blurb}</span>
                        </span>
                        <ArrowUpRight size={18} style={{ color: "var(--text-faint)" }} />
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="shell mt-8 flex gap-3 pb-10">
              <a href={`mailto:${profile.email}`} className="btn-primary flex-1 rounded-full px-4 py-3 text-center text-[14px] font-semibold">Email me</a>
              <a href={profile.phoneHref} className="btn-ghost flex-1 rounded-full px-4 py-3 text-center text-[14px] font-semibold">Call</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
