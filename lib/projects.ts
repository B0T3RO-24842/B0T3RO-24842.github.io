export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  homepage: string | null;
  html_url: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

export type Picked = Repo & { featured: boolean };

type Rules = { user: string; tag: string; featuredTag: string };

// Which repos appear and in what order: tagged ones, featured first, then most recent.
// While nothing is tagged yet, every own repo shows so the page is never empty.
export function pickProjects(repos: Repo[], { user, tag, featuredTag }: Rules): Picked[] {
  const own = repos.filter((r) => !r.fork && !r.archived && r.name !== user && !r.name.endsWith(".github.io"));
  const tagged = own.filter((r) => r.topics.includes(tag));
  return (tagged.length ? tagged : own)
    .map((r) => ({ ...r, featured: r.topics.includes(featuredTag) }))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.pushed_at.localeCompare(a.pushed_at));
}

// Words that must stay upper-case in a title.
const ACRONYMS = new Set(["ia", "ai", "n8n", "3d", "api", "crud", "ui", "ux", "sql"]);

// "registro-n8n-ia" -> "Registro N8N IA", "producto-3d" -> "Producto 3D"
export const titleOf = (name: string) =>
  name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => (ACRONYMS.has(w.toLowerCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

// Stable colour per repo for the generated cover.
export const hueOf = (name: string) => [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);
