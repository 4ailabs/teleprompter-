
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
