"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info, Play, Plus, Share2 } from "lucide-react";
import type { ContentRowData, Title } from "@/lib/content";

export function ContentRow({
  row,
  onPlay,
  onDetails
}: {
  row: ContentRowData;
  onPlay: (item: Title) => void;
  onDetails: (item: Title) => void;
}) {
  return (
    <section className="relative px-4 sm:px-8 lg:px-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold sm:text-2xl">{row.title}</h2>
        <button className="group text-sm font-semibold text-white/58 transition hover:text-white">
          See All <span className="inline-block transition group-hover:translate-x-1">→</span>
        </button>
      </div>
      <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-4 [scroll-padding:1rem]">
        {row.items.map((item) => (
          <ContentCard key={item.id} item={item} onPlay={onPlay} onDetails={onDetails} />
        ))}
      </div>
    </section>
  );
}

function ContentCard({ item, onPlay, onDetails }: { item: Title; onPlay: (item: Title) => void; onDetails: (item: Title) => void }) {
  const [hovered, setHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    if (!hovered || !item.tmdbId || trailerKey) return;

    fetch(`/api/tmdb/videos?id=${item.tmdbId}`)
      .then((response) => response.json() as Promise<{ trailerKey?: string | null }>)
      .then((data) => setTrailerKey(data.trailerKey ?? null))
      .catch(() => setTrailerKey(null));
  }, [hovered, item.tmdbId, trailerKey]);

  function action(event: MouseEvent, callback: () => void) {
    event.stopPropagation();
    callback();
  }

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onDetails(item)}
      className="group relative h-[15.5rem] w-[11rem] shrink-0 snap-start cursor-pointer overflow-hidden rounded-lg sm:h-[18rem] sm:w-[13rem]"
      aria-label={`Open details for ${item.title}`}
    >
      <div className="skeleton absolute inset-0 overflow-hidden rounded-lg bg-white/5" />
      <motion.img
        src={item.poster}
        alt=""
        loading="lazy"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 h-full w-full rounded-lg object-cover shadow-[0_18px_40px_rgba(0,0,0,.38)] transition duration-300 group-hover:scale-[1.045] group-hover:shadow-glow"
      />
      {hovered && trailerKey ? (
        <iframe
          className="absolute inset-0 z-20 h-full w-full scale-125 border-0 opacity-80"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&playsinline=1&modestbranding=1`}
          title={`${item.title} trailer preview`}
          allow="autoplay; encrypted-media"
        />
      ) : null}
      {item.progress ? (
        <div className="absolute bottom-0 left-0 z-30 h-1 rounded-full bg-gradient-to-r from-violet to-rose" style={{ width: `${item.progress}%` }} />
      ) : null}
      <AnimatePresence>
        {hovered ? (
          <QuickPreview
            item={item}
            onPlay={(event) => action(event, () => onPlay(item))}
            onDetails={(event) => action(event, () => onDetails(item))}
          />
        ) : null}
      </AnimatePresence>
    </article>
  );
}

function QuickPreview({
  item,
  onPlay,
  onDetails
}: {
  item: Title;
  onPlay: (event: MouseEvent) => void;
  onDetails: (event: MouseEvent) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-x-0 bottom-0 z-30 bg-[linear-gradient(0deg,rgba(7,4,15,.96),rgba(7,4,15,.78)_68%,transparent)] p-3 pt-16"
    >
      <div className="space-y-2">
        <div>
          <h3 className="line-clamp-1 text-sm font-black">{item.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/62">{item.description}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-emerald-200">{item.rating} Match</span>
          <span className="rounded-full bg-white/10 px-2 py-1">{item.runtime}</span>
          {item.genres.slice(0, 1).map((genre) => (
            <span key={genre} className="rounded-full bg-white/10 px-2 py-1">{genre}</span>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={onPlay} className="grid h-10 w-10 place-items-center rounded-full bg-white text-black transition active:scale-95" aria-label="Play">
            <Play className="h-4 w-4 fill-black" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/18" aria-label="Add to list">
            <Plus className="h-4 w-4" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/18" aria-label="Share">
            <Share2 className="h-4 w-4" />
          </button>
          <button onClick={onDetails} className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/18" aria-label="Details">
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
