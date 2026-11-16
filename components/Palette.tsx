"use client";

import { useEffect, useRef, useState } from "react";

export type PaletteItem = { label: string; hint: string; href: string };

// Ctrl+K: type a few letters and jump to a project, a section or a link.
export function Palette({ items }: { items: PaletteItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const [at, setAt] = useState(0);

  const found = items.filter((x) => `${x.label} ${x.hint}`.toLowerCase().includes(q.trim().toLowerCase()));

  const open = () => {
    setQ("");
    setAt(0);
    dialog.current?.showModal();
  };

  const go = (item?: PaletteItem) => {
    if (!item) return;
    dialog.current?.close();
    if (item.href.startsWith("#")) location.hash = item.href;
    else window.open(item.href, "_blank", "noopener");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="flex items-center gap-3 rounded-full border border-white/15 px-4 py-2 text-sm transition hover:border-lima/60 focus-visible:outline-2 focus-visible:outline-lima"
      >
        <span className="opacity-70">Buscar</span>
        <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">Ctrl K</kbd>
      </button>

      <dialog
        ref={dialog}
        aria-label="Buscador de proyectos"
        className="mx-auto mt-[14dvh] w-[min(560px,92vw)] overflow-hidden rounded-2xl border border-white/15 bg-[#121316] p-0 text-hueso shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      >
        <label className="flex items-center gap-3 border-b border-white/10 px-4 font-mono">
          <span className="text-lima">&gt;</span>
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setAt(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setAt((n) => Math.min(n + 1, found.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setAt((n) => Math.max(n - 1, 0)); }
              if (e.key === "Enter") go(found[at]);
            }}
            placeholder="proyecto, tecnología o sección…"
            aria-label="Buscar"
            className="w-full bg-transparent py-4 text-sm outline-none placeholder:opacity-40"
          />
        </label>

        <ul className="max-h-[50dvh] overflow-y-auto p-2">
          {found.map((item, n) => (
            <li key={item.href + item.label}>
              <button
                type="button"
                onClick={() => go(item)}
                onMouseEnter={() => setAt(n)}
                aria-current={n === at}
                className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left text-sm aria-[current=true]:bg-lima aria-[current=true]:text-tinta"
              >
                <span className="truncate">{item.label}</span>
                <span className="shrink-0 font-mono text-xs opacity-60">{item.hint}</span>
              </button>
            </li>
          ))}
          {found.length === 0 && <li className="px-3 py-6 text-center text-sm opacity-50">Nada con “{q}”.</li>}
        </ul>

        <p className="border-t border-white/10 px-4 py-2 font-mono text-xs opacity-50">↑ ↓ para moverte · Enter para ir · Esc para cerrar</p>
      </dialog>
    </>
  );
}
