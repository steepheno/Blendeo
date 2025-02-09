interface VideoData {
  file: File;
  url: string;
}

export interface soundWaveVisualizerProps {
  videoData: VideoData;
  onWaveformReady?: () => void;
  height?: number;
  waveColor?: string;
}