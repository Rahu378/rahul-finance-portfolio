export type RouteDef = { path: string; label: string; blurb: string };

export const ROUTES: RouteDef[] = [
  { path: "/",           label: "Home",       blurb: "The opening position" },
  { path: "/about",      label: "About",      blurb: "Principles, certifications and education" },
  { path: "/skills",     label: "Skills",     blurb: "Every competency, explained and clickable" },
  { path: "/experience", label: "Experience", blurb: "Four roles, told as the conversations that started them" },
  { path: "/projects",   label: "Projects",   blurb: "Three builds you can run in the browser" },
  { path: "/impact",     label: "Impact",     blurb: "The outcomes, as a live report with a PVM bridge" },
  { path: "/contact",    label: "Contact",    blurb: "Start a conversation" },
];
