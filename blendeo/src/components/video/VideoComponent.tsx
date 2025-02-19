// src/components/video/VideoComponent.tsx
import React, { useEffect, useRef } from "react";
import { StreamManager } from "openvidu-browser";

// 비디오 컴포넌트의 props 인터페이스
// OpenVidu StreamManager와 선택적 CSS 클래스를 받음
interface VideoComponentProps {
  streamManager: StreamManager; // OpenVidu 스트림 관리자
  className?: string; // 추가 CSS 클래스 (선택적)
}

// 클라이언트 데이터 인터페이스
// 사용자 정보를 위한 유연한 데이터 구조 정의
interface ClientData {
  userName?: string; // 사용자 이름
  roomId?: string; // 채팅방 ID
  // 추가 속성들을 동적으로 처리할 수 있는 유연한 속성
  additionalData?: Record<string, string | number | boolean | null>;
}

// 비디오 컴포넌트: OpenVidu 스트림을 렌더링하고 사용자 정보 표시
export const VideoComponent: React.FC<VideoComponentProps> = ({
  streamManager,
  className = "",
}) => {
  // 비디오 요소에 대한 참조
  const videoRef = useRef<HTMLVideoElement>(null);

  // 스트림 매니저가 변경될 때 비디오 요소 추가
  useEffect(() => {
    if (streamManager && videoRef.current) {
      try {
        // 스트림 매니저에 비디오 요소 연결
        streamManager.addVideoElement(videoRef.current);
      } catch (error) {
        // 비디오 요소 추가 중 오류 처리
        console.error("Error adding video element:", error);
      }
    }
  }, [streamManager]);

  // 사용자 닉네임 추출 함수
  const getNicknameTag = () => {
    try {
      // 연결 데이터 추출
      const connectionData = streamManager.stream.connection.data;
      if (!connectionData) return "Unknown";

      // 연결 데이터 파싱
      const parsedData = JSON.parse(connectionData) as {
        clientData: string | ClientData;
      };
      if (!parsedData.clientData) return "Unknown";

      // clientData가 문자열인지 객체인지에 따라 다르게 처리
      let clientData: ClientData;
      if (typeof parsedData.clientData === "string") {
        try {
          // 문자열로 된 JSON 파싱 시도
          clientData = JSON.parse(parsedData.clientData);
        } catch {
          // JSON 파싱 실패 시 문자열 그대로 사용
          return parsedData.clientData || "Unknown";
        }
      } else {
        // 이미 객체인 경우 그대로 사용
        clientData = parsedData.clientData;
      }

      // 사용자 이름 반환 (없으면 "Unknown")
      return clientData.userName || "Unknown";
    } catch (error) {
      // 데이터 파싱 중 오류 처리
      console.error("Error parsing connection data:", error);
      return "Unknown";
    }
  };

  return (
    // 비디오 컨테이너
    <div className={`relative w-full h-full ${className}`}>
      {/* 비디오 요소 */}
      <video autoPlay ref={videoRef} className="w-full h-full object-cover" />

      {/* 사용자 정보 및 미디어 상태 오버레이 */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
        {/* 사용자 이름 */}
        <span className="text-sm">{getNicknameTag()}</span>

        {/* 오디오 음소거 표시 */}
        {streamManager.stream.audioActive === false && (
          <span className="ml-2" title="Audio Muted">
            🔇
          </span>
        )}

        {/* 비디오 끄기 표시 */}
        {streamManager.stream.videoActive === false && (
          <span className="ml-2" title="Video Off">
            🎦
          </span>
        )}
      </div>
    </div>
  );
};

export default VideoComponent;
