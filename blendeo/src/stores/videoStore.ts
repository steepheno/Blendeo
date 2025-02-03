// src/store/videoStore.ts
import create from "zustand";

interface VideoStore {
  forkedVideo: string | null;
  recordedVideo: string | null;
  mergedVideoUrl: string | null; // 추가
  setForkedVideo: (url: string) => void;
  setRecordedVideo: (url: string) => void;
  setMergedVideoUrl: (url: string | null) => void; // 추가
  clearVideos: () => void;
}

const useVideoStore = create<VideoStore>((set) => ({
  forkedVideo: null,
  recordedVideo: null,
  mergedVideoUrl: null, // 추가
  setForkedVideo: (url) => set({ forkedVideo: url }),
  setRecordedVideo: (url) => set({ recordedVideo: url }),
  setMergedVideoUrl: (url) => set({ mergedVideoUrl: url }), // 추가
  clearVideos: () =>
    set({
      forkedVideo: null,
      recordedVideo: null,
      mergedVideoUrl: null, // 추가
    }),
}));

export default useVideoStore;
