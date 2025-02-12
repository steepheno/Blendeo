// src/api/openvidu.ts
import axiosInstance from "@/api/axios";
import type { CreateConnectionResponse } from "@/types/api/openvidu";

const OPENVIDU_API_URL = import.meta.env.VITE_API_URL || "/api/v1";

export const openViduApi = {
  createSession: async () => {
    const response = await axiosInstance.post<string>(
      `${OPENVIDU_API_URL}/sessions`,
      {
        additionalProp1: {},
        additionalProp2: {},
        additionalProp3: {},
      }
    );
    return response;
  },

  createConnection: async (sessionId: string) => {
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    const response = await axiosInstance.post<CreateConnectionResponse>(
      `${OPENVIDU_API_URL}/sessions/${sessionId}/connections`,
      {
        additionalProp1: {},
        additionalProp2: {},
        additionalProp3: {},
      }
    );
    return response;
  },
};
