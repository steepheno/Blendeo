// types/components/recording/video.ts
export interface VideoData {
    blobUrl: string;
    orientation: "portrait" | "landscape";
    duration: number;
}

export interface TrimData {
    startTime: number;
    endTime: number;
    videoDuration: number;
  }