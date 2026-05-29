"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Clock, Heart, X } from "lucide-react";
import Image from "next/image";
import { contentRows } from "@/lib/content";
import type { ProfileAvatar } from "@/lib/profile-settings";

const avatarPresets = ["P", "D", "♡", "✦", "R", "V"];

export function ProfilePanel({
  open,
  onClose,
  avatar,
  onAvatarChange,
  themeName,
}: {
  open: boolean;
  onClose: () => void;
  avatar: ProfileAvatar;
  onAvatarChange: (avatar: ProfileAvatar) => void;
  themeName: string;
}) {
  const items = contentRows[1].items.slice(0, 4);

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
              <motion.div className="fixed inset-0 z-50 bg-black/62 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 240 }}
                className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-xl overflow-y-auto border-l border-white/10 bg-panel/82 p-6 shadow-glass backdrop-blur-2xl outline-none"
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-2xl font-black">Profile</Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10" aria-label="Close profile">
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgb(var(--rose)/.22),transparent_34%),rgba(255,255,255,.055)] p-5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar avatar={avatar} />
                      <label className="absolute bottom-0 right-0 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white text-black shadow-glow">
                        <Camera className="h-4 w-4" />
                        <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadAvatar(event.target.files?.[0])} />
                      </label>
                    </div>
                    <div>
                      <h2 className="text-xl font-black">Pretty Doll</h2>
                      <p className="text-white/55">{themeName} • Movie cabinet</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {avatarPresets.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => onAvatarChange({ type: "preset", value: preset })}
                        className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[.07] font-black transition hover:bg-white/14"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  {["Watchlist", "Continue", "Liked"].map((label) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/[.06] p-4 text-center">
                      <div className="text-2xl font-black">24</div>
                      <div className="text-xs text-white/52">{label}</div>
                    </div>
                  ))}
                </div>

                <section className="mt-8">
                  <h3 className="mb-4 flex items-center gap-2 font-bold"><Clock className="h-4 w-4" /> Watch History</h3>
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <article key={item.id} className="relative rounded-2xl border border-white/8 bg-white/[.05] p-4 pl-8">
                        <span className="absolute left-3 top-5 h-3 w-3 rounded-full bg-rose shadow-rose" />
                        <h4 className="font-bold">{item.title}</h4>
                        <p className="text-sm text-white/52">{index + 1} days ago • {item.progress}% watched</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="mt-8">
                  <h3 className="mb-4 flex items-center gap-2 font-bold"><Heart className="h-4 w-4" /> Theme Accent</h3>
                  <div className="rounded-2xl border border-white/8 bg-white/[.05] p-4 text-sm text-white/60">
                    Current theme: <span className="font-bold text-white">{themeName}</span>
                  </div>
                </section>
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function Avatar({ avatar }: { avatar: ProfileAvatar }) {
  return (
    <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-white via-rose to-violet p-1 shadow-glow">
      <div className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-ink">
        {avatar.type === "image" ? (
          <Image src={avatar.value} alt="" width={96} height={96} unoptimized className="h-full w-full object-cover" />
        ) : (
          <span className="text-3xl font-black">{avatar.value}</span>
        )}
      </div>
    </div>
  );
}
