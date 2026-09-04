import maintainerLogMarkdown from "../../../docs/MAINTAINER_LOG.md?raw";

export type MaintainerLoreEntry = {
  number: number;
  kind: "重构记录" | "维护记录";
  title: string;
  date: string;
  lines: string[];
};

const ENTRY_PATTERN = /^## 【第(\d+)次(重构记录|维护记录)】([^\n]+)\n\nDate: ([^\n]+)\n\n((?:>[^\n]*\n?)+)/gm;

export function parseMaintainerLore(markdown: string): MaintainerLoreEntry[] {
  const entries: MaintainerLoreEntry[] = [];

  for (const match of markdown.matchAll(ENTRY_PATTERN)) {
    const [, rawNumber, kind, rawTitle, date, quoteBlock] = match;
    const lines = quoteBlock
      .split("\n")
      .filter((line) => line.startsWith(">"))
      .map((line) => line.replace(/^>\s?/, "").trim())
      .filter(Boolean);

    entries.push({
      number: Number(rawNumber),
      kind: kind as MaintainerLoreEntry["kind"],
      title: rawTitle.trim(),
      date: date.trim(),
      lines
    });
  }

  return entries.sort((a, b) => b.number - a.number);
}

export const maintainerLoreEntries = parseMaintainerLore(maintainerLogMarkdown);
