import { AnimatePresence } from "framer-motion";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Background from "./components/Background";
import Boot from "./components/Boot";
import CommandPalette from "./components/CommandPalette";
import Cursor from "./components/Cursor";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import ScrollProgress from "./components/ScrollProgress";
import SkillDrawer from "./components/SkillDrawer";

import { AppContext } from "./lib/app-context";
import { useHotkey, useTheme } from "./lib/hooks";

import About from "./routes/About";
import Contact from "./routes/Contact";
import Experience from "./routes/Experience";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Projects from "./routes/Projects";
import Skills from "./routes/Skills";

const Impact = lazy(() => import("./routes/Impact"));

function RouteFallback() {
  return (
    <div className="shell-wide flex min-h-[70vh] items-center justify-center">
      <div className="flex items-end gap-1.5" aria-label="Loading report">
        {[16, 30, 22, 40].map((h, i) => (
          <span key={i} className="w-2 rounded-t-[3px]"
            style={{
              height: h, background: i % 2 ? "var(--brass)" : "var(--accent)",
              animation: `floatY 1.1s ${i * 0.1}s ease-in-out infinite`, opacity: 0.8,
            }} />
        ))}
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 420);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || (t instanceof HTMLElement && t.isContentEditable);

export default function App() {
  const { theme, toggle } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [skillId, setSkillId] = useState<string | null>(null);
  const [booted, setBooted] = useState(false);
  const location = useLocation();

  useHotkey(
    useCallback((e: KeyboardEvent) => (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k", []),
    useCallback(() => setPaletteOpen((o) => !o), [])
  );
  useHotkey(
    useCallback((e: KeyboardEvent) => e.key === "/" && !isTyping(e.target), []),
    useCallback(() => setPaletteOpen(true), [])
  );

  const openSkill = useCallback((id: string) => setSkillId(id), []);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const onBooted = useCallback(() => setBooted(true), []);

  return (
    <AppContext.Provider value={{ openSkill, openPalette, theme }}>
      <div className="noise relative min-h-dvh">
        <Boot onDone={onBooted} />
        <Background theme={theme} />
        <Cursor />
        <ScrollProgress />
        <Nav theme={theme} toggleTheme={toggle} openPalette={openPalette} />
        <ScrollToTop />

        <div style={{ opacity: booted ? 1 : 0, transition: "opacity .6s ease" }}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/impact" element={<Suspense fallback={<RouteFallback />}><Impact /></Suspense>} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <Footer />
        </div>

        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          onToggleTheme={toggle}
          theme={theme}
          onOpenSkill={openSkill}
        />
        <SkillDrawer skillId={skillId} onClose={() => setSkillId(null)} onSelect={setSkillId} />
      </div>
    </AppContext.Provider>
  );
}
