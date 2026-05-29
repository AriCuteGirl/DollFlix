"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

export function PremiumVideoPlayer({
  title,
  onClose,
  tmdbId,
}: {
  title: string;
  onClose: () => void;
  tmdbId?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black"
      aria-label="Video player"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 backdrop-blur-xl text-white"
        aria-label="Close player"
      >
        <X className="h-5 w-5" />
      </button>
      {tmdbId ? (
        <iframe
          src={`https://vidsrc.fyi/embed/movie/${tmdbId}`}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          allow="autoplay; fullscreen"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
          No source available
        </div>
      )}
    </motion.section>
  );
}
