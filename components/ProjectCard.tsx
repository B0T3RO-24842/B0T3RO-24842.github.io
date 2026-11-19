import type { Project } from "@/lib/github";
import { hueOf, titleOf } from "@/lib/projects";
import { site } from "@/site.config";
import { Demo } from "./Demo";

const DOT: Record<string, string> = { TypeScript: "#3178c6", JavaScript: "#f1e05a", HTML: "#e34c26", CSS: "#663399", PHP: "#4f5d95", Python: "#3572a5", Java: "#b07219", SCSS: "#c6538c", Shell: "#89e051", Prisma: "#0c344b", Dockerfile: "#384d54", Hack: "#878787" };

const date = new Intl.DateTimeFormat("es-CO", { month: "short", year: "numeric" });

export function ProjectCard({ p, big = false }: { p: Project; big?: boolean }) {
  const title = titleOf(p.name);
  const hue = hueOf(p.name);
  const tags = p.topics.filter((t) => t !== site.tag && t !== site.featuredTag);

  return (
    <article
      id={p.name}
      className={`group flex scroll-mt-24 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-lima/50 target:border-lima ${big ? "md:col-span-2 md:flex-row" : ""}`}
    >
      {p.cover ? (
        // eslint-disable-next-line @next/next/no-img-element -- static export, remote file
        <img src={p.cover} alt={`Captura de ${title}`} loading="lazy" className={`aspect-video object-cover ${big ? "md:w-3/5" : "w-full"}`} />
      ) : (
        // No docs/cover.png in the repo yet: generated cover, one colour per project.
        <div
          aria-hidden
          className={`grid aspect-video place-items-center overflow-hidden ${big ? "md:w-3/5" : "w-full"}`}
          style={{ background: `linear-gradient(135deg, hsl(${hue} 65% 26%), hsl(${(hue + 50) % 360} 70% 10%))` }}
        >
          <span className="px-6 text-center font-mono text-2xl font-bold break-all text-white/25 transition duration-300 group-hover:scale-105 group-hover:text-white/50">{p.name}</span>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className={`font-semibold tracking-tight ${big ? "text-3xl" : "text-xl"}`}>{title}</h3>
          {p.featured && <span className="shrink-0 rounded-full bg-lima px-2.5 py-1 text-xs font-medium text-tinta">Destacado</span>}
        </div>

        <p className="text-sm leading-relaxed opacity-70">{p.description ?? "Descripción pendiente en GitHub."}</p>

        <ul className="flex flex-wrap gap-2 font-mono text-xs">
          {p.languages.map((l) => (
            <li key={l} className="flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1">
              <span className="size-2 rounded-full" style={{ background: DOT[l] ?? "#888" }} />
              {l}
            </li>
          ))}
          {tags.map((t) => (
            <li key={t} className="rounded-full border border-white/15 px-2.5 py-1 opacity-70">
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-3 text-sm">
          {p.homepage && <Demo url={p.homepage} title={title} />}
          <a href={p.html_url} target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-4 hover:decoration-lima">
            Código ↗
          </a>
          <time dateTime={p.pushed_at} className="ml-auto font-mono text-xs opacity-50">
            {date.format(new Date(p.pushed_at))}
          </time>
        </div>
      </div>
    </article>
  );
}
