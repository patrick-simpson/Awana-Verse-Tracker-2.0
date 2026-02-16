
import { ThemeConfig, AnimationType } from './types.ts';

export const THEMES: Record<number, ThemeConfig> = {
  0: {
    name: "Sunrise Savanna",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    accent: "#FBBF24",
    text: "text-white",
    secondaryText: "text-orange-950",
    animationType: AnimationType.FALL,
    elements: ["☀️", "🦒", "🐘", "🌳"]
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
  200: {
    name: "Breaking Ground",
    gradient: "from-teal-600 via-emerald-700 to-emerald-900",
    accent: "#10B981",
    text: "text-white",
    secondaryText: "text-teal-200",
    animationType: AnimationType.POP,
    elements: ["🔨", "🏫", "🏗️", "📐", "🧱"]
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
  400: {
    name: "Great River Flow",
    gradient: "from-blue-500 via-blue-700 to-indigo-900",
    accent: "#3B82F6",
    text: "text-white",
    secondaryText: "text-blue-300",
    animationType: AnimationType.ZOOM,
    elements: ["🌊", "🌈", "🐟", "💧", "🛶"]
  },
  500: {
    name: "Open Heavens",
    gradient: "from-indigo-950 via-purple-900 to-black",
    accent: "#FCD34D",
    text: "text-yellow-200",
    secondaryText: "text-indigo-400",
    animationType: AnimationType.BLUR,
    elements: ["✨", "🌙", "🦉", "⭐", "🔭"]
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
  700: {
    name: "Mountain Majesty",
    gradient: "from-slate-100 via-slate-400 to-slate-700",
    accent: "#1F2937",
    text: "text-slate-900",
    secondaryText: "text-slate-600",
    animationType: AnimationType.BOUNCE,
    elements: ["🏔️", "❄️", "🦅", "☁️", "🎿"]
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
  900: {
    name: "Victory Celebration",
    gradient: "from-yellow-400 via-amber-500 to-red-600",
    accent: "#991B1B",
    text: "text-red-950",
    secondaryText: "text-amber-900",
    animationType: AnimationType.CELEBRATE,
    elements: ["🎉", "🔥", "🎖️", "🦁", "🏆"]
  }
};

export const getTheme = (count: number): ThemeConfig => {
  const floor = Math.min(900, Math.floor(count / 100) * 100);
  return THEMES[floor] || THEMES[0];
};

export const BUILD_INFO = {
  number: "2.1.0-STABLE",
  timestamp: new Date().toLocaleDateString()
};
