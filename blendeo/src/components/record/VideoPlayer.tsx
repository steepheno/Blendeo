import React, { useState, useRef, useEffect } from "react";

interface VideoPlayerProps {
  videoUrl?: string;
  initialLoops?: number;
}

const PreciseVideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl = "https://blendeo-s3-bucket.s3.ap-northeast-2.amazonaws.com/videos/origin_5b2cfbb3-ef57-4a0b-8b34-7a859edb476b.mp4",
  initialLoops = 4,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentLoop, setCurrentLoop] = useState<number>(0);
  const [maxLoops, setMaxLoops] = useState<number>(initialLoops);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  const handleVideoEnd = (): void => {
    if (currentLoop < maxLoops - 1) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        void videoRef.current
          .play()
          .then(() => console.log("Video restarted successfully"))
          .catch((err: Error) => console.error("Error restarting video:", err));
      }

      setCurrentLoop((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      setCurrentLoop(0);
    }
  };

  const startPlayback = (): void => {
    if (!isPlaying && videoRef.current) {
      setIsPlaying(true);
      videoRef.current.currentTime = 0;
      void videoRef.current
        .play()
        .then(() => console.log("Playback started successfully"))
        .catch((err: Error) => console.error("Error starting playback:", err));
    }
  };

  const stopPlayback = (): void => {
    if (isPlaying && videoRef.current) {
      setIsPlaying(false);
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setCurrentLoop(0);
    }
  };

  const handleLoopChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value, 10);
    if (!Number.isNaN(value) && value > 0) {
      setMaxLoops(value);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <video
        ref={videoRef}
        className="w-96 h-54 bg-black"
        onEnded={handleVideoEnd}
        preload="auto"
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={startPlayback}
          className="px-4 py-2 bg-violet-700 text-white rounded hover:bg-violet-800 disabled:bg-gray-400"
          disabled={isPlaying}
        >
          재생
        </button>
        <button
          type="button"
          onClick={stopPlayback}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
          disabled={!isPlaying}
        >
          정지
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="loopCount" className="text-sm">
          반복 횟수:
        </label>
        <input
          id="loopCount"
          type="number"
          min="1"
          value={maxLoops}
          onChange={handleLoopChange}
          className="w-20 px-2 py-1 border rounded"
          disabled={isPlaying}
        />
      </div>

      <div className="text-sm text-gray-600">
        현재 {currentLoop + 1}번째 재생 중 / 총 {maxLoops}회
      </div>
    </div>
  );
};

export default PreciseVideoPlayer;
