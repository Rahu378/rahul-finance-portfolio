export const profile = {
  name: "Rahul Reddy CH",
  firstName: "Rahul",
  role: "Financial Analyst",
  focus: "FP&A & Business Analysis · Financial Systems & Compliance Automation",
  tagline:
    "I find where cash, positions and the books disagree, then automate the checks so the breaks surface before close instead of after it.",
  location: "United States",
  phone: "(856) 526-9115",
  phoneHref: "tel:+18565269115",
  email: "rahul.r24.c@gmail.com",
  github: "https://github.com/Rahu378",
  current: "Analyst, Financial Systems & Trade Operations at NextGen IT Solutions",
  summary:
    "Financial Analyst with a B.S. in Computer Science and hands-on experience across trade settlement, payment processing, compliance automation and financial data analysis. Working knowledge of the trade lifecycle, reconciliations, IBOR, securities processing and insurance and retirement products, with direct exposure to JPMorgan Chase payment processing and trade settlement systems. I support reconciliation of cash vs. position and custody vs. accounting breaks with operations and compliance, and analyze large financial datasets in SQL, Python, Excel, Tableau and Power BI to automate reconciliations and reporting.",
  summary2:
    "On the business analysis side: requirements gathering, process mapping, UAT, stakeholder communication and Agile execution with operations, compliance and engineering teams. On the planning side: AWS Certified Developer and AI/ML practitioner with hands-on FP&A modeling, driver-based planning, variance analysis and generative AI for forecasting, bringing automation and risk controls to retirement, insurance and asset management services.",
} as const;

/* ----------------------------------------------------------------- METRICS */
export type Accent = "accent" | "sky" | "brass" | "ink";
export const accentVar: Record<Accent, string> = {
  accent: "var(--accent)", sky: "var(--sky)", brass: "var(--brass)", ink: "var(--text)",
};

export type Metric = {
  id: string;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  label: string;
  source: string;
  detail: string;
  accent: Accent;
};

export const metrics: Metric[] = [
  {
    id: "recon", value: 35, suffix: "%", label: "Less manual reconciliation effort",
    source: "Appworks · financial data pipelines",
    detail:
      "Built pipelines that process financial transaction data, improving data accuracy and cutting the manual reconciliation effort by 35%. Analyst time moved from matching rows to working the exceptions.",
    accent: "accent",
  },
  {
    id: "precision", value: 94, suffix: "%", label: "Precision on suspicious transactions",
    source: "FinSight Agent · AML/OFAC automation",
    detail:
      "An AML/OFAC compliance agent that detects BSA structuring patterns and writes audit-ready reports for fintech compliance officers, using multi-step LLM reasoning and tool-calling workflows.",
    accent: "sky",
  },
  {
    id: "coverage", value: 99.2, decimals: 1, suffix: "%", label: "Test coverage before production",
    source: "Jaspay Technologies · payments",
    detail:
      "Unit and integration tests on the transaction modules of RESTful payment integrations, reaching 99.2% coverage before anything handling sensitive financial data went to production.",
    accent: "brass",
  },
  {
    id: "turnaround", value: 5, prefix: "<", suffix: " min", label: "From process text to swimlane",
    source: "Text2Workflow · business process automation",
    detail:
      "A natural-language workflow engine that turns plain-text process descriptions into validated, exportable swimlane blueprints for business analysts. Design turnaround went from hours to under five minutes.",
    accent: "ink",
  },
];

/* ------------------------------------------------------------------ SKILLS */
export type Basis = "Production" | "Project" | "Certified" | "Working knowledge";

export type Skill = {
  id: string;
  name: string;
  category: SkillCategoryId;
  level: number;
  basis: Basis;
  blurb: string;
  proof: string;
  tags: string[];
  link?: string;
  demo?: { to: string; label: string };
  snippet?: { lang: string; code: string };
};

export type SkillCategoryId =
  | "recon" | "ops" | "ibor" | "compliance" | "fpa" | "insurance" | "ba" | "data" | "ai";

export const skillCategories: {
  id: SkillCategoryId; name: string; short: string; desc: string; accent: string; icon: string;
}[] = [
  { id: "recon",      name: "Reconciliations",          short: "Recon",      desc: "Cash against position, custody against accounting, and the discipline of closing every break.", accent: "var(--accent)", icon: "Scale" },
  { id: "ops",        name: "Trade & Payments Ops",     short: "Trade ops",  desc: "Execution to settlement, and the payment flows that move the cash.", accent: "var(--sky)", icon: "ArrowLeftRight" },
  { id: "ibor",       name: "IBOR & Securities",        short: "IBOR",       desc: "The book of record, the reference data behind it, and the events that change positions without a trade.", accent: "var(--brass)", icon: "BookOpen" },
  { id: "compliance", name: "Regulatory & Compliance",  short: "Compliance", desc: "BSA/AML, OFAC and SOX: the controls a regulator or auditor will ask you to prove.", accent: "var(--rose)", icon: "ShieldCheck" },
  { id: "fpa",        name: "FP&A & Modeling",          short: "FP&A",       desc: "Driver-based plans, variance that explains itself, and scenarios that survive a stress test.", accent: "var(--accent)", icon: "TrendingUp" },
  { id: "insurance",  name: "Insurance & Retirement",   short: "Insurance",  desc: "Annuities, premiums, claims and plan reporting.", accent: "var(--brass)", icon: "Umbrella" },
  { id: "ba",         name: "Business Analysis",        short: "BA",         desc: "Requirements, process maps, acceptance criteria and UAT: the work that decides whether a build is right.", accent: "var(--sky)", icon: "Workflow" },
  { id: "data",       name: "Data, SQL & BI",           short: "Data & BI",  desc: "Where the evidence for every number gets queried, validated and shown.", accent: "var(--accent)", icon: "Database" },
  { id: "ai",         name: "Cloud, AI & Automation",   short: "AI & cloud", desc: "AWS, LLM agents and the engineering habits that keep automation trustworthy.", accent: "var(--sky)", icon: "Cpu" },
];

export const skills: Skill[] = [
  /* ------------------------------------------------------- Reconciliations */
  { id: "cash-position", name: "Cash vs. Position Reconciliation", category: "recon", level: 88, basis: "Production",
    blurb: "Matching what moved in cash against what the position book says should have moved. Most breaks are timing, a booking error or a missed corporate action, and each cause has a different fix.",
    proof: "Reconciliation support for cash vs. position breaks on JPMorgan Chase payment processing and trade settlement systems, working the exceptions through with operations and compliance.",
    tags: ["Cash", "Positions", "Breaks"],
    snippet: { lang: "sql", code: `-- every account/security where cash and positions disagree
WITH cash AS (
    SELECT account_id, security_id, SUM(settled_qty) AS cash_qty
    FROM   settlement_cash
    WHERE  value_date = :as_of
    GROUP  BY account_id, security_id
),
pos AS (
    SELECT account_id, security_id, SUM(position_qty) AS pos_qty
    FROM   ibor_positions
    WHERE  as_of_date = :as_of
    GROUP  BY account_id, security_id
)
SELECT COALESCE(c.account_id, p.account_id)   AS account_id,
       COALESCE(c.security_id, p.security_id) AS security_id,
       COALESCE(c.cash_qty, 0) - COALESCE(p.pos_qty, 0) AS break_qty
FROM   cash c
FULL OUTER JOIN pos p
       ON  p.account_id  = c.account_id
       AND p.security_id = c.security_id
WHERE  ABS(COALESCE(c.cash_qty, 0) - COALESCE(p.pos_qty, 0)) > 0.0001;

-- FULL OUTER JOIN keeps one-sided breaks too` } },
  { id: "custody-accounting", name: "Custody vs. Accounting", category: "recon", level: 84, basis: "Production",
    blurb: "The custodian's record of what is held, against the accounting book of record. When the two disagree, one of them is about to be wrong in a report somebody signs.",
    proof: "Data analysis and reconciliation support on custody vs. accounting breaks at NextGen, partnering with operations and compliance to resolve exceptions.",
    tags: ["Custody", "Accounting", "Exceptions"] },
  { id: "break-resolution", name: "Break Resolution", category: "recon", level: 87, basis: "Production",
    blurb: "Classify the break by cause, attach the evidence, route it to whoever can fix it, then confirm it actually clears. An ageing break is a control failure, not a backlog item.",
    proof: "Exception resolution with operations and compliance on the JPMorgan Chase engagement, and root cause analysis on data discrepancies at Appworks.",
    tags: ["Root cause", "Ageing", "Routing"],
    snippet: { lang: "python", code: `import pandas as pd

breaks = recon[recon["break_qty"].abs() > TOLERANCE].copy()

def classify(row):
    if row["corp_action_flag"]:
        return "Corporate action"
    if pd.isna(row["settle_date"]) and row["trade_date"] < row["as_of"]:
        return "Late or failed settlement"
    if abs(row["price_diff"]) > 0:
        return "Pricing"
    return "Booking error"

breaks["cause"] = breaks.apply(classify, axis=1)
breaks["age_days"] = (as_of - breaks["first_seen"]).dt.days

# oldest and largest first, each routed by cause
queue = breaks.sort_values(["age_days", "break_value"], ascending=False)` } },
  { id: "recon-automation", name: "Reconciliation Automation", category: "recon", level: 89, basis: "Production",
    blurb: "Replacing the weekly copy-and-match with a pipeline that loads, validates and matches on schedule, so analyst time goes to the exceptions rather than to the rows that already agree.",
    proof: "Financial data pipelines at Appworks that improved data accuracy and reduced manual reconciliation effort by 35%.",
    tags: ["Pipelines", "Scheduling", "35% less effort"] },
  { id: "root-cause", name: "Root Cause Analysis", category: "recon", level: 85, basis: "Production",
    blurb: "Tracing a discrepancy back through every join and transformation until the first place it went wrong, then fixing it there instead of patching the report.",
    proof: "Root cause analysis on data discrepancies at Appworks, with corrective actions implemented alongside the technical teams.",
    tags: ["Lineage", "Corrective action"] },

  /* ------------------------------------------------------------ Trade ops */
  { id: "trade-lifecycle", name: "Trade Lifecycle", category: "ops", level: 84, basis: "Production",
    blurb: "Execution, capture, allocation, confirmation, clearing, settlement and reconciliation. Knowing which stage a break was born in is most of the work of fixing it.",
    proof: "Supporting accurate transaction capture, allocation and settlement across high-volume workflows on JPMorgan Chase systems.",
    tags: ["Capture", "Allocation", "Clearing"],
    snippet: { lang: "model", code: `Execution ─► Capture ─► Allocation ─► Confirmation
                                           │
Reconciliation ◄── Settlement ◄── Clearing ◄┘

T     executed, captured, allocated, confirmed
T+1   cleared and settled (US equities since May 2024)
T+1   cash, position and custody reconciled

A break found at reconciliation was usually born earlier.` } },
  { id: "trade-settlement", name: "Trade Settlement", category: "ops", level: 85, basis: "Production",
    blurb: "The moment cash and securities actually change hands. With US equities on T+1 since May 2024, the window to catch a problem before settlement is a single business day.",
    proof: "Production support for JPMorgan Chase trade settlement systems at NextGen IT Solutions.",
    tags: ["T+1", "DVP", "Fails"] },
  { id: "payment-processing", name: "Payment Processing", category: "ops", level: 86, basis: "Production",
    blurb: "Payment flows from initiation to posting, and the validation, screening and exception handling wrapped around each step.",
    proof: "JPMorgan Chase payment processing systems at NextGen; RESTful payment integrations at Jaspay Technologies.",
    tags: ["Payments", "Posting", "Exceptions"] },
  { id: "asset-classes", name: "Equities, Fixed Income & Cash", category: "ops", level: 78, basis: "Working knowledge",
    blurb: "Where most settlement and reconciliation volume runs: share quantities and prices on one side, par, accrued interest and coupons on the other, and cash underneath both.",
    proof: "Working knowledge across equities, fixed income, cash, derivatives, annuities and retirement products.",
    tags: ["Equities", "Fixed income", "Cash"] },
  { id: "derivatives", name: "Derivatives", category: "ops", level: 70, basis: "Working knowledge",
    blurb: "Contracts whose value depends on something else, which makes their positions and P&L especially sensitive to pricing feeds and lifecycle events.",
    proof: "Part of the asset-class coverage in the core competencies.",
    tags: ["Valuation", "Lifecycle events"] },
  { id: "bloomberg", name: "Bloomberg Terminal", category: "ops", level: 74, basis: "Working knowledge",
    blurb: "Market data, security reference and pricing at the source. Useful for checking a price or a corporate action before treating a break as a booking error.",
    proof: "Listed platform experience alongside middle-office processing systems.",
    tags: ["Market data", "Reference"] },
  { id: "middle-office", name: "Middle-Office Processing", category: "ops", level: 80, basis: "Production",
    blurb: "The layer between the trade and the books: confirmation, enrichment, exception queues and the controls that keep front office and back office agreeing.",
    proof: "Work across payment processing and trade settlement systems at NextGen, translating financial requirements into technical solutions.",
    tags: ["Confirmations", "Queues"] },

  /* ------------------------------------------------------------------ IBOR */
  { id: "ibor", name: "IBOR Data Integration", category: "ibor", level: 76, basis: "Working knowledge",
    blurb: "An investment book of record gives the front office an intraday view of positions. Integrating it well means the same trade looks identical in every system that reads it.",
    proof: "Working knowledge of IBOR and securities processing, applied in reconciliation support across positions and cash.",
    tags: ["Book of record", "Intraday"] },
  { id: "position-keeping", name: "Position Keeping & Real-Time P&L", category: "ibor", level: 76, basis: "Working knowledge",
    blurb: "Positions maintained trade by trade, with P&L that moves as prices do. Its value is that the desk and the back office argue from the same numbers.",
    proof: "Part of the IBOR competency set alongside reconciliation work.",
    tags: ["Positions", "P&L"] },
  { id: "nav", name: "NAV Calculation", category: "ibor", level: 70, basis: "Working knowledge",
    blurb: "Assets at market less liabilities, divided by units outstanding. Every pricing or accrual error lands here eventually, which is why funds reconcile it hardest.",
    proof: "Working knowledge within asset management services.",
    tags: ["Funds", "Accruals"] },
  { id: "corporate-actions", name: "Corporate Actions & Dividends", category: "ibor", level: 78, basis: "Working knowledge",
    blurb: "Splits, mergers, dividends and reinvestments change positions without a trade. A missed or mistimed event is one of the commonest causes of a position break.",
    proof: "Securities processing competency: corporate actions and dividend processing.",
    tags: ["Ex-date", "Pay-date", "Elections"] },
  { id: "security-master", name: "Security Master Setup", category: "ibor", level: 72, basis: "Working knowledge",
    blurb: "Reference data for every instrument: identifiers, terms and classifications. When the master is wrong, every report downstream is wrong in exactly the same way.",
    proof: "Securities processing competency: security master setup.",
    tags: ["CUSIP / ISIN", "Reference data"] },
  { id: "pricing-feeds", name: "Pricing Feeds", category: "ibor", level: 74, basis: "Working knowledge",
    blurb: "Vendor prices and the checks around them. Stale or missing prices are a quiet source of P&L and NAV error that nobody notices until month-end.",
    proof: "Securities processing competency: pricing feeds.",
    tags: ["Vendors", "Stale prices"] },

  /* ------------------------------------------------------------ Compliance */
  { id: "bsa-aml", name: "BSA / AML", category: "compliance", level: 88, basis: "Production",
    blurb: "Bank Secrecy Act and anti-money-laundering obligations: transaction monitoring, structuring detection and the reporting trail behind every alert.",
    proof: "Automated monitoring and reporting scripts in Python and SQL that flag anomalous transaction patterns at NextGen; FinSight Agent detecting BSA structuring at 94% precision.",
    tags: ["Monitoring", "Structuring", "SAR trail"],
    demo: { to: "/projects", label: "Run the structuring lab" },
    snippet: { lang: "python", code: `import pandas as pd

CTR_THRESHOLD = 10_000
cash = txns[txns["type"] == "CASH_DEPOSIT"].sort_values("ts")

# deposits kept just under the reporting line
near = cash[cash["amount"].between(0.8 * CTR_THRESHOLD, CTR_THRESHOLD - 0.01)]

window = (
    near.set_index("ts")
        .groupby("customer_id")["amount"]
        .rolling("72h")
        .agg(["sum", "count"])
        .reset_index()
)

alerts = window[(window["sum"] >= CTR_THRESHOLD) & (window["count"] >= 2)]
# each alert keeps the deposits that formed it, for the audit narrative` } },
  { id: "ofac", name: "OFAC Screening", category: "compliance", level: 84, basis: "Production",
    blurb: "Screening parties against sanctions lists. The hard part is matching names spelled differently without burying reviewers in false positives.",
    proof: "Strengthened BSA/AML/OFAC controls through automated monitoring at NextGen, reducing manual review effort.",
    tags: ["Sanctions", "Name matching"] },
  { id: "sox", name: "SOX Controls", category: "compliance", level: 76, basis: "Working knowledge",
    blurb: "Internal controls over financial reporting: who may change what, who reviews it, and the evidence that both actually happened.",
    proof: "Controls context behind audit-ready documentation and reconciliation work.",
    tags: ["ICFR", "Segregation of duties"] },
  { id: "audit-readiness", name: "Audit Readiness", category: "compliance", level: 87, basis: "Production",
    blurb: "Documentation written while the work happens: what the control does, what it checked, and what happened to every exception it raised.",
    proof: "Audit-ready documentation at NextGen; documentation maintained for audit traceability in Agile delivery at Appworks.",
    tags: ["Evidence", "Traceability"] },
  { id: "risk-reporting", name: "Risk Reporting", category: "compliance", level: 78, basis: "Working knowledge",
    blurb: "Turning control output into something a risk committee can read: what was flagged, what was resolved, and what is still open and why.",
    proof: "Risk controls brought to retirement, insurance and asset management services through automation.",
    tags: ["Controls", "Escalation"] },

  /* ------------------------------------------------------------------ FP&A */
  { id: "driver-based", name: "Driver-Based Modeling", category: "fpa", level: 86, basis: "Project",
    blurb: "Revenue and cost built from the operational drivers that cause them (volume, price, headcount, rates), so the forecast moves when the business does.",
    proof: "Driver-based financial models built in the AI-Augmented FP&A Capstone (IBM Professional Certificate) in Excel and IBM Planning Analytics.",
    tags: ["Drivers", "Planning"],
    demo: { to: "/projects", label: "Open the scenario model" },
    snippet: { lang: "model", code: `Revenue        = Customers × Orders per customer × Avg order value
Customers      = Opening customers × (1 − Churn) + New customers
New customers  = Marketing spend ÷ Cost per acquisition
Gross profit   = Revenue × Gross margin %
Opex           = Headcount × Loaded cost + Fixed costs

Change a driver, not a total. The plan explains itself.` } },
  { id: "pvm", name: "Price-Volume-Mix Analysis", category: "fpa", level: 85, basis: "Project",
    blurb: "Splitting a revenue variance into what came from price, from volume and from the mix of what sold. One line saying revenue was down becomes three answers someone can act on.",
    proof: "Price-volume-mix variance analysis executed in the IBM FP&A capstone to support forecasting and performance evaluation.",
    tags: ["Variance", "Bridge"],
    demo: { to: "/impact", label: "Drag the live PVM bridge" },
    snippet: { lang: "python", code: `def pvm(budget, actual):
    bq, aq = budget.qty.sum(), actual.qty.sum()
    b_mix, a_mix = budget.qty / bq, actual.qty / aq

    volume = (aq - bq) * (b_mix * budget.price).sum()
    mix    = aq * ((a_mix - b_mix) * budget.price).sum()
    price  = ((actual.price - budget.price) * actual.qty).sum()

    # budget + volume + mix + price == actual revenue, to the cent
    return volume, mix, price` } },
  { id: "variance", name: "Variance Analysis", category: "fpa", level: 87, basis: "Project",
    blurb: "Actual against budget and forecast, and more usefully, why the gap exists rather than only how large it is.",
    proof: "Capstone variance work for performance evaluation; KPI and trend reporting at Appworks.",
    tags: ["Budget vs actual", "Commentary"] },
  { id: "forecasting", name: "Forecasting & Budgeting", category: "fpa", level: 82, basis: "Project",
    blurb: "Forward-looking numbers with their assumptions written down, so a reforecast is a change to an assumption rather than a new spreadsheet.",
    proof: "Generative AI and prompt-engineering workflows used to automate data preparation and accelerate forecasting in the IBM capstone, under human-in-the-loop governance.",
    tags: ["Rolling forecast", "Assumptions"] },
  { id: "scenario", name: "Scenario Planning & Stress Testing", category: "fpa", level: 82, basis: "Project",
    blurb: "Base, upside, downside and a stress case that genuinely hurts. A plan that has only been tested against good news has not been tested.",
    proof: "Stress-test scenarios designed with generative AI support in the IBM capstone.",
    tags: ["Scenarios", "Stress"],
    demo: { to: "/projects", label: "Try the four scenarios" } },
  { id: "month-end", name: "Month-End Close", category: "fpa", level: 74, basis: "Working knowledge",
    blurb: "Accruals, reconciliations and reviews in the right order, against a calendar. Most close problems are reconciliation problems that arrived late.",
    proof: "Financial analysis and reporting competency.",
    tags: ["Close calendar", "Accruals"] },
  { id: "kpi", name: "KPI Development & Management Reporting", category: "fpa", level: 86, basis: "Production",
    blurb: "Choosing the few measures leadership will actually steer by, defining them once, and reporting them the same way every period.",
    proof: "Dashboards and reports at Appworks surfacing KPIs for stakeholders, enabling trend analysis and identifying cost-saving opportunities.",
    tags: ["KPIs", "Trend analysis"] },
  { id: "ibm-pa", name: "IBM Planning Analytics", category: "fpa", level: 78, basis: "Project",
    blurb: "Multidimensional planning on TM1: versions, scenarios and driver models that many planners can work in at once without emailing copies.",
    proof: "Used in the AI-Augmented FP&A Capstone (IBM Professional Certificate).",
    tags: ["TM1", "Planning"] },
  { id: "accrual", name: "Accrual Accounting & Corporate Finance", category: "fpa", level: 74, basis: "Working knowledge",
    blurb: "Recognizing revenue and expense when they are earned and incurred, not when cash moves, and the corporate finance logic built on top of that.",
    proof: "Finance and accounting skill set: corporate finance, accrual accounting and financial modeling.",
    tags: ["Accruals", "Corporate finance"] },

  /* ------------------------------------------------------------- Insurance */
  { id: "annuities", name: "Annuity Processing", category: "insurance", level: 70, basis: "Working knowledge",
    blurb: "Contract issue, premium allocation, crediting and payout. Long-lived products where a small processing error compounds for years.",
    proof: "Working knowledge of insurance and retirement products.",
    tags: ["Annuities", "Crediting"] },
  { id: "premium-claims", name: "Premium Accounting & Claims Data", category: "insurance", level: 70, basis: "Working knowledge",
    blurb: "What has been billed, received and earned, and the claims data that sits against it.",
    proof: "Insurance and retirement competency.",
    tags: ["Premiums", "Claims"] },
  { id: "retirement", name: "Retirement Plan Reporting", category: "insurance", level: 70, basis: "Working knowledge",
    blurb: "Plan-level and participant-level reporting, contributions and servicing, where accuracy is personal to every participant.",
    proof: "Insurance and retirement competency, including participant servicing.",
    tags: ["Plans", "Participants"] },

  /* ------------------------------------------------------ Business analysis */
  { id: "requirements", name: "Requirements Gathering & Analysis", category: "ba", level: 88, basis: "Production",
    blurb: "Requirements arrive as frustration, not specifications. The work is asking why until the actual decision or control is on the table, then writing that down precisely.",
    proof: "Translating financial requirements into technical solutions with business analysts, operations and engineering at NextGen.",
    tags: ["Elicitation", "Scope"] },
  { id: "process-mapping", name: "Business Process Mapping", category: "ba", level: 86, basis: "Project",
    blurb: "Who does what, in which order, and where the handoffs fail. A swimlane makes the gap visible before anyone builds around it.",
    proof: "Text2Workflow turns plain-text process descriptions into validated swimlane blueprints, cutting design turnaround to under five minutes.",
    tags: ["Swimlanes", "Handoffs"],
    demo: { to: "/projects", label: "Generate a swimlane" } },
  { id: "brd-frd", name: "BRD / FRD & Functional Specs", category: "ba", level: 80, basis: "Working knowledge",
    blurb: "Business and functional requirement documents that engineering can build from and testers can test against, without a meeting to explain them.",
    proof: "Business analysis and delivery competency.",
    tags: ["BRD", "FRD", "Specs"] },
  { id: "user-stories", name: "User Stories & Acceptance Criteria", category: "ba", level: 86, basis: "Production",
    blurb: "Small, testable slices with acceptance criteria written before the build, so done means the same thing to everyone.",
    proof: "Wrote user stories in Agile delivery at Appworks.",
    tags: ["Given / When / Then", "Backlog"] },
  { id: "data-mapping", name: "Data Mapping & Gap Analysis", category: "ba", level: 82, basis: "Working knowledge",
    blurb: "Field by field from source to target, noting every transformation and every field that has nowhere to go.",
    proof: "Business analysis and delivery competency, applied in reconciliation and pipeline work.",
    tags: ["Source to target", "Gaps"] },
  { id: "uat", name: "UAT Planning & Coordination", category: "ba", level: 84, basis: "Production",
    blurb: "Test scripts written from the acceptance criteria, real users running them, and defects triaged before sign-off rather than after go-live.",
    proof: "Supported UAT in Agile delivery at Appworks.",
    tags: ["Test scripts", "Sign-off"] },
  { id: "stakeholder", name: "Stakeholder Management & Change", category: "ba", level: 85, basis: "Production",
    blurb: "Operations, compliance and engineering want different things from the same system. Keeping all three informed is how a change actually lands.",
    proof: "Collaboration with operations, compliance and engineering teams at NextGen and Appworks.",
    tags: ["Communication", "Change management"] },
  { id: "agile", name: "Agile / Scrum", category: "ba", level: 86, basis: "Production",
    blurb: "Sprint delivery, refinement and demos. A rough version in week one beats a polished one in week eight.",
    proof: "Agile Scrum delivery at Appworks, tracked in Jira.",
    tags: ["Sprints", "Refinement"] },

  /* -------------------------------------------------------------- Data & BI */
  { id: "sql", name: "SQL", category: "data", level: 92, basis: "Production",
    blurb: "Window functions, CTEs and set-based thinking. The place where most reconciliation logic and most monitoring rules should live.",
    proof: "Automated monitoring and reporting scripts at NextGen; financial data pipelines at Appworks.",
    tags: ["CTEs", "Window functions", "Validation"],
    snippet: { lang: "sql", code: `-- payments far outside the customer's own normal range
SELECT payment_id, customer_id, amount, z
FROM (
    SELECT payment_id, customer_id, amount,
           (amount - AVG(amount) OVER w)
             / NULLIF(STDDEV(amount) OVER w, 0) AS z
    FROM   payments
    WINDOW w AS (PARTITION BY customer_id
                 ORDER BY posted_at
                 ROWS BETWEEN 90 PRECEDING AND 1 PRECEDING)
) scored
WHERE z > 4
ORDER BY z DESC;   -- reviewers start from the strangest` } },
  { id: "python", name: "Python (Pandas, NumPy)", category: "data", level: 90, basis: "Production",
    blurb: "For everything a spreadsheet does slowly or unreliably: reshaping feeds, matching at volume, classifying breaks and scheduling the checks.",
    proof: "Monitoring scripts at NextGen, data pipelines at Appworks, payment APIs at Jaspay and the FinSight agent.",
    tags: ["Pandas", "NumPy", "Automation"] },
  { id: "excel", name: "Excel (Advanced)", category: "data", level: 90, basis: "Production",
    blurb: "Pivot tables, XLOOKUP, LET and Power Query. Still where finance checks a number first, so it should be done properly.",
    proof: "Driver-based models and PVM analysis in the IBM capstone; reconciliation and reporting work.",
    tags: ["XLOOKUP", "Power Query", "Pivots"],
    snippet: { lang: "excel", code: `=LET(
    id,      A2,
    custody, XLOOKUP(id, Custody[TradeID], Custody[Qty], "MISSING"),
    books,   XLOOKUP(id, Ledger[TradeID],  Ledger[Qty],  "MISSING"),
    IF(OR(custody = "MISSING", books = "MISSING"), "ONE-SIDED",
       IF(ABS(custody - books) < 0.01, "MATCHED",
          "BREAK " & TEXT(custody - books, "#,##0")))
)` } },
  { id: "tableau", name: "Tableau", category: "data", level: 84, basis: "Production",
    blurb: "Visual analysis for spotting the trend before writing the query that proves it.",
    proof: "Dashboards and reports surfacing KPIs for stakeholders at Appworks.",
    tags: ["Dashboards", "Trends"] },
  { id: "power-bi", name: "Power BI", category: "data", level: 84, basis: "Production",
    blurb: "Governed reporting with measures defined once, so two teams cannot quote two different numbers for the same period.",
    proof: "KPI dashboards and management reporting at Appworks.",
    tags: ["DAX", "Reporting"] },
  { id: "data-quality", name: "Data Validation & Quality", category: "data", level: 88, basis: "Production",
    blurb: "Completeness, uniqueness, ranges and referential checks on every load. A reconciliation is only as good as the data fed into it.",
    proof: "Improved data accuracy through validated pipelines at Appworks.",
    tags: ["Checks", "Accuracy"] },
  { id: "rest-apis", name: "REST APIs", category: "data", level: 85, basis: "Production",
    blurb: "Designing and consuming APIs that move financial data: authentication, idempotency, validation and clean error contracts.",
    proof: "RESTful APIs for payment processing integrations at Jaspay; REST APIs in the NextGen environment.",
    tags: ["Payments", "Idempotency"] },
  { id: "testing", name: "Unit & Integration Testing", category: "data", level: 84, basis: "Production",
    blurb: "Tests that encode the money rules: a refund cannot exceed the capture, a duplicate request cannot pay twice.",
    proof: "99.2% test coverage on transaction modules before production deployment at Jaspay.",
    tags: ["99.2% coverage", "pytest"],
    snippet: { lang: "python", code: `def test_refund_cannot_exceed_capture(client, captured_payment):
    resp = client.post(
        f"/payments/{captured_payment.id}/refund",
        json={"amount": captured_payment.amount + 1},
    )
    assert resp.status_code == 422
    assert resp.json()["error"] == "REFUND_EXCEEDS_CAPTURE"

def test_retry_is_idempotent(client, payment_request):
    first  = client.post("/payments", json=payment_request)
    second = client.post("/payments", json=payment_request)
    assert first.json()["id"] == second.json()["id"]` } },
  { id: "javascript", name: "JavaScript", category: "data", level: 76, basis: "Project",
    blurb: "For tools that run where the analyst already is: the browser.",
    proof: "Text2Workflow, the natural-language workflow engine, is built in JavaScript.",
    tags: ["Browser tools"] },

  /* ------------------------------------------------------------- AI & cloud */
  { id: "aws", name: "AWS (Certified Developer)", category: "ai", level: 84, basis: "Certified",
    blurb: "Building and deploying on AWS: serverless functions, managed data stores, IAM and the deployment pipeline around them.",
    proof: "AWS Certified Developer – Associate; FinSight Agent runs on AWS Bedrock.",
    tags: ["Associate", "Serverless", "IAM"], link: "https://aws.amazon.com/certification/certified-developer-associate/" },
  { id: "langgraph", name: "LangGraph & LLM Agents", category: "ai", level: 85, basis: "Project",
    blurb: "Agents as explicit graphs: each step a node, each decision an edge, so the reasoning an auditor asks about is a path you can show them.",
    proof: "FinSight Agent uses multi-step LLM reasoning and tool calling to detect BSA structuring patterns.",
    tags: ["Tool calling", "Multi-step"],
    snippet: { lang: "python", code: `from langgraph.graph import StateGraph, END

# the shape of a compliance-review agent
graph = StateGraph(CaseState)
graph.add_node("pull", pull_transactions)
graph.add_node("screen", screen_parties)       # sanctions lists
graph.add_node("detect", detect_structuring)
graph.add_node("review", llm_review)           # reasons over evidence
graph.add_node("report", draft_audit_report)

graph.set_entry_point("pull")
graph.add_edge("pull", "screen")
graph.add_edge("screen", "detect")
graph.add_conditional_edges("detect", has_alerts, {True: "review", False: END})
graph.add_edge("review", "report")
graph.add_edge("report", END)

agent = graph.compile()` } },
  { id: "genai", name: "Generative AI & Prompt Engineering", category: "ai", level: 84, basis: "Project",
    blurb: "Using models to prepare data, draft forecasts and design stress scenarios, with a human approving what goes into the plan.",
    proof: "Generative AI workflows in the IBM FP&A capstone; Anthropic AI Fluency for Business.",
    tags: ["Human in the loop", "Prompting"] },
  { id: "bedrock", name: "AWS Bedrock & FastAPI", category: "ai", level: 80, basis: "Project",
    blurb: "Managed foundation models behind a small, typed API, which is a reasonable way to put an agent in front of a compliance team.",
    proof: "FinSight Agent environment: Python, LangGraph, AWS Bedrock, FastAPI.",
    tags: ["Bedrock", "FastAPI"] },
  { id: "devops", name: "Git, Docker & CI/CD", category: "ai", level: 78, basis: "Project",
    blurb: "Automation is code, so it gets version history, containers and a pipeline like any other code.",
    proof: "Cloud and automation toolchain across projects.",
    tags: ["Git", "Docker", "CI/CD"] },
  { id: "jira", name: "Jira & Confluence", category: "ai", level: 85, basis: "Production",
    blurb: "The backlog, and the written record of why something was built the way it was.",
    proof: "Agile delivery and audit-traceable documentation at Appworks.",
    tags: ["Backlog", "Documentation"] },
];

/* -------------------------------------------------------------- EXPERIENCE */
export type Message = { from: "them" | "me"; text: string; time: string; kind?: "text" | "metric" | "stack" };

export type Job = {
  id: string; company: string; short: string; role: string; location: string;
  period: string; duration: string; current?: boolean; weight: number;
  project?: string; environment: string[]; areas: string[];
  accent: string; initials: string; headline: string;
  thread: Message[];
  bullets: string[];
};

export const jobs: Job[] = [
  {
    id: "nextgen",
    company: "NextGen IT Solutions",
    short: "NextGen",
    role: "Analyst – Financial Systems & Trade Operations",
    location: "Ashburn, VA",
    period: "Feb 2026 – Present",
    duration: "Current",
    current: true,
    weight: 1.5,
    project: "JPMorgan Chase – Payment Processing & Trade Settlement Systems",
    environment: ["Python", "SQL", "REST APIs", "Payment Processing", "Trade Settlement Systems"],
    areas: ["Trade Settlement", "Payment Processing", "Reconciliation & Break Resolution", "BSA/AML/OFAC Controls", "Data Analysis", "Audit Documentation"],
    accent: "var(--accent)",
    initials: "NG",
    headline: "Production support for JPMorgan Chase payment processing and trade settlement, from transaction capture to break resolution.",
    thread: [
      { from: "them", text: "Settlement exceptions keep landing on operations after the window has already closed. We need to see the breaks while they can still be fixed.", time: "08:42" },
      { from: "me", text: "Then the matching has to run earlier. Let me put the cash and position feeds side by side in SQL and isolate exactly where they diverge.", time: "08:45" },
      { from: "me", text: "Python and SQL against the payment processing and settlement systems, REST APIs for the feeds.", time: "08:46", kind: "stack" },
      { from: "them", text: "Custody and accounting don't agree either.", time: "08:58" },
      { from: "me", text: "Same discipline: match custody against accounting, classify every break by cause, and route it to operations or compliance with the evidence attached.", time: "09:01", kind: "metric" },
      { from: "them", text: "Compliance wants tighter BSA/AML and OFAC coverage without adding reviewers.", time: "09:14" },
      { from: "me", text: "Automated monitoring scripts that flag anomalous transaction patterns, so reviewers start from a ranked queue instead of raw volume.", time: "09:16", kind: "metric" },
      { from: "them", text: "Audit is going to ask how every one of these controls works.", time: "09:27" },
      { from: "me", text: "Audit-ready documentation for each one, written with the business analysts and engineers while we build, not reconstructed afterwards.", time: "09:29" },
    ],
    bullets: [
      "Support production-grade applications for JPMorgan Chase's payment processing and trade settlement systems, ensuring accurate transaction capture, allocation and settlement across high-volume workflows.",
      "Perform data analysis and reconciliation support for cash vs. position and custody vs. accounting breaks, partnering with operations and compliance to resolve exceptions.",
      "Build automated monitoring and reporting scripts in Python and SQL to flag anomalous transaction patterns, strengthening BSA/AML/OFAC controls and reducing manual review effort.",
      "Collaborate with business analysts, operations and engineering teams to translate financial requirements into technical solutions and maintain audit-ready documentation.",
    ],
  },
  {
    id: "appworks",
    company: "Appworks",
    short: "Appworks",
    role: "Associate Analyst – Financial Data & Reporting",
    location: "McAllen, TX",
    period: "Feb 2025 – Jan 2026",
    duration: "1 yr",
    weight: 2.2,
    project: "Financial Data Pipelines & KPI Reporting",
    environment: ["Python", "SQL", "Tableau", "Power BI", "Jira", "Agile Scrum"],
    areas: ["Financial Data Analysis", "Reconciliation Automation", "KPI & Management Reporting", "Dashboards", "Agile Delivery", "UAT"],
    accent: "var(--sky)",
    initials: "AW",
    headline: "Financial data pipelines and KPI reporting that took the copy-and-match out of reconciliation.",
    thread: [
      { from: "them", text: "Finance pulls transaction data by hand every week and the reconciliation eats days.", time: "10:05" },
      { from: "me", text: "Then the pipeline is what's missing. Python and SQL pipelines over the transaction data, validated as it loads so nothing gets re-keyed.", time: "10:08" },
      { from: "me", text: "Manual reconciliation effort came down 35%, and accuracy went up because the matching stopped depending on someone's afternoon.", time: "10:09", kind: "metric" },
      { from: "them", text: "Leadership wants to see where costs are drifting.", time: "10:21" },
      { from: "me", text: "Tableau and Power BI dashboards surfacing the KPIs, with trend views that make the cost-saving opportunities visible.", time: "10:24", kind: "stack" },
      { from: "them", text: "Two reports show different numbers for the same thing.", time: "10:36" },
      { from: "me", text: "Root cause analysis on the discrepancy, traced back to source, then a corrective fix with the technical team so it stays fixed.", time: "10:39" },
      { from: "them", text: "How do we keep all of this traceable?", time: "10:47" },
      { from: "me", text: "User stories, UAT support and documentation in Jira. Every change has a trail an auditor can follow.", time: "10:49", kind: "metric" },
    ],
    bullets: [
      "Built data pipelines processing financial transaction data, improving data accuracy and reducing manual reconciliation effort by 35%.",
      "Designed dashboards and reports surfacing KPIs for stakeholders, enabling trend analysis and identification of cost-saving opportunities.",
      "Conducted root cause analysis on data discrepancies and partnered with technical teams to implement corrective actions.",
      "Participated in Agile delivery: writing user stories, supporting UAT and maintaining documentation for audit traceability.",
    ],
  },
  {
    id: "jaspay",
    company: "Jaspay Technologies",
    short: "Jaspay",
    role: "Software Developer Intern – Payments",
    location: "Bangalore, India",
    period: "May 2022 – Sep 2022",
    duration: "5 mos",
    weight: 1,
    environment: ["Python", "REST APIs", "Payment Processing Integrations"],
    areas: ["Payment APIs", "Secure Data Handling", "Testing"],
    accent: "var(--brass)",
    initials: "JP",
    headline: "RESTful payment integrations built to handle sensitive financial data securely, and tested before they shipped.",
    thread: [
      { from: "them", text: "We need payment integrations that will pass a security review.", time: "14:10" },
      { from: "me", text: "RESTful APIs in Python for the payment processing integrations, built for secure and compliant handling of sensitive financial data from the start.", time: "14:13", kind: "stack" },
      { from: "them", text: "And nothing touches production without proper coverage.", time: "14:30" },
      { from: "me", text: "Unit and integration tests across the transaction modules: 99.2% coverage before deployment.", time: "14:33", kind: "metric" },
    ],
    bullets: [
      "Developed RESTful APIs for payment processing integrations, ensuring secure and compliant handling of sensitive financial data.",
      "Conducted unit and integration testing on transaction modules, achieving 99.2% test coverage prior to production deployment.",
    ],
  },
  {
    id: "dxc",
    company: "DXC Technology",
    short: "DXC",
    role: "Summer Intern – Data & Process Analysis",
    location: "Hyderabad, India",
    period: "May 2021 – Sep 2021",
    duration: "5 mos",
    weight: 1,
    environment: ["System logs", "Performance data", "Process analysis"],
    areas: ["Process Analysis", "Performance Data", "Leadership Reporting"],
    accent: "var(--text-muted)",
    initials: "DX",
    headline: "Where the habit started: reading the logs before guessing at the problem.",
    thread: [
      { from: "them", text: "Some of our enterprise workflows feel slow, and nobody can say where the time actually goes.", time: "11:02" },
      { from: "me", text: "Let me read the system logs and the performance data before anyone guesses.", time: "11:05" },
      { from: "me", text: "Found the inefficiencies in the application workflows and presented them to senior engineering leadership.", time: "11:40", kind: "metric" },
    ],
    bullets: [
      "Analyzed system logs and performance data to identify inefficiencies in enterprise application workflows, presenting findings to senior engineering leadership.",
    ],
  },
];

/* ---------------------------------------------------------------- PROJECTS */
export type Project = {
  id: string; name: string; kind: string; repo?: string; environment: string[];
  metric: { value: number; prefix?: string; suffix: string; label: string };
  bullets: string[]; accent: string;
};

export const projects: Project[] = [
  {
    id: "finsight", name: "FinSight Agent", kind: "AML/OFAC Compliance Automation",
    repo: "https://github.com/Rahu378/finsight-agent",
    environment: ["Python", "LangGraph", "AWS Bedrock", "FastAPI"],
    metric: { value: 94, suffix: "%", label: "precision on suspicious-transaction detection" },
    bullets: [
      "Built an AML/OFAC compliance agent that detects BSA structuring patterns and generates audit-ready reports for fintech compliance officers, achieving 94% precision on suspicious-transaction detection via multi-step LLM reasoning and tool-calling workflows.",
    ],
    accent: "var(--sky)",
  },
  {
    id: "text2workflow", name: "Text2Workflow", kind: "Business Process Automation",
    repo: "https://github.com/Rahu378/text2workflow",
    environment: ["JavaScript", "NLP", "Workflow Engines"],
    metric: { value: 5, prefix: "<", suffix: " min", label: "from description to blueprint, down from hours" },
    bullets: [
      "Developed a natural-language workflow engine converting plain-text process descriptions into validated, exportable swimlane blueprints for business analysts, cutting design turnaround from hours to under 5 minutes.",
    ],
    accent: "var(--accent)",
  },
  {
    id: "fpa", name: "AI-Augmented FP&A Capstone", kind: "IBM Professional Certificate",
    environment: ["Microsoft Excel", "IBM Planning Analytics", "Generative AI"],
    metric: { value: 4, suffix: "", label: "scenarios, from base case to stress" },
    bullets: [
      "Built driver-based financial models and executed price-volume-mix variance analysis to support forecasting and performance evaluation.",
      "Applied generative AI and prompt-engineering workflows to automate data preparation, accelerate forecasting and design stress-test scenarios under human-in-the-loop governance.",
    ],
    accent: "var(--brass)",
  },
];

/* --------------------------------------------------- EDUCATION & CREDENTIALS */
export const education = {
  degree: "Bachelor of Science",
  field: "Computer Science",
  school: "Rowan University",
  location: "Glassboro, NJ",
  period: "Dec 2024",
  honor: "Merit-based International Credit Transfer Scholarship Recipient",
  note: "The engineering half of the toolkit: databases, algorithms and software design. It is why the reconciliation logic ends up in tested code instead of a fragile spreadsheet.",
};

export const certifications = [
  { id: "aws", name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", accent: "var(--brass)", featured: true },
  { id: "ibm-fpa", name: "AI-Augmented FP&A Capstone", issuer: "IBM Professional Certificate", accent: "var(--accent)", featured: true },
  { id: "ibm-edt", name: "Enterprise Design Thinking Practitioner", issuer: "IBM", accent: "var(--sky)" },
  { id: "anthropic", name: "AI Fluency for Business", issuer: "Anthropic", accent: "var(--sky)" },
  { id: "sf-fsc", name: "Financial Services Cloud & CRM Analytics badges", issuer: "Salesforce", accent: "var(--accent)" },
  { id: "sf-rev", name: "Revenue Cloud", issuer: "Salesforce", accent: "var(--accent)" },
];

export const leadership = [
  {
    id: "acm", role: "Tech Coordinator", org: "ACM, Rowan University",
    body: "Organized hackathons and tech talks, secured the sponsorship to fund them, and owned project management and budget oversight.",
    stats: [
      { value: 6, suffix: "", label: "hackathons" },
      { value: 12, suffix: "", label: "tech talks" },
      { value: 300, suffix: "", label: "students" },
      { value: 15, prefix: "$", suffix: "K", label: "sponsorships" },
    ],
  },
  {
    id: "lpu", role: "Workshop lead", org: "Google Developer Student Club & Orator Student Club, LPU",
    body: "Led AI and cloud workshops alongside public-speaking sessions. Explaining a model to a room is the same skill as explaining a variance to a CFO.",
    stats: [{ value: 150, suffix: "+", label: "people trained" }],
  },
];

/* -------------------------------------------------------------- PRINCIPLES */
export const principles = [
  {
    id: "reconcile",
    title: "Reconcile before you report",
    body: "A dashboard built on unreconciled data only publishes the break faster. Cash against position and custody against accounting come first; the chart comes after the numbers tie.",
    icon: "Scale",
  },
  {
    id: "cause",
    title: "Every break has a cause",
    body: "Timing, a corporate action, a stale price or a booking error. Classify by cause rather than by size and the fix routes itself to the right team.",
    icon: "SearchCheck",
  },
  {
    id: "code",
    title: "Controls are code",
    body: "A monitoring rule that lives in someone's head is not a control. Write it in SQL or Python, version it, test it, and schedule it, so it runs the same way every day.",
    icon: "FileCode",
  },
  {
    id: "explain",
    title: "Explain the variance, not just the number",
    body: "Revenue was down is an observation. Price, volume and mix, each with its driver, is an explanation somebody can act on before the next close.",
    icon: "TrendingUp",
  },
  {
    id: "requirements",
    title: "Requirements are the first control",
    body: "Most rework starts with a requirement nobody wrote down. Acceptance criteria and UAT scripts written before the build are cheaper than any fix after it.",
    icon: "ClipboardCheck",
  },
  {
    id: "audit",
    title: "Audit-ready by default",
    body: "Documentation written while the work happens: what the control does, what it checked and what happened to each exception. Nobody should rebuild the evidence the week the auditor arrives.",
    icon: "FileCheck",
  },
];

/* ----------------------------------------------------------- DEMO DATASETS */
/** Illustrative shape only: indexed manual effort before and after pipelines; the measured outcome is the 35% end point. */
export const reconEffort = [
  { m: "Feb", before: 100, after: 100 },
  { m: "Mar", before: 102, after: 97 },
  { m: "Apr", before: 99, after: 91 },
  { m: "May", before: 103, after: 86 },
  { m: "Jun", before: 101, after: 80 },
  { m: "Jul", before: 104, after: 76 },
  { m: "Aug", before: 100, after: 72 },
  { m: "Sep", before: 102, after: 70 },
  { m: "Oct", before: 101, after: 68 },
  { m: "Nov", before: 103, after: 66 },
  { m: "Dec", before: 100, after: 65 },
];

/** Approximate weighting of the work by area, for the Impact page slicer. */
export const areaSplit = [
  { name: "Reconciliation & settlement", value: 34, color: "var(--accent)", metric: "recon" },
  { name: "Compliance automation", value: 24, color: "var(--sky)", metric: "precision" },
  { name: "Planning & analysis", value: 26, color: "var(--brass)", metric: "turnaround" },
  { name: "Payments engineering", value: 16, color: "var(--rose)", metric: "coverage" },
];

export const capabilityRadar = [
  { axis: "Reconciliation", v: 88 },
  { axis: "Trade ops", v: 82 },
  { axis: "Compliance", v: 85 },
  { axis: "FP&A", v: 84 },
  { axis: "Business analysis", v: 86 },
  { axis: "SQL & Python", v: 91 },
  { axis: "AI & cloud", v: 83 },
];

/** Sample budget for the PVM bridge. Three product lines, budget price and quantity. */
export const pvmBudget = [
  { name: "Core", price: 40, qty: 12000 },
  { name: "Premium", price: 95, qty: 4000 },
  { name: "Add-ons", price: 15, qty: 6000 },
];
