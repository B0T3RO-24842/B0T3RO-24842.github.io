import { Palette, type PaletteItem } from "@/components/Palette";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/github";
import { titleOf } from "@/lib/projects";
import { site } from "@/site.config";

const SECTIONS = [
  { label: "Proyectos", href: "#proyectos" },
  { label: "Stack", href: "#stack" },
  { label: "Contacto", href: "#contacto" },
];

export default async function Page() {
  const projects = await getProjects();

  // Stack is counted from the projects themselves, so it never goes stale.
  const stack = new Map<string, number>();
  for (const p of projects) for (const l of p.languages) stack.set(l, (stack.get(l) ?? 0) + 1);
  const langs = [...stack].sort((a, b) => b[1] - a[1]);

  const items: PaletteItem[] = [
    ...SECTIONS.map((s) => ({ ...s, hint: "sección" })),
    ...projects.map((p) => ({ label: titleOf(p.name), hint: p.language ?? "repo", href: `#${p.name}` })),
    ...site.links.map((l) => ({ ...l, hint: "enlace" })),
  ];

  const built = new Intl.DateTimeFormat("es-CO", { dateStyle: "long" }).format(new Date());

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-white/10 bg-tinta/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <a href="#" className="font-mono text-sm font-bold tracking-widest">
            {site.handle}
            <span className="text-lima">.exe</span>
          </a>
          <nav className="hidden gap-8 text-sm md:flex">
            {SECTIONS.map((s) => (
              <a key={s.href} href={s.href} className="opacity-70 transition hover:opacity-100">
                {s.label}
              </a>
            ))}
          </nav>
          <Palette items={items} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="py-20 md:py-32">
          <p className="font-mono text-sm text-lima">
            &gt; whoami<span className="ml-1 inline-block h-4 w-2 animate-blink bg-lima align-middle" aria-hidden />
          </p>
          <h1 className="mt-6 text-5xl leading-[1.05] font-semibold tracking-tight text-balance md:text-7xl">
            Ideas distintas, hechas para <span className="text-lima">tocarse</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed opacity-75">
            Soy <strong className="font-semibold text-hueso">{site.name}</strong>. {site.role}, {site.city}. {site.bio}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#proyectos" className="rounded-full bg-hueso px-7 py-3.5 font-medium text-tinta transition hover:bg-white">
              Ver proyectos
            </a>
            {site.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-7 py-3.5 transition hover:border-white/60">
                {l.label} ↗
              </a>
            ))}
          </div>
          <dl className="mt-16 flex flex-wrap gap-x-12 gap-y-6 font-mono text-sm">
            {[
              [projects.length, "proyectos"],
              [langs.length, langs.length === 1 ? "lenguaje" : "lenguajes"],
              [projects.filter((p) => p.homepage).length, "demos en vivo"],
            ].map(([n, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="text-3xl font-bold text-hueso">{n}</span> <span className="opacity-60">{label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="proyectos" className="scroll-mt-24 pb-24">
          <h2 className="font-mono text-sm tracking-widest text-lima uppercase">Proyectos</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {projects.map((p, n) => (
              <ProjectCard key={p.name} p={p} big={n === 0} />
            ))}
          </div>
        </section>

        <section id="stack" className="scroll-mt-24 border-t border-white/10 py-24">
          <h2 className="font-mono text-sm tracking-widest text-lima uppercase">Stack</h2>
          <p className="mt-4 max-w-xl opacity-70">Contado desde los proyectos de arriba, no escrito a mano.</p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {langs.map(([lang, n]) => (
              <li key={lang} className="rounded-2xl border border-white/15 px-5 py-3">
                <span className="text-lg font-semibold">{lang}</span>
                <span className="ml-3 font-mono text-xs opacity-60">
                  {n} {n === 1 ? "proyecto" : "proyectos"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="contacto" className="scroll-mt-24 border-t border-white/10 py-24">
          <h2 className="font-mono text-sm tracking-widest text-lima uppercase">Contacto</h2>
          <p className="mt-6 max-w-3xl text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
            ¿Tienes una idea que suena rara? Mejor: escríbeme.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            {site.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="rounded-full bg-lima px-7 py-3.5 font-medium text-tinta transition hover:brightness-110">
                {l.label} ↗
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-6 py-8 font-mono text-xs opacity-50">
          Esta página se arma sola desde GitHub · actualizada el {built}
        </p>
      </footer>
    </>
  );
}
