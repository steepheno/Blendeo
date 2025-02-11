// src/components/videoCall/CallParticipant.tsx
import React, { useEffect, useRef } from "react";
import { StreamManager } from "openvidu-browser";

interface CallParticipantProps {
  streamManager: StreamManager;
  isMainUser?: boolean;
}

export const CallParticipant: React.FC<CallParticipantProps> = ({
  streamManager,
  isMainUser = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <div className="flex flex-col gap-2 justify-center items-center p-2.5 bg-neutral-800 grow basis-[0%] rounded-xl min-w-[240px] max-w-[470px] min-h-[350px]">
      <video
        autoPlay
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
      />
      <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
        {isMainUser
          ? "You"
          : `Participant ${streamManager.stream.connection.connectionId}`}
      </div>
    </div>
  );
};
