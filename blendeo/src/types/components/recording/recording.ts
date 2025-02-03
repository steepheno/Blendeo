// src/types/components/recording/recording.ts
export interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

export interface PlaybackControlProps {
  currentTime: string;
  duration: string;
  progress: number;
}

export interface ControlButtonProps {
  src: string;
  alt: string;
  onClick: () => void;
}
