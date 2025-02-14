// src/types/components/video/openvidu.ts
export interface StreamManager {
  id: string;
  stream: {
    audioActive: boolean;
    videoActive: boolean;
    connection: {
      data: string;
    };
  };
  addVideoElement: (element: HTMLVideoElement) => void;
}

export interface OpenViduSession {
  sessionId: string;
  token: string;
}
