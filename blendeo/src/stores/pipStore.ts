import { create } from "zustand";

interface PiPStore {
  videoElement: HTMLVideoElement | null;
  isPiPActive: boolean; // PIP 모드 활성화 여부
  setVideoElement: (video: HTMLVideoElement | null) => void;
  setPiPActive: (active: boolean) => void; // PIP 모드 상태 변경
}

export const usePiPStore = create<PiPStore>((set) => ({
  videoElement: null,
  isPiPActive: true, // 초기값은 비활성화
  setVideoElement: (video) => set({ videoElement: video }),
  setPiPActive: (active) => set({ isPiPActive: active }),
}));
