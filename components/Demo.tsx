"use client";

import { useRef, useState } from "react";

// Opens the project's live site inside the portfolio instead of a screenshot.
export function Demo({ url, title }: { url: string; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          dialog.current?.showModal();
        }}
        className="rounded-full bg-lima px-4 py-2 text-sm font-medium text-tinta transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hueso"
      >
        ▶ Probar aquí
      </button>

      <dialog
        ref={dialog}
        onClose={() => {
          setOpen(false);
          setReady(false);
        }}
        aria-label={`Demo en vivo de ${title}`}
        className="m-auto h-[88dvh] w-[min(1100px,94vw)] overflow-hidden rounded-2xl border border-white/15 bg-tinta p-0 text-hueso backdrop:bg-black/75 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-12 items-center gap-4 border-b border-white/10 px-4 text-sm">
          <span className="truncate font-mono">{title}</span>
          <a href={url} target="_blank" rel="noreferrer" className="ml-auto shrink-0 opacity-70 hover:opacity-100">
            Abrir en pestaña ↗
          </a>
          <form method="dialog">
            <button className="rounded-full border border-white/20 px-3 py-1 hover:border-white/60">Cerrar</button>
          </form>
        </div>
        {/* only loads the site once the dialog is opened */}
        <div className="relative grid h-[calc(100%-3rem)] place-items-center">
          {/* some demos take a few seconds to wake up */}
          {!ready && <p className="font-mono text-sm opacity-60">Cargando demo…</p>}
          {open && (
            <iframe
              src={url}
              title={`Demo de ${title}`}
              onLoad={() => setReady(true)}
              className={`absolute inset-0 size-full ${ready ? "bg-white" : "opacity-0"}`}
            />
          )}
        </div>
      </dialog>
    </>
  );
}
