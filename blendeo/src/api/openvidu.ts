// src/api/openvidu.ts
import axiosInstance from "@/api/axios";

const OPENVIDU_API_URL = import.meta.env.VITE_API_URL || "/api/v1";

export const openViduApi = {
  createSession: async () => {
    const customSessionId = `ses_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    console.log("Requesting session with ID:", customSessionId);

    const response = await axiosInstance.post(`${OPENVIDU_API_URL}/sessions`, {
      customSessionId,
      mediaMode: "ROUTED",
      recordingMode: "MANUAL",
      defaultRecordingProperties: {
        name: "MyRecording",
        hasAudio: true,
        hasVideo: true,
      },
    });

    console.log("Session creation response:", response);
    return customSessionId; // 생성한 세션 ID를 직접 반환
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
