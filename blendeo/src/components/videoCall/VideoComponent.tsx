// src/components/videoCall/VideoComponent.tsx
import React, { useRef, useEffect } from "react";
import { StreamManager } from "@/types/components/video/openvidu";

interface VideoComponentProps {
  streamManager: StreamManager;
}

const VideoComponent: React.FC<VideoComponentProps> = ({ streamManager }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  const getNicknameTag = () => {
    if (!streamManager) return "";
    try {
      return JSON.parse(streamManager.stream.connection.data).clientData;
    } catch (error) {
      console.error("Error parsing nickname:", error);
      return "Unknown";
    }
  };

  return (
    <div className="relative w-full h-full">
      <video autoPlay ref={videoRef} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-black/50 p-2">
        <p className="text-white text-center m-0 text-sm">{getNicknameTag()}</p>
      </div>
    </div>
  );
};

export default VideoComponent;
