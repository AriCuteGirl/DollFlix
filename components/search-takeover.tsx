"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { contentRows, type ContentRowData, type Title } from "@/lib/content";

export function SearchTakeover({
  open,
  onClose,
  rows = contentRows,
  onDetails,
}: {
  open: boolean;
  onClose: () => void;
  rows?: ContentRowData[];
  onDetails?: (item: Title) => void;
}) {
  const [query, setQuery] = useState("");
  const [remoteResults, setRemoteResults] = useState<Title[]>([]);
  const [loading, setLoading] = useState(false);
  const all = useMemo(() => rows.flatMap((row) => row.items), [rows]);
  const localResults = all
    .filter((item) => {
      const normalized = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized) ||
        item.genres.some((genre) => genre.toLowerCase().includes(normalized))
      );
    })
    .slice(0, 8);
  const results = useMemo(() => {
    const seen = new Set<string>();
    return [...localResults, ...remoteResults]
      .filter((item) => {
        const key = String(item.tmdbId ?? item.id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 16);
  }, [localResults, remoteResults]);

  useEffect(() => {
    if (!open) return;
    if (query.trim().length < 2) {
      setRemoteResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setLoading(true);
      fetch(`/api/tmdb/search?q=${encodeURIComponent(query.trim())}`, {
        signal: controller.signal,
      })
        .then((response) => response.json() as Promise<{ results?: Title[] }>)
        .then((data) => setRemoteResults(data.results ?? []))
        .catch(() => {
          if (!controller.signal.aborted) setRemoteResults([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 220);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [open, query]);

  function selectItem(item: Title) {
    onDetails?.(item);
    onClose();
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => (!next ? onClose() : null)}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                className="fixed inset-x-4 top-6 z-50 mx-auto max-w-6xl outline-none"
              >
                <div className="glass min-h-[82svh] rounded-3xl p-4 sm:p-8">
                  <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-5 py-4">
                    <Search className="h-5 w-5 text-white/55" />
                    <input
                      autoFocus
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search movies in the Dollflix cabinet"
                      className="w-full bg-transparent text-lg outline-none placeholder:text-white/35"
                    />
                    <Dialog.Close asChild>
                      <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10" aria-label="Close search">
                        <X className="h-5 w-5" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_.55fr]">
                    <section>
                      <h2 className="mb-4 text-sm font-bold uppercase tracking-[.18em] text-white/45">
                        {query ? (loading ? "Searching" : "Movie Results") : "Trending Searches"}
                      </h2>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(query ? results : all.slice(0, 6)).map((item) => (
                          <button
                            key={item.id}
                            onClick={() => selectItem(item)}
                            className="flex gap-4 rounded-2xl border border-white/8 bg-white/[.06] p-3 text-left transition hover:bg-white/10"
                          >
                            <Image src={item.poster} alt="" width={64} height={96} className="h-24 w-16 rounded-md object-cover" />
                            <div className="min-w-0">
                              <h3 className="truncate font-bold">{item.title}</h3>
                              <p className="mt-1 text-sm text-white/52">{item.meta}</p>
                              <p className="mt-2 line-clamp-2 text-sm text-white/64">{item.description}</p>
                            </div>
                          </button>
                        ))}
                        {query && !loading && results.length === 0 ? (
                          <div className="rounded-2xl border border-white/8 bg-white/[.05] p-5 text-sm text-white/58 sm:col-span-2">
                            No movie matches found.
                          </div>
                        ) : null}
                      </div>
                    </section>
                    <aside className="space-y-5">
                      {["Movies", "Dollhouse Picks", "Collections"].map((group) => (
                        <div key={group} className="rounded-2xl border border-white/8 bg-white/[.05] p-4">
                          <h3 className="font-bold">{group}</h3>
                          <p className="mt-2 text-sm text-white/52">Search now checks the visible cabinet and TMDB movie results.</p>
                        </div>
                      ))}
                    </aside>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
