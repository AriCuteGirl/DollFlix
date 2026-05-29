"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, Gauge, ImagePlus, Moon, Palette, Shield, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import type { ProfileAvatar, ThemeId, themes } from "@/lib/profile-settings";

type SettingsPanelProps = {
  open: boolean;
  onClose: () => void;
  themeId: ThemeId;
  themes: typeof themes;
  onThemeChange: (theme: ThemeId) => void;
  avatar: ProfileAvatar;
  onAvatarChange: (avatar: ProfileAvatar) => void;
};

const avatarPresets = ["P", "D", "♡", "✦", "R", "V"];

export function SettingsPanel({
  open,
  onClose,
  themeId,
  themes,
  onThemeChange,
  avatar,
  onAvatarChange,
}: SettingsPanelProps) {
  function uploadAvatar(file: File | undefined) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onAvatarChange({ type: "image", value: reader.result });
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => (!next ? onClose() : null)}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/68 backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 22, scale: 0.98 }}
                className="fixed inset-x-3 top-5 z-50 mx-auto max-h-[92svh] max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-panel/88 shadow-glass backdrop-blur-2xl outline-none"
              >
                <div className="grid max-h-[92svh] overflow-hidden lg:grid-cols-[18rem_1fr]">
                  <aside className="border-b border-white/10 bg-black/18 p-5 lg:border-b-0 lg:border-r">
                    <div className="flex items-center justify-between">
                      <div>
                        <Dialog.Title className="text-2xl font-black">Settings</Dialog.Title>
                        <p className="mt-1 text-sm text-white/46">Pretty Doll control room</p>
                      </div>
                      <Dialog.Close asChild>
                        <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10" aria-label="Close settings">
                          <X className="h-5 w-5" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="mt-8 flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[.055] p-4">
                      <AvatarPreview avatar={avatar} />
                      <div>
                        <h2 className="font-black">Pretty Doll</h2>
                        <p className="text-sm text-white/50">{themes[themeId].name}</p>
                      </div>
                    </div>

                    <nav className="mt-6 space-y-2 text-sm text-white/68">
                      {[
                        [Palette, "Theme"],
                        [ImagePlus, "Profile"],
                        [SlidersHorizontal, "Playback"],
                        [Shield, "Privacy"],
                      ].map(([Icon, label]) => (
                        <button key={label as string} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-white/10 hover:text-white">
                          <Icon className="h-4 w-4" />
                          {label as string}
                        </button>
                      ))}
                    </nav>
                  </aside>

                  <div className="overflow-y-auto p-5 sm:p-8">
                    <section className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgb(var(--rose)/.22),transparent_34%),rgba(255,255,255,.055)] p-5 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-black">Theme</h2>
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/58">
                            Default is Dollflix Red. Pick a cabinet accent and the whole interface updates instantly.
                          </p>
                        </div>
                        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/70">Default user</span>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {(Object.keys(themes) as ThemeId[]).map((id) => (
                          <button
                            key={id}
                            onClick={() => onThemeChange(id)}
                            className={`rounded-2xl border p-4 text-left transition ${
                              themeId === id ? "border-white/40 bg-white/14 shadow-glow" : "border-white/10 bg-black/18 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <ThemeSwatch vars={themes[id].vars} />
                              {themeId === id ? <Check className="h-4 w-4 text-white" /> : null}
                            </div>
                            <h3 className="mt-4 font-black">{themes[id].name}</h3>
                            <p className="mt-1 text-xs text-white/48">Accent preset</p>
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="mt-5 grid gap-5 lg:grid-cols-[.85fr_1fr]">
                      <div className="rounded-3xl border border-white/10 bg-white/[.055] p-5">
                        <h2 className="flex items-center gap-2 text-xl font-black">
                          <ImagePlus className="h-5 w-5 text-rose" />
                          Profile Picture
                        </h2>
                        <div className="mt-5 flex items-center gap-4">
                          <AvatarPreview avatar={avatar} large />
                          <div className="min-w-0">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition active:scale-95">
                              Upload image
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => uploadAvatar(event.target.files?.[0])}
                              />
                            </label>
                            <p className="mt-3 text-sm text-white/48">Saved locally in this browser.</p>
                          </div>
                        </div>
                        <div className="mt-5 grid grid-cols-6 gap-2">
                          {avatarPresets.map((preset) => (
                            <button
                              key={preset}
                              onClick={() => onAvatarChange({ type: "preset", value: preset })}
                              className="grid h-11 place-items-center rounded-full border border-white/10 bg-white/[.06] font-black transition hover:bg-white/12"
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <SettingToggle icon={<Moon className="h-4 w-4" />} label="Ambient glow" defaultChecked />
                        <SettingToggle icon={<Bell className="h-4 w-4" />} label="New movie alerts" defaultChecked />
                        <SettingToggle icon={<Gauge className="h-4 w-4" />} label="Autoplay previews" defaultChecked />
                        <SettingToggle icon={<Shield className="h-4 w-4" />} label="Private profile" />
                      </div>
                    </section>

                    <section className="mt-5 rounded-3xl border border-white/10 bg-white/[.055] p-5">
                      <h2 className="text-xl font-black">Playback Quality</h2>
                      <div className="mt-4 grid gap-3 sm:grid-cols-4">
                        {["Auto", "4K", "1080p", "720p"].map((quality, index) => (
                          <button
                            key={quality}
                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-left transition hover:border-white/24 hover:bg-white/10"
                          >
                            {quality}
                            {index === 0 ? <Check className="h-4 w-4 text-rose" /> : null}
                          </button>
                        ))}
                      </div>
                    </section>
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

function AvatarPreview({ avatar, large = false }: { avatar: ProfileAvatar; large?: boolean }) {
  return (
    <div className={`${large ? "h-24 w-24" : "h-16 w-16"} grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-white via-rose to-violet p-1 shadow-glow`}>
      <div className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-ink">
        {avatar.type === "image" ? (
          <Image src={avatar.value} alt="" width={large ? 96 : 64} height={large ? 96 : 64} unoptimized className="h-full w-full object-cover" />
        ) : (
          <span className={`${large ? "text-3xl" : "text-xl"} font-black`}>{avatar.value}</span>
        )}
      </div>
    </div>
  );
}

function ThemeSwatch({ vars }: { vars: Record<string, string> }) {
  return (
    <div
      className="h-10 w-16 rounded-full border border-white/14"
      style={{
        background: `linear-gradient(135deg, rgb(${vars["--violet"]}), rgb(${vars["--rose"]}))`,
      }}
    />
  );
}

function SettingToggle({ icon, label, defaultChecked = false }: { icon: React.ReactNode; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[.055] p-5">
      <span className="flex items-center gap-3 font-semibold">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-rose">{icon}</span>
        {label}
      </span>
      <Switch.Root defaultChecked={defaultChecked} className="relative h-7 w-12 rounded-full bg-white/14 data-[state=checked]:bg-rose">
        <Switch.Thumb className="block h-6 w-6 translate-x-0.5 rounded-full bg-white transition data-[state=checked]:translate-x-[1.35rem]" />
      </Switch.Root>
    </label>
  );
}
