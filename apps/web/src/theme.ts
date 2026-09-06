/** 日间 / 夜间 / 护眼. Shared by the forum and the workshop; the choice lives only in this browser. */
export const THEMES = ["day", "night", "eye"] as const;
export type Theme = (typeof THEMES)[number];
export const THEME_LABELS: Record<Theme, string> = { day: "日间", night: "夜间", eye: "护眼" };
const THEME_KEY = "td-theme-v3";

export function readTheme(): Theme {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return THEMES.includes(value as Theme) ? (value as Theme) : "day";
  } catch {
    return "day";
  }
}

export function applyTheme(value: Theme, container?: HTMLElement | null) {
  document.documentElement.dataset.theme = value;
  container?.querySelectorAll<HTMLButtonElement>("[data-theme]").forEach((button) => {
    const on = button.dataset.theme === value;
    button.classList.toggle("on", on);
    button.setAttribute("aria-pressed", String(on));
  });
}

/** Renders the three buttons into `container` and wires them. Returns whether the preference could be saved. */
export function mountThemeSwitch(container: HTMLElement, onBlocked?: () => void) {
  container.innerHTML = THEMES.map((value) => `<button type="button" data-theme="${value}">${THEME_LABELS[value]}</button>`).join("");
  applyTheme(readTheme(), container);
  container.querySelectorAll<HTMLButtonElement>("[data-theme]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.theme as Theme;
      applyTheme(value, container);
      try {
        localStorage.setItem(THEME_KEY, value);
      } catch {
        onBlocked?.();
      }
    });
  });
}
