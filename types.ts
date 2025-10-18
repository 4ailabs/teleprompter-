
export interface ScriptLine {
  character: string;
  dialogue: string;
}

export interface TeleprompterState {
  isPlaying: boolean;
  speed: number;
  currentPosition: number;
  progress: number;
}

export interface NavigationControls {
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onReset: () => void;
  onGoToEnd: () => void;
}

export type DeviceRole = 'host' | 'controller' | 'viewer';

export interface DeviceInfo {
  id: string;
  role: DeviceRole;
  name: string;
  connectedAt: number;
}
