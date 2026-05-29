"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info, Play, Plus, Share2 } from "lucide-react";
import type { ContentRowData, Title } from "@/lib/content";

export function ContentRow({
  row,
  onPlay,
  onDetails,
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
          See All{" "}
          <span className="inline-block transition group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
      <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-4 [scroll-padding:1rem]">
        {row.items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            onPlay={onPlay}
            onDetails={onDetails}
          />
        ))}
      </div>
    </section>
  );
}

function ContentCard({
  item,
  onPlay,
  onDetails,
}: {
  item: Title;
  onPlay: (item: Title) => void;
  onDetails: (item: Title) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLElement>(null);
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hovered || !item.tmdbId || trailerKey) return;
    fetch(`/api/tmdb/videos?id=${item.tmdbId}`)
      .then((r) => r.json() as Promise<{ trailerKey?: string | null }>)
      .then((d) => setTrailerKey(d.trailerKey ?? null))
      .catch(() => setTrailerKey(null));
  }, [hovered, item.tmdbId, trailerKey]);

  function handleMouseEnter() {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    if (cardRef.current) setCardRect(cardRef.current.getBoundingClientRect());
    enterTimerRef.current = setTimeout(() => setHovered(true), 400);
  }

  function handleMouseLeave() {
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    leaveTimerRef.current = setTimeout(() => setHovered(false), 120);
  }

  function handleHoverCardEnter() {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
  }

  function handleHoverCardLeave() {
    leaveTimerRef.current = setTimeout(() => setHovered(false), 120);
  }

  function action(event: MouseEvent, callback: () => void) {
    event.stopPropagation();
    callback();
  }

  return (
    <>
      <article
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onDetails(item)}
        className="group relative h-[15.5rem] w-[11rem] shrink-0 snap-start cursor-pointer overflow-hidden rounded-xl sm:h-[18rem] sm:w-[13rem]"
        aria-label={`Open details for ${item.title}`}
      >
        <div className="skeleton absolute inset-0 overflow-hidden rounded-xl bg-white/5" />
        <motion.img
          src={item.poster}
          alt=""
          loading="lazy"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative z-10 h-full w-full rounded-xl object-cover shadow-[0_18px_40px_rgba(0,0,0,.38)] transition duration-300"
        />
        {item.progress ? (
          <div
            className="absolute bottom-0 left-0 z-30 h-1 rounded-full bg-gradient-to-r from-violet to-rose"
            style={{ width: `${item.progress}%` }}
          />
        ) : null}
      </article>

      <AnimatePresence>
        {hovered && cardRect ? (
          <HoverCard
            item={item}
            trailerKey={trailerKey}
            cardRect={cardRect}
            onMouseEnter={handleHoverCardEnter}
            onMouseLeave={handleHoverCardLeave}
            onPlay={(e) => action(e, () => onPlay(item))}
            onDetails={(e) => action(e, () => onDetails(item))}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

function HoverCard({
  item,
  trailerKey,
  cardRect,
  onMouseEnter,
  onMouseLeave,
  onPlay,
  onDetails,
}: {
  item: Title;
  trailerKey: string | null;
  cardRect: DOMRect;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onPlay: (e: MouseEvent) => void;
  onDetails: (e: MouseEvent) => void;
}) {
  const expandedWidth = 320;
  const centerX = cardRect.left + cardRect.width / 2;
  let left = centerX - expandedWidth / 2;
  const viewportWidth = window.innerWidth;
  if (left < 16) left = 16;
  if (left + expandedWidth > viewportWidth - 16)
    left = viewportWidth - expandedWidth - 16;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: 10 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "fixed",
        top: cardRect.top - 20,
        left,
        width: expandedWidth,
        zIndex: 9999,
      }}
      className="pointer-events-auto overflow-hidden rounded-2xl border border-white/12 bg-[#0c0818] shadow-[0_32px_80px_rgba(0,0,0,.72)]"
    >
      <div className="relative h-44 w-full overflow-hidden bg-black">
        {trailerKey ? (
          <iframe
            className="absolute inset-0 h-full w-full border-0 pointer-events-none"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&showinfo=0`}
            title={`${item.title} trailer`}
            allow="autoplay; encrypted-media"
          />
        ) : (
          <img
            src={item.backdrop}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0818] via-transparent to-transparent" />
      </div>

      <div className="p-4 pt-2">
        <h3 className="text-base font-black leading-tight">{item.title}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-emerald-200">
            {item.rating} Match
          </span>
          <span className="rounded-full bg-white/10 px-2 py-1">
            {item.meta}
          </span>
          <span className="rounded-full bg-white/10 px-2 py-1">
            {item.runtime}
          </span>
          {item.genres.slice(0, 2).map((g) => (
            <span key={g} className="rounded-full bg-white/10 px-2 py-1">
              {g}
            </span>
          ))}
        </div>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/58">
          {item.description}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={onPlay}
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-black transition active:scale-95 hover:bg-white/90"
            aria-label="Play"
          >
            <Play className="h-4 w-4 fill-black" />
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/18"
            aria-label="Add"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/18"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDetails}
            className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/18"
            aria-label="Details"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
