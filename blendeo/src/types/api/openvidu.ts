// src/types/api/openvidu.ts

/**
 * OpenVidu 세션 생성 요청 시 필요한 파라미터 타입
 */
export interface OpenViduApiRequest {
  customSessionId?: string; // 커스텀 세션 ID
  mediaMode?: "ROUTED" | "RELAYED"; // 미디어 전송 모드
  recordingMode?: "MANUAL" | "ALWAYS"; // 녹화 모드
  defaultRecordingProperties?: {
    // 기본 녹화 설정
    name?: string; // 녹화 파일명
    hasAudio?: boolean; // 오디오 녹화 여부
    hasVideo?: boolean; // 비디오 녹화 여부
  };
}

/**
 * OpenVidu 연결 생성 요청 시 필요한 파라미터 타입
 */
export interface OpenViduConnectionRequest {
  type?: "WEBRTC"; // 연결 타입
  data?: string; // 연결 데이터
  role?: "PUBLISHER" | "SUBSCRIBER"; // 참가자 역할
  kurentoOptions?: {
    // 미디어 서버 설정
    videoMaxRecvBandwidth?: number; // 최대 수신 대역폭
    videoMinRecvBandwidth?: number; // 최소 수신 대역폭
    videoMaxSendBandwidth?: number; // 최대 송신 대역폭
    videoMinSendBandwidth?: number; // 최소 송신 대역폭
    allowedFilters?: string[]; // 허용된 필터 목록
  };
}

/**
 * OpenVidu 세션 생성 응답 타입
 */
export interface OpenViduResponse {
  id: string; // 세션 ID
  token?: string; // 세션 토큰
  createdAt?: number; // 생성 시간
}

/**
 * OpenVidu 연결 응답 타입
 */
export interface ConnectionResponse {
  token?: string; // 연결 토큰
  data?: {
    token?: string; // 중첩된 토큰 정보
  };
}
