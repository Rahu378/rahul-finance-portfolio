import { createContext, useContext } from "react";

export type AppCtx = {
  openSkill: (id: string) => void;
  openPalette: () => void;
  theme: "dark" | "light";
};

export const AppContext = createContext<AppCtx>({
  openSkill: () => {},
  openPalette: () => {},
  theme: "dark",
});

export const useApp = () => useContext(AppContext);
