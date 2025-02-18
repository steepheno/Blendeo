// src/api/openvidu.ts
import axiosInstance from "@/api/axios";

// OpenVidu API 기본 URL 설정
const OPENVIDU_API_URL = import.meta.env.VITE_API_URL || "/api/v1";

export const openViduApi = {
  /**
   * OpenVidu 세션을 생성하는 함수
   * @param {string} roomId - 채팅방 ID
   * @returns {Promise<string>} 생성된 세션 ID
   * @throws {Error} 세션 생성 실패시 에러
   */
  createSession: async (roomId: string) => {
    // 채팅방 ID를 기반으로 고유한 세션 ID 생성
    const sessionId = `room_${roomId}`;
    console.log(sessionId);

    try {
      const session = await axiosInstance.post(`${OPENVIDU_API_URL}/sessions`, {
        sessionId, // 커스텀 세션 ID
        mediaMode: "ROUTED", // 미디어 전송 모드
        recordingMode: "MANUAL", // 녹화 모드
        defaultRecordingProperties: {
          // 기본 녹화 설정
          name: "MyRecording",
          hasAudio: true, // 오디오 녹화 여부
          hasVideo: true, // 비디오 녹화 여부
        },
      });

      console.log(session);

      return session;
    } catch (error: unknown) {
      // 409 에러는 이미 세션이 존재한다는 의미이므로 기존 세션 ID 반환
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "status" in error.response &&
        error.response.status === 409
      ) {
        return sessionId;
      }
      throw error;
    }
  },

  /**
   * OpenVidu 연결을 생성하는 함수
   * @param {string} sessionId - 세션 ID
   * @returns {Promise<any>} 연결 토큰을 포함한 응답
   * @throws {Error} 세션 ID가 없거나 연결 생성 실패시 에러
   */
  createConnection: async (sessionId: string) => {
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    console.log("Creating connection for session:", sessionId);
    const response = await axiosInstance.post(
      `${OPENVIDU_API_URL}/sessions/${sessionId}/connections`,
      {
        type: "WEBRTC", // WebRTC 연결 타입
        data: "Connection data", // 연결 데이터
        role: "PUBLISHER", // 참가자 역할 (발행자)
        kurentoOptions: {
          // 미디어 서버 옵션
          videoMaxRecvBandwidth: 1000, // 최대 수신 대역폭
          videoMinRecvBandwidth: 300, // 최소 수신 대역폭
          videoMaxSendBandwidth: 1000, // 최대 송신 대역폭
          videoMinSendBandwidth: 300, // 최소 송신 대역폭
          allowedFilters: ["GStreamerFilter", "ZBarFilter"], // 허용된 필터
        },
      }
    );

    console.log("Connection creation response:", response);
    return response; // 연결 토큰 포함된 응답 반환
  },
};
