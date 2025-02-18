import { create } from "zustand";
import { Session, Publisher, Subscriber } from "openvidu-browser";

interface VideoStore {
  session: Session | null;
  publisher: Publisher | null;
  subscribers: Subscriber[];
  setSession: (session: Session | null) => void;
  setPublisher: (publisher: Publisher | null) => void;
  setSubscribers: (
    subscribers: Subscriber[] | ((prev: Subscriber[]) => Subscriber[])
  ) => void;
  addSubscriber: (subscriber: Subscriber) => void;
  removeSubscriber: (streamId: string) => void;
  videoData: {
    blobUrl: string;
    duration: number;
  } | null;
  trimData: {
    startTime: number;
    endTime: number;
    videoDuration: number;
  } | null;
  setTrimData: (data: VideoStore["trimData"]) => void;
  isVideoLoaded: boolean;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  uploadVideo: (params: { videoFile: File }) => Promise<string>;
  uploadProgress: number;
  uploadedBytes: number;
  setCreatedUrl: (url: string) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  session: null,
  publisher: null,
  subscribers: [],
  isVideoLoaded: false,
  setSession: (session) => set({ session }),
  setPublisher: (publisher) => set({ publisher }),
  setSubscribers: (subscribers) =>
    set((state) => ({
      subscribers:
        typeof subscribers === "function"
          ? subscribers(state.subscribers)
          : subscribers,
    })),
  addSubscriber: (subscriber) =>
    set((state) => ({
      subscribers: [...state.subscribers, subscriber],
    })),
  removeSubscriber: (streamId) =>
    set((state) => ({
      subscribers: state.subscribers.filter(
        (subscriber) => subscriber.stream.streamId !== streamId
      ),
    })),
  videoData: null,
  trimData: null,
  setTrimData: (data) => set({ trimData: data }),
  isProcessing: false,
  setIsProcessing: (processing) => set({ isProcessing: processing }),
  uploadVideo: async () => {
    // Implementation of uploadVideo
    return "";
  },
  uploadProgress: 0,
  uploadedBytes: 0,
  setCreatedUrl: (url) => set({ videoData: { blobUrl: url, duration: 0 } }),
}));

export default useVideoStore;
