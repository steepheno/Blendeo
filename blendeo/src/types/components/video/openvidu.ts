// src/types/components/video/openvidu.ts
/**
 * OpenVidu 스트림 관리자 인터페이스
 */
export interface StreamManager {
  id: string; // 스트림 ID
  stream: {
    audioActive: boolean; // 오디오 활성화 여부
    videoActive: boolean; // 비디오 활성화 여부
    connection: {
      data: string; // 연결 데이터
    };
  };
  addVideoElement: (element: HTMLVideoElement) => void; // 비디오 요소 추가 메서드
}

/**
 * OpenVidu 세션 정보 인터페이스
 */
export interface OpenViduSession {
  sessionId: string; // 세션 ID
  token: string; // 세션 토큰
}
