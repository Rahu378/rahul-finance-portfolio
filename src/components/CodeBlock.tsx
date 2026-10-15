import { Check, Copy } from "lucide-react";
import { useMemo } from "react";
import { useCopy } from "../lib/hooks";

const KEYWORDS: Record<string, string[]> = {
  sql: ["WITH", "AS", "SELECT", "FROM", "WHERE", "ORDER", "BY", "PARTITION", "OVER", "GROUP", "WINDOW",
        "HAVING", "JOIN", "FULL", "OUTER", "LEFT", "INNER", "ON", "AND", "OR", "NOT", "DESC", "ASC",
        "COALESCE", "SUM", "AVG", "STDDEV", "ABS", "NULLIF", "ROWS", "BETWEEN", "PRECEDING"],
  python: ["import", "from", "def", "return", "if", "else", "elif", "for", "in", "and", "or", "not",
           "True", "False", "None", "assert", "lambda", "with", "as"],
  excel: ["LET", "XLOOKUP", "IF", "OR", "AND", "ABS", "TEXT", "SUMIFS", "IFERROR", "FILTER"],
  model: [],
};

const COMMENT: Record<string, string | null> = { sql: "--", python: "#", excel: null, model: null };

const LANG_LABEL: Record<string, string> = {
  sql: "SQL", python: "Python", excel: "Excel · LET + XLOOKUP", model: "Model",
};

type Tok = { t: string; c: string };

function tokenize(code: string, lang: string): Tok[][] {
  const kw = KEYWORDS[lang] ?? [];
  const marker = COMMENT[lang] ?? null;
  return code.split("\n").map((line) => {
    if (lang === "model") return [{ t: line, c: /^[A-Z][a-z]/.test(line) && line.includes("=") ? "id" : "txt" }];

    const commentIdx = marker ? line.indexOf(marker) : -1;
    if (commentIdx !== -1 && line.slice(0, commentIdx).trim() === "") return [{ t: line, c: "cmt" }];

    const body = commentIdx > 0 ? line.slice(0, commentIdx) : line;
    const tail = commentIdx > 0 ? line.slice(commentIdx) : "";

    const out: Tok[] = [];
    const re = /(f?"[^"]*"|'[^']*'|\b\d[\d_]*(?:\.\d+)?\b|[A-Za-z_][A-Za-z0-9_]*|\s+|.)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(body))) {
      const tk = m[0];
      let c = "txt";
      if (/^f?["']/.test(tk)) c = "str";
      else if (/^\d/.test(tk)) c = "num";
      else if (kw.some((k) => (lang === "python" ? k === tk : k.toLowerCase() === tk.toLowerCase()))) c = "kw";
      else if (/^[A-Za-z_]/.test(tk) && body.slice(m.index + tk.length).startsWith("(")) c = "fn";
      else if (/^[=<>+\-*/(),.:@|&\[\]{}]/.test(tk)) c = "op";
      out.push({ t: tk, c });
    }
    if (tail) out.push({ t: tail, c: "cmt" });
    return out;
  });
}

const COLOR: Record<string, string> = {
  kw: "var(--accent)",
  str: "var(--brass)",
  num: "var(--sky)",
  fn: "var(--text)",
  id: "var(--text)",
  op: "var(--text-faint)",
  cmt: "var(--text-faint)",
  txt: "var(--text-muted)",
};

export default function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const lines = useMemo(() => tokenize(code, lang), [code, lang]);
  const { copy, copied } = useCopy();

  return (
    <div className="overflow-hidden rounded-xl" style={{ border: "1px solid var(--border)", background: "var(--bg)" }}>
      <div className="flex items-center justify-between px-3.5 py-2" style={{ borderBottom: "1px solid var(--border)", background: "var(--panel-raised)" }}>
        <span className="text-[12px] font-medium text-muted">{LANG_LABEL[lang] ?? lang}</span>
        <button onClick={() => copy(code, "c")} aria-label="Copy code"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] transition-colors hover:text-[color:var(--text)]"
          style={{ color: copied === "c" ? "var(--accent)" : "var(--text-faint)" }}>
          {copied === "c" ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-[1.72]">
        <code>
          {lines.map((toks, i) => (
            <div key={i} className="flex">
              <span className="mr-4 w-5 shrink-0 text-right select-none" style={{ color: "color-mix(in oklab, var(--text) 22%, transparent)" }}>
                {i + 1}
              </span>
              <span className="whitespace-pre">
                {toks.map((t, j) => (
                  <span key={j} style={{ color: COLOR[t.c], fontStyle: t.c === "cmt" ? "italic" : undefined }}>{t.t}</span>
                ))}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
