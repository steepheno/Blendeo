// src/components/video/VideoComponent.tsx
import React, { useEffect, useRef } from "react";
import { StreamManager } from "openvidu-browser";

interface VideoComponentProps {
  streamManager: StreamManager;
  className?: string;
}

export const VideoComponent: React.FC<VideoComponentProps> = ({
  streamManager,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (streamManager && videoRef.current) {
      try {
        streamManager.addVideoElement(videoRef.current);
      } catch (error) {
        console.error("Error adding video element:", error);
      }
    }
  }, [streamManager]);

  const getNicknameTag = () => {
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <video autoPlay ref={videoRef} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
        <span className="text-sm">{getNicknameTag()}</span>
        {!streamManager.stream.audioActive && <span className="ml-2">🔇</span>}
        {!streamManager.stream.videoActive && <span className="ml-2">🎦</span>}
      </div>
    </div>
  );
};

export default VideoComponent;
