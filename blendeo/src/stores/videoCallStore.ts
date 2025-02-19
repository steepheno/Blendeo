import { create } from "zustand";
import { Session, Publisher, Subscriber } from "openvidu-browser";

interface VideoCallStore {
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
}

export const useVideoCallStore = create<VideoCallStore>((set) => ({
  session: null,
  publisher: null,
  subscribers: [],
  setSession: (newSession) =>
    set((state) => {
      if (state.session === newSession) return state;
      return { session: newSession };
    }),
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
}));
