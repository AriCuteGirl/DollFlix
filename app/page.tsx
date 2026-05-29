"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowUp,
  Bell,
  Play,
  Plus,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { ContentRow } from "@/components/content-row";
import { PremiumVideoPlayer } from "@/components/premium-video-player";
import { SearchTakeover } from "@/components/search-takeover";
import { SettingsPanel } from "@/components/settings-panel";
import { ProfilePanel } from "@/components/profile-panel";
import { TitleDetailsModal } from "@/components/title-details-modal";
import {
  contentRows,
  heroTitle,
  type ContentRowData,
  type Title,
} from "@/lib/content";
import { defaultAvatar, themes, type ProfileAvatar, type ThemeId } from "@/lib/profile-settings";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"home" | "movies" | "collections">("home");
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [detailsTitle, setDetailsTitle] = useState<Title | null>(null);
  const [themeId, setThemeId] = useState<ThemeId>("red");
  const [avatar, setAvatar] = useState<ProfileAvatar>(defaultAvatar);
  const [rows, setRows] = useState<ContentRowData[]>(contentRows);
  const [selectedTitle, setSelectedTitle] = useState<Title>(
    contentRows[0].items[0],
  );
  const featured = useMemo(
    () => rows[0]?.items[0] ?? contentRows[0].items[0],
    [rows],
  );
  const displayedRows = useMemo(() => {
    if (activeTab === "collections") {
      return rows.filter((row) =>
        /(classic|pick|gem|collection|cabinet|porcelain)/i.test(row.title),
      );
    }

    return rows;
  }, [activeTab, rows]);

  useEffect(() => {
    let mounted = true;

    fetch("/api/tmdb")
      .then(
        (response) => response.json() as Promise<{ rows?: ContentRowData[] }>,
      )
      .then((data) => {
        const nextRows = data.rows?.filter((row) => row.items.length);
        if (mounted && nextRows?.length) {
          setRows(nextRows);
          setSelectedTitle(nextRows[0].items[0]);
        }
      })
      .catch(() => {
        setRows(contentRows);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("dollflix-theme") as ThemeId | null;
    const savedAvatar = localStorage.getItem("dollflix-avatar");

    if (savedTheme && savedTheme in themes) {
      setThemeId(savedTheme);
    }

    if (savedAvatar) {
      try {
        setAvatar(JSON.parse(savedAvatar) as ProfileAvatar);
      } catch {
        setAvatar(defaultAvatar);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dollflix-theme", themeId);
  }, [themeId]);

  useEffect(() => {
    localStorage.setItem("dollflix-avatar", JSON.stringify(avatar));
  }, [avatar]);

  function openPlayer(item: Title) {
    setSelectedTitle(item);
    setPlayerOpen(true);
  }

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-ink text-white"
      style={themes[themeId].vars as CSSProperties}
    >
      <ScrollProgress />
      <CustomCursor />
      <AuroraField />
      <Navbar
        onSearch={() => setSearchOpen(true)}
        onProfile={() => setProfileOpen(true)}
        onSettings={() => setSettingsOpen(true)}
        avatar={avatar}
        activeTab={activeTab}
        onTabSelect={(tab) => {
          setActiveTab(tab);
          if (tab === "home") {
            scrollTo({ top: 0, behavior: "smooth" });
          } else {
            document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />

      <section className="relative flex min-h-[92svh] items-end overflow-hidden px-4 pb-20 pt-28 sm:px-8 lg:px-12">
        <div className="absolute inset-0">
          <div
            className="h-full w-full scale-105 bg-cover bg-center"
            style={{ backgroundImage: `url(${featured.backdrop})` }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(255,214,232,.24),transparent_25%),radial-gradient(circle_at_72%_18%,rgba(159,91,255,.34),transparent_32%),linear-gradient(90deg,rgba(7,4,15,.96)_0%,rgba(32,13,31,.7)_42%,rgba(7,4,15,.12)_100%),linear-gradient(0deg,rgb(7,4,15)_0%,rgba(7,4,15,0)_42%)]" />
          <div className="dollhouse-grid absolute inset-0 opacity-35" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="relative z-10 max-w-4xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs uppercase tracking-[.22em] text-white/70 shadow-glass backdrop-blur-2xl">
            <span className="h-2 w-2 rounded-full bg-rose shadow-rose" />
            Porcelain Premiere
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[.88] tracking-normal text-white sm:text-7xl lg:text-8xl">
            {featured.title || heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
            {featured.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              featured.rating + " Match",
              featured.meta,
              ...featured.genres,
              "Velvet HDR",
            ]
              .slice(0, 5)
              .map((pill, index) => (
                <motion.span
                  key={pill}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.06 }}
                  className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-xl"
                >
                  {pill}
                </motion.span>
              ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => openPlayer(featured)}
              className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 py-3 font-bold text-black shadow-[0_0_42px_rgba(255,111,168,.45)] transition hover:scale-[1.03] active:scale-95"
              aria-label="Play now"
            >
              <Play className="h-5 w-5 fill-black transition group-hover:scale-110" />
              Play Now
            </button>
            <button className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/18 bg-white/8 px-6 py-3 font-bold text-white backdrop-blur-xl transition hover:border-white/35 hover:bg-white/14 active:scale-95">
              <Plus className="h-5 w-5" />
              Watchlist
            </button>
          </div>
        </motion.div>
      </section>

      <section id="catalog" className="relative z-10 space-y-12 pb-16">
        <DollAtelierStrip />
        {displayedRows.map((row) => (
          <ContentRow
            key={row.title}
            row={row}
            onPlay={openPlayer}
            onDetails={setDetailsTitle}
          />
        ))}
      </section>

      <button
        onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-white/12 bg-white/10 shadow-glass backdrop-blur-2xl transition hover:bg-white/18"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {playerOpen ? (
        <PremiumVideoPlayer
          title={selectedTitle.title}
          tmdbId={selectedTitle.tmdbId}
          onClose={() => setPlayerOpen(false)}
        />
      ) : null}
      <TitleDetailsModal
        item={detailsTitle}
        rows={rows}
        onClose={() => setDetailsTitle(null)}
        onPlay={(item) => {
          setDetailsTitle(null);
          openPlayer(item);
        }}
      />
      <SearchTakeover
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        rows={rows}
        onDetails={setDetailsTitle}
      />
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        themeId={themeId}
        themes={themes}
        onThemeChange={setThemeId}
        avatar={avatar}
        onAvatarChange={setAvatar}
      />
      <ProfilePanel
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        avatar={avatar}
        onAvatarChange={setAvatar}
        themeName={themes[themeId].name}
      />
    </main>
  );
}

function Navbar({
  onSearch,
  onProfile,
  onSettings,
  avatar,
  activeTab,
  onTabSelect,
}: {
  onSearch: () => void;
  onProfile: () => void;
  onSettings: () => void;
  avatar: ProfileAvatar;
  activeTab: "home" | "movies" | "collections";
  onTabSelect: (tab: "home" | "movies" | "collections") => void;
}) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 px-3 py-3 sm:px-6">
      <nav className="mx-auto flex h-16 max-w-[1680px] items-center justify-between rounded-full border border-white/10 bg-ink/42 px-4 shadow-glass backdrop-blur-2xl transition-all">
        <div className="flex items-center gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#fff1f7] via-rose to-violet shadow-glow">
            <span className="absolute h-5 w-5 rounded-full border border-black/25 bg-black/10" />
            <Sparkles className="relative h-5 w-5 text-black" />
          </div>
          <span className="text-lg font-black tracking-normal">DOLLFLIX</span>
        </div>
        <div className="hidden items-center gap-7 text-sm font-medium text-white/68 md:flex">
          {[
            ["Home", "home"],
            ["Movies", "movies"],
            ["Collections", "collections"],
          ].map(([label, tab]) => (
            <button
              key={tab}
              onClick={() => onTabSelect(tab as "home" | "movies" | "collections")}
              className={`transition hover:text-white ${activeTab === tab ? "text-white" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSearch}
            className="nav-icon"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button className="nav-icon relative" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose animate-pulseSoft" />
          </button>
          <button
            onClick={onSettings}
            className="nav-icon"
            aria-label="Open settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={onProfile}
            className="ml-1 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-white/25 to-white/5 ring-2 ring-violet/60"
            aria-label="Open profile"
          >
            {avatar.type === "image" ? (
              <Image src={avatar.value} alt="" width={40} height={40} unoptimized className="h-full w-full rounded-full object-cover" />
            ) : (
              <span className="text-sm font-black">{avatar.value}</span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}

function ScrollProgress() {
  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full origin-left scale-x-[.42] bg-gradient-to-r from-violet via-fuchsia to-rose" />
  );
}

function AuroraField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
    >
      <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#ffd6e8]/18 blur-3xl" />
      <div className="absolute right-0 top-52 h-[34rem] w-[34rem] rounded-full bg-fuchsia/16 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-rose/16 blur-3xl" />
    </div>
  );
}

function CustomCursor() {
  return (
    <div className="pointer-events-none fixed left-1/2 top-1/2 z-50 hidden h-8 w-8 rounded-full border border-white/25 bg-violet/10 blur-[1px] lg:block" />
  );
}

function DollAtelierStrip() {
  return (
    <section className="relative mx-4 overflow-hidden rounded-3xl border border-white/10 bg-white/[.055] p-5 shadow-glass backdrop-blur-2xl sm:mx-8 lg:mx-12">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,214,232,.08),transparent_38%,rgba(159,91,255,.12))]" />
      <div className="relative grid gap-4 md:grid-cols-4">
        {[
          [
            "Porcelain Curation",
            "Elegant picks with a strange little heartbeat.",
          ],
          [
            "Velvet Cabinet",
            "Rows behave like display shelves, built for browsing.",
          ],
          [
            "Ribbon Watchlist",
            "Save titles into a softer, more collectible queue.",
          ],
          [
            "TMDB Powered",
            "Live movie metadata loads server-side when available.",
          ],
        ].map(([title, copy]) => (
          <article
            key={title}
            className="rounded-2xl border border-white/10 bg-black/18 p-4"
          >
            <div className="mb-3 h-1.5 w-14 rounded-full bg-gradient-to-r from-[#ffd6e8] to-rose" />
            <h2 className="font-black">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/58">{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
