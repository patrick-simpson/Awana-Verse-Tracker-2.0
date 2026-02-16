
import { ThemeConfig, AnimationType } from './types';

export const THEMES: Record<number, ThemeConfig> = {
  0: {
    name: "Sunrise Savanna",
    gradient: "from-orange-400 via-orange-500 to-yellow-600",
    accent: "#FBBF24", // Yellow
    text: "text-white",
    secondaryText: "text-orange-900",
    animationType: AnimationType.FALL,
    elements: ["☀️", "🦒", "🐘", "🌳"]
  },
  100: {
    name: "Village Map",
    gradient: "from-amber-700 via-stone-600 to-stone-800",
    accent: "#686158", // Flint
    text: "text-stone-100",
    secondaryText: "text-amber-300",
    animationType: AnimationType.SLIDE,
    elements: ["🗺️", "🏠", "📍", "🛖"]
  },
  200: {
    name: "Building Dreams",
    gradient: "from-teal-500 via-emerald-600 to-emerald-800",
    accent: "#10B981", // Green
    text: "text-white",
    secondaryText: "text-teal-100",
    animationType: AnimationType.POP,
    elements: ["🔨", "🏫", "🏗️", "📐"]
  },
  300: {
    name: "Tropical Forest",
    gradient: "from-green-600 via-green-800 to-emerald-900",
    accent: "#047857",
    text: "text-lime-100",
    secondaryText: "text-green-300",
    animationType: AnimationType.ROTATE,
    elements: ["🍃", "🐒", "🦜", "🌿"]
  },
  400: {
    name: "Victoria Falls",
    gradient: "from-blue-400 via-blue-600 to-indigo-800",
    accent: "#3B82F6",
    text: "text-white",
    secondaryText: "text-blue-100",
    animationType: AnimationType.ZOOM,
    elements: ["🌊", "🌈", "🐟", "💧"]
  },
  500: {
    name: "Starry Night",
    gradient: "from-indigo-900 via-purple-900 to-black",
    accent: "#FCD34D",
    text: "text-yellow-100",
    secondaryText: "text-indigo-300",
    animationType: AnimationType.BLUR,
    elements: ["✨", "🌙", "🦉", "⭐"]
  },
  600: {
    name: "Vibrant Marketplace",
    gradient: "from-pink-500 via-red-500 to-orange-500",
    accent: "#FFFFFF",
    text: "text-white",
    secondaryText: "text-pink-100",
    animationType: AnimationType.WAVE,
    elements: ["🍎", "🧺", "👗", "🥁"]
  },
  700: {
    name: "Kilimanjaro Peak",
    gradient: "from-stone-200 via-stone-400 to-stone-600",
    accent: "#1F2937",
    text: "text-slate-900",
    secondaryText: "text-slate-500",
    animationType: AnimationType.BOUNCE,
    elements: ["🏔️", "❄️", "🦅", "☁️"]
  },
  800: {
    name: "Modern Classroom",
    gradient: "from-white via-blue-50 to-blue-200",
    accent: "#2563EB",
    text: "text-blue-900",
    secondaryText: "text-blue-600",
    animationType: AnimationType.SPIRAL,
    elements: ["📚", "💻", "✏️", "🎒"]
  },
  900: {
    name: "Celebration Summit",
    gradient: "from-yellow-400 via-amber-500 to-yellow-600",
    accent: "#991B1B",
    text: "text-red-900",
    secondaryText: "text-amber-800",
    animationType: AnimationType.CELEBRATE,
    elements: ["🎉", "🔥", "🎖️", "🦁"]
  }
};

export const getTheme = (count: number): ThemeConfig => {
  const floor = Math.min(900, Math.floor(count / 100) * 100);
  return THEMES[floor] || THEMES[0];
};

export const BUILD_INFO = {
  number: "1.0.42",
  timestamp: new Date().toLocaleString()
};
