// VideoCard.tsx
interface VideoCardProps {
  thumbnail: string;
  duration: string;
  title: string;
  views: string;
  uploadedAt: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  thumbnail,
  duration,
  title,
  views,
  uploadedAt,
}) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <img
          src={thumbnail}
          alt="Video thumbnail"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 px-1 py-0.5 rounded text-white text-xs">
          {duration}
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium line-clamp-2">{title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-gray-600">조회수 {views}</p>
          <span className="text-xs text-gray-600">•</span>
          <p className="text-xs text-gray-600">{uploadedAt}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
