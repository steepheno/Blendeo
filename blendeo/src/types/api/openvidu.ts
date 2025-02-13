// src/types/api/openvidu.ts
export interface OpenViduApiRequest {
  customSessionId?: string;
  mediaMode?: "ROUTED" | "RELAYED";
  recordingMode?: "MANUAL" | "ALWAYS";
  defaultRecordingProperties?: {
    name?: string;
    hasAudio?: boolean;
    hasVideo?: boolean;
  };
}

export interface OpenViduConnectionRequest {
  type?: "WEBRTC";
  data?: string;
  role?: "PUBLISHER" | "SUBSCRIBER";
  kurentoOptions?: {
    videoMaxRecvBandwidth?: number;
    videoMinRecvBandwidth?: number;
    videoMaxSendBandwidth?: number;
    videoMinSendBandwidth?: number;
    allowedFilters?: string[];
  };
}

export interface OpenViduResponse {
  id: string;
  token?: string;
  createdAt?: number;
}

export interface ConnectionResponse {
  token?: string;
  data?: {
    token?: string;
  };
}
