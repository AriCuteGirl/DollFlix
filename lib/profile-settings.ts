export type ThemeId = "red" | "rose" | "violet" | "blue";

export type ProfileAvatar = {
  type: "preset" | "image";
  value: string;
};

export const themes: Record<ThemeId, { name: string; vars: Record<string, string> }> = {
  red: {
    name: "Dollflix Red",
    vars: {
      "--violet": "229 9 20",
      "--fuchsia": "255 42 76",
      "--rose": "229 9 20",
      "--aurora": "255 186 186",
    },
  },
  rose: {
    name: "Porcelain Rose",
    vars: {
      "--violet": "255 111 168",
      "--fuchsia": "232 74 255",
      "--rose": "255 111 168",
      "--aurora": "255 214 232",
    },
  },
  violet: {
    name: "Velvet Violet",
    vars: {
      "--violet": "159 91 255",
      "--fuchsia": "232 74 255",
      "--rose": "255 111 168",
      "--aurora": "63 220 255",
    },
  },
  blue: {
    name: "Glass Blue",
    vars: {
      "--violet": "58 134 255",
      "--fuchsia": "63 220 255",
      "--rose": "112 214 255",
      "--aurora": "63 220 255",
    },
  },
};

export const defaultAvatar: ProfileAvatar = { type: "preset", value: "P" };
