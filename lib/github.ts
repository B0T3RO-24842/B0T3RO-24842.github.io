import { site } from "@/site.config";
import { pickProjects, type Picked, type Repo } from "./projects";

export type Project = Picked & { cover: string | null; languages: string[] };

// Runs at build time. A failed request fails the build on purpose:
// better to keep yesterday's site than to publish an empty one.
export async function getProjects(): Promise<Project[]> {
  const token = process.env.GITHUB_TOKEN;
  // shortcut: first 100 repos only, add pagination when the account passes that
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const res = await fetch(`https://api.github.com/users/${site.user}/repos?per_page=100`, { headers });
  if (!res.ok) throw new Error(`GitHub API respondió ${res.status}`);
  const repos = ((await res.json()) as Repo[]).map((r) => ({ ...r, homepage: r.homepage || null }));

  return Promise.all(
    pickProjects(repos, site).map(async (r) => {
      // Optional screenshot each repo can provide at docs/cover.png
      const cover = `https://raw.githubusercontent.com/${site.user}/${r.name}/HEAD/docs/cover.png`;
      const has = await fetch(cover, { method: "HEAD" }).then((x) => x.ok, () => false);
      // Top 3 languages by bytes; GitHub's single "language" undersells mixed stacks.
      const languages = await fetch(`https://api.github.com/repos/${site.user}/${r.name}/languages`, { headers })
        .then((x) => (x.ok ? x.json() : {}))
        .then((l: Record<string, number>) => Object.entries(l).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name]) => name), () => []);
      return { ...r, cover: has ? cover : null, languages: languages.length ? languages : r.language ? [r.language] : [] };
    }),
  );
}
