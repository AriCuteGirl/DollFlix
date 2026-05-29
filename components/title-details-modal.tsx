"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Plus, Share2, Sparkles, X } from "lucide-react";
import Image from "next/image";
import type { ContentRowData, Title } from "@/lib/content";

export function TitleDetailsModal({
  item,
  rows,
  onClose,
  onPlay,
}: {
  item: Title | null;
  rows: ContentRowData[];
  onClose: () => void;
  onPlay: (item: Title) => void;
}) {
  const similar = rows
    .flatMap((row) => row.items)
    .filter((candidate) => candidate.id !== item?.id)
    .slice(0, 8);

  return (
    <Dialog.Root
      open={Boolean(item)}
      onOpenChange={(open) => (!open ? onClose() : null)}
    >
      <AnimatePresence>
        {item ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 28, scale: 0.97 }}
                className="fixed inset-x-3 top-5 z-[61] mx-auto max-h-[92svh] max-w-5xl overflow-y-auto rounded-3xl border border-white/12 bg-panel/86 shadow-glass backdrop-blur-2xl outline-none"
              >
                <div className="relative min-h-80 overflow-hidden">
                  <Image
                    src={item.backdrop}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,4,15,.92),rgba(7,4,15,.34)_52%,rgba(7,4,15,.1)),linear-gradient(0deg,rgb(20,14,34),transparent_55%)]" />
                  <Dialog.Close asChild>
                    <button
                      className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-black/35 backdrop-blur-xl transition hover:bg-white/14"
                      aria-label="Close details"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                  <div className="absolute bottom-0 left-0 max-w-2xl p-5 sm:p-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-2 text-xs uppercase tracking-[.18em] text-white/72 backdrop-blur-xl">
                      <Sparkles className="h-3.5 w-3.5 text-rose" />
                      Cabinet Detail
                    </div>
                    <Dialog.Title className="text-4xl font-black leading-none sm:text-6xl">
                      {item.title}
                    </Dialog.Title>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-white/72 sm:text-base">
                      {item.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {[
                        item.rating + " Match",
                        item.meta,
                        item.runtime,
                        ...item.genres,
                      ].map((pill) => (
                        <span
                          key={pill}
                          className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-xs text-white/78 backdrop-blur-xl"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_.45fr]">
                  <section>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => onPlay(item)}
                        className="inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-5 py-3 font-bold text-black transition hover:scale-[1.02] active:scale-95"
                      >
                        <Play className="h-5 w-5 fill-black" />
                        Play Preview
                      </button>
                      <button className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/14 bg-white/8 px-5 py-3 font-bold backdrop-blur-xl transition hover:bg-white/14">
                        <Plus className="h-5 w-5" />
                        Add
                      </button>
                      <button
                        className="grid min-h-12 w-12 place-items-center rounded-full border border-white/14 bg-white/8 backdrop-blur-xl transition hover:bg-white/14"
                        aria-label="Share"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>

                    <h3 className="mt-8 text-lg font-black">Similar Titles</h3>
                    <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-2">
                      {similar.map((candidate) => (
                        <button
                          key={candidate.id}
                          onClick={() => onPlay(candidate)}
                          className="w-32 shrink-0 text-left"
                        >
                          <Image
                            src={candidate.poster}
                            alt=""
                            width={128}
                            height={190}
                            className="h-48 w-32 rounded-lg object-cover"
                          />
                          <span className="mt-2 block truncate text-sm font-semibold text-white/78">
                            {candidate.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <aside className="space-y-3">
                    <InfoBlock
                      label="Cast"
                      value="Porcelain ensemble, velvet leads, music-box cameos"
                    />
                    <InfoBlock
                      label="Mood"
                      value="Dollhouse noir, eerie glamour, premium midnight cinema"
                    />
                    <InfoBlock
                      label="Source"
                      value={
                        item.tmdbId
                          ? `TMDB #${item.tmdbId}`
                          : "Dollflix mock cabinet"
                      }
                    />
                  </aside>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[.05] p-4">
      <div className="text-xs font-bold uppercase tracking-[.18em] text-white/38">
        {label}
      </div>
      <div className="mt-2 text-sm leading-6 text-white/68">{value}</div>
    </div>
  );
}
