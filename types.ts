
export interface AppState {
  count: number;
  lastUpdated: number;
  isOffline: boolean;
}

export interface ThemeConfig {
  name: string;
  gradient: string;
  accent: string;
  text: string;
  secondaryText: string;
  animationType: 'fall' | 'slide' | 'pop' | 'rotate' | 'zoom' | 'blur' | 'wave' | 'bounce' | 'spiral' | 'celebrate';
  elements: string[];
}

export enum AnimationType {
  FALL = 'fall',
  SLIDE = 'slide',
  POP = 'pop',
  ROTATE = 'rotate',
  ZOOM = 'zoom',
  BLUR = 'blur',
  WAVE = 'wave',
  BOUNCE = 'bounce',
  SPIRAL = 'spiral',
  CELEBRATE = 'celebrate'
}
