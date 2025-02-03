import React, { useState, useRef } from "react";
import { VideoPlayerProps } from "@/types/components/video/videoDetail";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnail,
  metadata,
  isPortrait = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoError = () => {
    setError("Failed to load video");
  };

  return (
    <div
      className="relative w-[676px] h-[676px] bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Container */}
      <div
        className={`
          absolute inset-0 flex items-center justify-center
          ${isPortrait ? "w-[480px]" : "h-[480px]"} mx-auto
        `}
      >
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={thumbnail}
            className={`
              ${isPortrait ? "w-full" : "h-full"}
              object-cover
              transition-transform duration-300
              ${isHovered ? "scale-105" : "scale-100"}
            `}
            onError={handleVideoError}
            muted={isMuted}
            playsInline
          />
        ) : (
          <img
            src={thumbnail}
            alt={metadata.title}
            className={`
              ${isPortrait ? "w-full" : "h-full"}
              object-cover
              transition-transform duration-300
              ${isHovered ? "scale-105" : "scale-100"}
            `}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-white text-lg">{error}</p>
          </div>
        )}
      </div>

      {/* Video Controls */}
      {videoUrl && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handlePlayPause}
            className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>
          <button
            onClick={handleMuteToggle}
            className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      )}

      {/* Hover Overlay */}
      <div
        className={`
          absolute inset-0 bg-black transition-opacity duration-300
          ${isHovered ? "opacity-30" : "opacity-0"}
        `}
      />

      {/* Bottom Gradient & Info */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div
          className={`
            absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t 
            from-black to-transparent opacity-90
          `}
        />

        <div className="relative flex items-end space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-white">
            <img
              src={metadata.author.profileImage}
              alt={metadata.author.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-white space-y-1">
            <h3 className="font-medium line-clamp-1">{metadata.title}</h3>
            <div
              className={`
                transition-all duration-300 overflow-hidden
                ${showDetails ? "max-h-20" : "max-h-0"}
              `}
            >
              <p className="text-sm opacity-90 line-clamp-2">
                {metadata.content}
              </p>
            </div>
            <p className="text-sm opacity-80">{metadata.author.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
