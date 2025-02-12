// src/types/api/openvidu.ts
export interface OpenViduApiRequest {
  additionalProp1: Record<string, never>;
  additionalProp2: Record<string, never>;
  additionalProp3: Record<string, never>;
}

// CreateConnectionResponse 타입을 string으로 변경 (wss URL이 직접 반환되므로)
export type CreateConnectionResponse = string;
