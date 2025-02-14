import React, { useEffect, useRef } from "react";
import { StreamManager } from "openvidu-browser";

interface VideoComponentProps {
  streamManager: StreamManager;
  className?: string;
}

interface ClientData {
  userName?: string;
  roomId?: string;
  // 알려진 추가 속성들을 명시적으로 정의
  additionalData?: Record<string, string | number | boolean | null>;
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
    try {
      const connectionData = streamManager.stream.connection.data;
      if (!connectionData) return "Unknown";

      const parsedData = JSON.parse(connectionData) as {
        clientData: string | ClientData;
      };
      if (!parsedData.clientData) return "Unknown";

      // clientData might be a string that needs to be parsed
      let clientData: ClientData;
      if (typeof parsedData.clientData === "string") {
        try {
          clientData = JSON.parse(parsedData.clientData);
        } catch {
          // If it's not valid JSON, use it as is
          return parsedData.clientData || "Unknown";
        }
      } else {
        clientData = parsedData.clientData;
      }

      return clientData.userName || "Unknown";
    } catch (error) {
      console.error("Error parsing connection data:", error);
      return "Unknown";
    }
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <video autoPlay ref={videoRef} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
        <span className="text-sm">{getNicknameTag()}</span>
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
