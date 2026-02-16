import { ThemeConfig, AnimationType } from './types.ts';

// Comprehensive theme definitions for various milestones
export const THEMES: Record<number, ThemeConfig> = {
  0: {
    name: "Sunrise Savanna",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    accent: "#FBBF24",
    text: "text-white",
    secondaryText: "text-orange-950",
    animationType: AnimationType.FALL,
    elements: ["🦒", "🐘", "☀️", "🌳"]
  },
  50: {
    name: "Golden Hour",
    gradient: "from-orange-600 via-red-500 to-amber-400",
    accent: "#ef4444",
    text: "text-white",
    secondaryText: "text-orange-100",
    animationType: AnimationType.BOUNCE,
    elements: ["🌅", "🦓", "🔥", "🌾"]
  },
  100: {
    name: "Village Gathering",
    gradient: "from-amber-800 via-stone-700 to-stone-900",
    accent: "#686158",
    text: "text-stone-100",
    secondaryText: "text-amber-400",
    animationType: AnimationType.SLIDE,
    elements: ["🗺️", "🏠", "📍", "🛖", "🥁"]
  },
  150: {
    name: "Baobab Shade",
    gradient: "from-green-800 via-emerald-900 to-stone-900",
    accent: "#10b981",
    text: "text-green-50",
    secondaryText: "text-green-400",
    animationType: AnimationType.WAVE,
    elements: ["🌳", "🍃", "🐒", "🦎"]
  },
  200: {
    name: "Breaking Ground",
    gradient: "from-teal-600 via-emerald-700 to-emerald-900",
    accent: "#10B981",
    text: "text-white",
    secondaryText: "text-teal-200",
    animationType: AnimationType.POP,
    elements: ["🔨", "🏫", "🏗️", "📐", "🧱"]
  },
  250: {
    name: "Construction Joy",
    gradient: "from-sky-500 via-teal-500 to-emerald-600",
    accent: "#fef08a",
    text: "text-white",
    secondaryText: "text-sky-100",
    animationType: AnimationType.ZOOM,
    elements: ["👷", "🚧", "📦", "🪚"]
  },
  300: {
    name: "Jungle Growth",
    gradient: "from-green-700 via-green-900 to-black",
    accent: "#059669",
    text: "text-lime-200",
    secondaryText: "text-green-400",
    animationType: AnimationType.ROTATE,
    elements: ["🍃", "🐒", "🦜", "🌿", "🐍"]
  },
  350: {
    name: "Deep Forest",
    gradient: "from-emerald-950 via-green-900 to-emerald-900",
    accent: "#34d399",
    text: "text-emerald-100",
    secondaryText: "text-emerald-500",
    animationType: AnimationType.BLUR,
    elements: ["🦋", "🐸", "🌺", "🍄"]
  },
  400: {
    name: "Great River Flow",
    gradient: "from-blue-500 via-blue-700 to-indigo-900",
    accent: "#3B82F6",
    text: "text-white",
    secondaryText: "text-blue-300",
    animationType: AnimationType.WAVE,
    elements: ["🌊", "🌈", "🐟", "💧", "🛶"]
  },
  450: {
    name: "Delta Spirit",
    gradient: "from-cyan-600 via-blue-800 to-indigo-950",
    accent: "#7dd3fc",
    text: "text-white",
    secondaryText: "text-cyan-200",
    animationType: AnimationType.SPIRAL,
    elements: ["🐊", "🐚", "🌴", "🚤"]
  },
  500: {
    name: "Open Heavens",
    gradient: "from-indigo-950 via-purple-900 to-black",
    accent: "#FCD34D",
    text: "text-yellow-200",
    secondaryText: "text-indigo-400",
    animationType: AnimationType.CELEBRATE,
    elements: ["✨", "🌙", "🦉", "⭐", "🔭"]
  },
  550: {
    name: "Midnight Glow",
    gradient: "from-black via-slate-900 to-purple-950",
    accent: "#818cf8",
    text: "text-purple-100",
    secondaryText: "text-purple-400",
    animationType: AnimationType.FALL,
    elements: ["🦇", "🌑", "🔮", "🕯️"]
  },
  600: {
    name: "Vibrant Market",
    gradient: "from-rose-600 via-red-700 to-orange-800",
    accent: "#FFFFFF",
    text: "text-white",
    secondaryText: "text-rose-200",
    animationType: AnimationType.WAVE,
    elements: ["🍎", "🧺", "👗", "🥁", "🍍"]
  },
  650: {
    name: "Bazaar Lights",
    gradient: "from-pink-600 via-rose-700 to-amber-900",
    accent: "#fbcfe8",
    text: "text-pink-50",
    secondaryText: "text-pink-300",
    animationType: AnimationType.BOUNCE,
    elements: ["🪔", "🥖", "🌶️", "🧶"]
  },
  700: {
    name: "Mountain Majesty",
    gradient: "from-slate-100 via-slate-400 to-slate-700",
    accent: "#1F2937",
    text: "text-slate-900",
    secondaryText: "text-slate-600",
    animationType: AnimationType.SLIDE,
    elements: ["🏔️", "❄️", "🦅", "☁️", "🎿"]
  },
  750: {
    name: "Highland Mist",
    gradient: "from-gray-300 via-slate-400 to-zinc-600",
    accent: "#f1f5f9",
    text: "text-slate-50",
    secondaryText: "text-slate-300",
    animationType: AnimationType.BLUR,
    elements: ["🐐", "🧣", "🌫️", "🧗"]
  },
  800: {
    name: "New Horizon",
    gradient: "from-white via-cyan-50 to-cyan-200",
    accent: "#0891B2",
    text: "text-cyan-950",
    secondaryText: "text-cyan-700",
    animationType: AnimationType.SPIRAL,
    elements: ["📚", "💻", "✏️", "🎒", "💡"]
  },
  850: {
    name: "Digital Future",
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    accent: "#ffffff",
    text: "text-white",
    secondaryText: "text-cyan-100",
    animationType: AnimationType.ZOOM,
    elements: ["📡", "🛰️", "🧪", "⚙️"]
  },
  900: {
    name: "Victory Celebration",
    gradient: "from-yellow-400 via-amber-500 to-red-600",
    accent: "#991B1B",
    text: "text-red-950",
    secondaryText: "text-amber-900",
    animationType: AnimationType.CELEBRATE,
    elements: ["🎉", "🔥", "🎖️", "🦁", "🏆"]
  },
  950: {
    name: "Ultimate Prize",
    gradient: "from-yellow-300 via-yellow-500 to-yellow-700",
    accent: "#451a03",
    text: "text-amber-950",
    secondaryText: "text-amber-800",
    animationType: AnimationType.POP,
    elements: ["👑", "💎", "🎊", "🎺"]
  },
  1000: {
    name: "Beyond Limits",
    gradient: "from-black via-slate-900 to-black",
    accent: "#ffffff",
    text: "text-white",
    secondaryText: "text-white/50",
    animationType: AnimationType.CELEBRATE,
    elements: ["🚀", "🪐", "🌍", "✨"]
  }
};

/**
 * Returns the appropriate theme configuration based on the current verse count.
 */
export const getTheme = (count: number): ThemeConfig => {
  const floor = Math.min(1000, Math.floor(count / 50) * 50);
  return THEMES[floor] || THEMES[0];
};

/**
 * Global build information for version tracking.
 */
export const BUILD_INFO = {
  number: "3.5.0-BROADCAST",
  timestamp: new Date().toLocaleDateString()
};
