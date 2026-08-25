// A short, deliberately curated set. Every theme here was checked for readable
// body text and enough contrast between the two message bubbles — the loud and
// low-contrast daisyUI themes are intentionally left out.
export const THEMES = [
  {
    id: "corporate",
    name: "Corporate",
    mode: "Light",
    description: "Clean and neutral. The default.",
  },
  {
    id: "winter",
    name: "Winter",
    mode: "Light",
    description: "Soft, cool blues for long reading.",
  },
  {
    id: "dim",
    name: "Dim",
    mode: "Dark",
    description: "Muted dark, easy on night shifts.",
  },
  {
    id: "night",
    name: "Night",
    mode: "Dark",
    description: "Deep blue-black with crisp text.",
  },
];

export const THEME_IDS = THEMES.map((t) => t.id);
export const DEFAULT_THEME = "corporate";
