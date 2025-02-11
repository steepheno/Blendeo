// src/types/openvidu.ts
import { Session, Publisher, Subscriber } from "openvidu-browser";

export interface StreamManager {
  stream: {
    videoActive: boolean;
    audioActive: boolean;
    connection: {
      connectionId: string;
    };
  };
}

export interface VideoCallState {
  session: Session | undefined;
  publisher: Publisher | undefined;
  subscribers: Subscriber[];
  currentVideoDevice: string;
}
