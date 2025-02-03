import React, { useState } from "react";
import { VideoPlayerProps } from "@/types/components/video/videoDetail";

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  //   videoUrl,
  thumbnail,
  metadata,
  isPortrait = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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
        {/* 실제 비디오가 들어갈 자리. 현재는 썸네일로 대체 */}
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
      </div>

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
