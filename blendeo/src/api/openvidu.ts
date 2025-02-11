// src/api/openvidu.ts
import axios from "axios";

const API_URL = "https://api.blendeo.shop";

export const getToken = async (sessionId: string): Promise<string> => {
  try {
    // 해당 세션 초기화
    await axios.post(`${API_URL}/api/v1/sessions`, {
      sessionId,
      additionalProp1: {},
      additionalProp2: {},
      additionalProp3: {},
    });

    // 초기화된 세션에 대한 토큰 생성
    const tokenResponse = await axios.post(
      `${API_URL}/api/v1/sessions/${sessionId}/connections`,
      {
        additionalProp1: {},
        additionalProp2: {},
        additionalProp3: {},
      }
    );

    return tokenResponse.data;
  } catch (error) {
    console.error("Error getting token:", error);
    throw error;
  }
};
