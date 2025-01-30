import VideoCard from './VideoCard';

interface Video {
  id: number;
  thumbnail: string;
  duration: string;
  title: string;
  views: string;
  uploadedAt: string;
}

const VideoGrid: React.FC<{ type: "uploaded" | "liked" }> = ({ type }) => {
  // 실제 구현에서는 이 데이터를 props나 API로 받아올 수 있습니다
  const videos: Video[] = [
    {
      id: 1,
      thumbnail: "/api/placeholder/240/135",
      duration: "3:45",
      title:
        type === "uploaded"
          ? "대학 밴드 동아리 Cover 영상"
          : "좋아요 한 밴드 영상",
      views: "1.2만회",
      uploadedAt: "3일 전",
    },
    // ... 더 많은 비디오 데이터
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-6">
      {videos.map((video) => (
        <VideoCard key={video.id} {...video} />
      ))}
    </div>
  );
};

export default VideoGrid;