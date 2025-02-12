// src/types/components/video/openvidu.ts

export interface Stream {
  connection: {
    data: string;
  };
  getMediaStream: () => MediaStream;
}

export interface StreamManager {
  stream: Stream;
  addVideoElement: (element: HTMLVideoElement) => void;
}

export interface Publisher extends StreamManager {
  id: string;
}

export interface Subscriber extends StreamManager {
  id: string;
}

export interface Device {
  deviceId: string;
  kind: string;
  label: string;
}

export interface VideoDevice extends Device {
  kind: "videoinput";
}

export interface StreamEvent {
  stream: Stream;
}

export interface ExceptionEvent {
  name: string;
  message: string;
  code: number;
}

export type SessionEvent = StreamEvent | ExceptionEvent;

export interface Session {
  disconnect: () => void;
  removeAllListeners: (event?: string) => void; // 추가된 메서드
  on(eventName: "streamCreated", callback: (event: StreamEvent) => void): void;
  on(
    eventName: "streamDestroyed",
    callback: (event: StreamEvent) => void
  ): void;
  on(eventName: "exception", callback: (event: ExceptionEvent) => void): void;
  connect: (token: string, metadata: { clientData: string }) => Promise<void>;
  publish: (publisher: Publisher) => Promise<void>;
  unpublish: (publisher: Publisher) => Promise<void>;
  subscribe: (
    stream: Stream,
    targetElement: HTMLElement | undefined
  ) => Subscriber;
}

export interface PublisherProperties {
  videoSource?: string | undefined;
  audioSource?: string | undefined;
  publishAudio?: boolean;
  publishVideo?: boolean;
  resolution?: string;
  frameRate?: number;
  insertMode?: string;
  mirror?: boolean;
}

export interface OpenViduInstance {
  initSession: () => Session;
  initPublisher: (
    targetElement: string | undefined,
    options: PublisherProperties
  ) => Publisher;
  initPublisherAsync: (
    targetElement: string | undefined,
    options: PublisherProperties
  ) => Promise<Publisher>;
  getDevices: () => Promise<Device[]>;
}
