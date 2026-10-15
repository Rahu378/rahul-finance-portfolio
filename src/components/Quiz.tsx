import { AnimatePresence, motion } from "framer-motion";
import { Check, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { EASE } from "./ui";

const QUESTIONS = [
  {
    q: "A US equity trade executes on Tuesday. When does it settle?",
    options: ["Same day (T+0)", "Wednesday (T+1)", "Thursday (T+2)", "Friday (T+3)"],
    answer: 1,
    why: "US equities moved from T+2 to T+1 on 28 May 2024. The practical effect is that allocation, confirmation and any break investigation now have one business day, which is why matching has to run on trade date rather than the morning after.",
  },
  {
    q: "Custody holds 10,500 shares, the books show 10,000, and no trade explains it. First thing to check?",
    options: [
      "Re-run yesterday's trade file",
      "A corporate action, such as a stock dividend, not yet booked",
      "Write off the difference as immaterial",
      "Ask the custodian to correct their record",
    ],
    answer: 1,
    why: "Positions that change without a trade usually changed because of an event. A 5% stock dividend turns 10,000 shares into 10,500 at the custodian on pay date; if the event hasn't been processed internally, the books lag. Check the corporate action calendar before assuming anyone made an error.",
  },
  {
    q: "A customer makes four cash deposits of $9,500 at three branches over two days. What is this pattern called?",
    options: ["Layering", "Trade-based laundering", "Structuring", "Round-tripping"],
    answer: 2,
    why: "Breaking cash into amounts under the $10,000 Currency Transaction Report threshold to avoid reporting is structuring, and it is itself a federal offence regardless of where the money came from. Monitoring has to aggregate across branches and days, not test each deposit alone.",
  },
];

export default function Quiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[i];

  const choose = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (i === QUESTIONS.length - 1) { setDone(true); return; }
    setI((n) => n + 1);
    setPicked(null);
  };

  const reset = () => { setI(0); setPicked(null); setScore(0); setDone(false); };

  return (
    <div className="card overflow-hidden" style={{ background: "var(--panel-solid)" }}>
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <p className="text-[14px] font-semibold">Three questions from the operations floor</p>
          <p className="mt-0.5 text-[12.5px] text-faint">
            {done ? "Complete" : `Question ${i + 1} of ${QUESTIONS.length}`}
          </p>
        </div>
        <div className="flex gap-1" aria-hidden>
          {QUESTIONS.map((_, n) => (
            <span key={n} className="h-1.5 w-6 rounded-full transition-colors duration-500"
              style={{ background: n <= i || done ? "var(--accent)" : "color-mix(in oklab, var(--text) 12%, transparent)" }} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="px-6 py-10 text-center">
            <p className="num text-[clamp(2.8rem,6vw,3.8rem)] leading-none font-semibold tracking-tight" style={{ color: "var(--accent)" }}>
              {score}/{QUESTIONS.length}
            </p>
            <p className="mt-4 text-[15px] font-semibold">
              {score === 3 ? "You've worked a break queue before." : score === 2 ? "Solid instincts." : "Worth a conversation."}
            </p>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-muted">
              These are the questions that separate someone who can build a report from someone who knows why the
              number in it might be wrong.
            </p>
            <button onClick={reset} className="btn-ghost mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium">
              <RotateCcw size={13} /> Run it again
            </button>
          </motion.div>
        ) : (
          <motion.div key={i}
            initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="px-6 py-6">
            <p className="text-[17px] leading-snug font-semibold tracking-tight">{q.q}</p>

            <div className="mt-5 grid gap-2" role="radiogroup" aria-label="Answers">
              {q.options.map((o, idx) => {
                const isAnswer = idx === q.answer;
                const isPicked = picked === idx;
                const reveal = picked !== null;
                const tone = reveal && isAnswer ? "var(--accent)" : reveal && isPicked ? "var(--rose)" : "var(--border)";
                return (
                  <motion.button key={idx} onClick={() => choose(idx)} disabled={reveal}
                    role="radio" aria-checked={isPicked}
                    whileTap={reveal ? undefined : { scale: 0.985 }}
                    animate={reveal && isPicked && !isAnswer ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                    data-cursor={reveal ? undefined : "Pick"}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[14px] transition-[background,border-color,opacity] duration-300"
                    style={{
                      border: `1px solid ${reveal && (isAnswer || isPicked) ? `color-mix(in oklab, ${tone} 55%, transparent)` : "var(--border)"}`,
                      background: reveal && isAnswer
                        ? "color-mix(in oklab, var(--accent) 10%, transparent)"
                        : reveal && isPicked
                        ? "color-mix(in oklab, var(--rose) 10%, transparent)"
                        : "var(--panel-raised)",
                      opacity: reveal && !isAnswer && !isPicked ? 0.5 : 1,
                      cursor: reveal ? "default" : "pointer",
                    }}>
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold"
                      style={{ border: `1px solid ${reveal && (isAnswer || isPicked) ? tone : "var(--border-strong)"}`, color: reveal && (isAnswer || isPicked) ? tone : "var(--text-faint)" }}>
                      {reveal && isAnswer ? <Check size={12} /> : reveal && isPicked ? <X size={12} /> : String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{o}</span>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {picked !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="overflow-hidden">
                  <div className="mt-5 rounded-xl p-4" style={{ background: "color-mix(in oklab, var(--accent) 8%, var(--panel-solid))" }}>
                    <p className="text-[13px] font-semibold" style={{ color: "var(--accent)" }}>Why</p>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{q.why}</p>
                  </div>
                  <button onClick={next} className="btn-primary mt-4 w-full rounded-full py-3 text-[14px] font-semibold">
                    {i === QUESTIONS.length - 1 ? "See result" : "Next question"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
