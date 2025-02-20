import { useState, useRef, useEffect } from "react";
import { VideoPlayerProps } from "@/types/components/video/videoDetail";
import { Eye, Play, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";

function VideoPlayer({
  videoUrl,
  metadata,
  isPortrait = false,
}: VideoPlayerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false); // 초기값은 음소거 상태
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
        } catch (error) {
          console.error("Video autoplay failed:", error);
          setIsPlaying(false);
        }
      };

      void playVideo();
    }
  }, []);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        void videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleNavigate = (id: number) => {
    console.log(metadata);

    navigate(`/profile/${id}`);
  };

  return (
    <div
      className="relative h-[760px] aspect-square bg-black rounded-lg overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Container */}
      <div
        className={`absolute inset-0 flex items-center justify-center
          ${isPortrait ? "w-[480px]" : "h-[480px]"} mx-auto`}
      >
        <video
          ref={videoRef}
          className={`${isPortrait ? "w-full" : "h-full"} 
            object-cover transition-transform duration-300
            ${isHovered ? "scale-105" : "scale-100"}
            cursor-pointer`}
          onClick={handlePlayPause}
          controls={false}
          playsInline
          muted={isMuted}
          autoPlay
          loop
          preload="auto"
          style={{ backgroundColor: "black" }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Play/Pause Button Overlay - only show when manually paused */}
        {!isPlaying &&
          videoRef.current &&
          !videoRef.current.ended &&
          (videoRef.current.readyState ?? 0) > 2 && (
            <div
              className="absolute inset-0 flex items-center justify-center 
  bg-black bg-opacity-40 cursor-pointer z-10"
              onClick={handlePlayPause}
            >
              <Play className="w-16 h-16 text-white" strokeWidth={1.5} />
            </div>
          )}

        {/* Volume Control - show when hovered */}
        {isHovered && (
          <div
            className="absolute bottom-4 right-4 p-2 rounded-full 
              bg-black bg-opacity-60 cursor-pointer z-30"
            onClick={handleVolumeToggle}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300
          ${isHovered ? "opacity-30" : "opacity-0"} pointer-events-none`}
      />

      {/* Bottom Gradient & Info */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 cursor-pointer z-20"
        onClick={(e) => {
          e.stopPropagation();
          setShowDetails(!showDetails);
        }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t 
            from-black to-transparent opacity-90 pointer-events-none"
        />

        <h3 className="font-bold line-clamp-1 text-white relative text-lg pb-2">
          {metadata.title}
        </h3>
        <div className="relative flex items-end space-x-3">
          <div
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 
            border-2 border-white"
            onClick={() => handleNavigate(metadata.author.id)}
          >
            <img
              src={metadata.author.profileImage}
              alt={metadata.author.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-white space-y-1">
            <div
              className={`transition-all duration-300 overflow-hidden
                ${showDetails ? "max-h-50" : "max-h-20"}`}
            >
              <p className="text-sm opacity-90 line-clamp-2 truncate gap gap-8 flex flex-row">
                <p>{metadata.content}</p>
                <p>더보기...</p>
              </p>
            </div>
            <div className="flex flex-row gap-4">
              <p className="text-sm opacity-80">{metadata.author.name}</p>
              <div className="flex flex-row gap-1 items-center">
                <Eye className="w-4 h-4"></Eye>
                <p className="text-sm opacity-80">{metadata.viewCnt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
