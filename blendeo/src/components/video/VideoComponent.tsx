// src/components/video/VideoComponent.tsx
import React, { useEffect, useRef } from "react";
import { StreamManager } from "openvidu-browser";

// 비디오 컴포넌트의 props 인터페이스
// OpenVidu StreamManager와 선택적 CSS 클래스를 받음
interface VideoComponentProps {
  streamManager: StreamManager; // OpenVidu 스트림 관리자
  className?: string; // 추가 CSS 클래스 (선택적)
}

// 비디오 컴포넌트: OpenVidu 스트림을 렌더링하고 사용자 정보 표시
export const VideoComponent: React.FC<VideoComponentProps> = ({
  streamManager,
  className = "",
  // isMyVideo = false, // 기본값 false로 설정
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

  return (
    // 비디오 컨테이너
    <div className={`relative w-full h-full ${className}`}>
      {/* 비디오 요소 */}
      <video autoPlay ref={videoRef} className="w-full h-full object-cover" />

      {/* 미디어 상태만 표시하도록 수정 */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
        {streamManager.stream.audioActive === false && (
          <span className="ml-2" title="Audio Muted">
            🔇
          </span>
        )}
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
