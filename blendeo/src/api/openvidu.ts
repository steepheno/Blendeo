// src/api/openvidu.ts
import axiosInstance from "@/api/axios";

const OPENVIDU_API_URL = import.meta.env.VITE_API_URL || "/api/v1";

export const openViduApi = {
  createSession: async (roomId: string) => {
    // 채팅방 ID를 기반으로 세션 ID 생성
    const customSessionId = `room_${roomId}`;

    try {
      // response를 사용하지 않으므로 제거
      await axiosInstance.post(`${OPENVIDU_API_URL}/sessions`, {
        customSessionId,
        mediaMode: "ROUTED",
        recordingMode: "MANUAL",
        defaultRecordingProperties: {
          name: "MyRecording",
          hasAudio: true,
          hasVideo: true,
        },
      });

      return customSessionId;
    } catch (error: unknown) {
      // 타입 명시
      // error 타입 가드 추가
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "status" in error.response &&
        error.response.status === 409
      ) {
        return customSessionId;
      }
      throw error;
    }
  },

  createConnection: async (sessionId: string) => {
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    console.log("Creating connection for session:", sessionId);
    const response = await axiosInstance.post(
      `${OPENVIDU_API_URL}/sessions/${sessionId}/connections`,
      {
        type: "WEBRTC",
        data: "Connection data",
        role: "PUBLISHER",
        kurentoOptions: {
          videoMaxRecvBandwidth: 1000,
          videoMinRecvBandwidth: 300,
          videoMaxSendBandwidth: 1000,
          videoMinSendBandwidth: 300,
          allowedFilters: ["GStreamerFilter", "ZBarFilter"],
        },
      }
    );

    console.log("Connection creation response:", response);
    return response; // response에는 token이 포함되어 있을 것입니다
  },
};
