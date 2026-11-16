import { site } from "@/site.config";
import { pickProjects, type Picked, type Repo } from "./projects";

export type Project = Picked & { cover: string | null };

// Runs at build time. A failed request fails the build on purpose:
// better to keep yesterday's site than to publish an empty one.
export async function getProjects(): Promise<Project[]> {
  const token = process.env.GITHUB_TOKEN;
  // shortcut: first 100 repos only, add pagination when the account passes that
  const res = await fetch(`https://api.github.com/users/${site.user}/repos?per_page=100`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`GitHub API respondió ${res.status}`);
  const repos = ((await res.json()) as Repo[]).map((r) => ({ ...r, homepage: r.homepage || null }));

  return Promise.all(
    pickProjects(repos, site).map(async (r) => {
      // Optional screenshot each repo can provide at docs/cover.png
      const cover = `https://raw.githubusercontent.com/${site.user}/${r.name}/HEAD/docs/cover.png`;
      const has = await fetch(cover, { method: "HEAD" }).then((x) => x.ok, () => false);
      return { ...r, cover: has ? cover : null };
    }),
  );
}
