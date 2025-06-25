import VideoCard from "./VideoCard";

type VideoSectionProps = {
  title: string;
  videos: {
    thumbnailSrc: string;
    title: string;
    username: string;
    views: string;
    timeAgo: string;
    tags: string[];
  }[];
};

function VideoSection({ title, videos }: VideoSectionProps) {
  return (
    <div className="flex flex-col py-2.5 mt-2.5 w-full min-h-[332px] max-md:max-w-full">
      <div className="px-5 w-full text-3xl font-bold text-black max-md:max-w-full">
        {title}
      </div>
      <div className="flex overflow-x-auto flex-1 gap-2.5 items-center py-2.5 pl-8 mt-2.5 rounded-xl size-full max-md:pl-5 max-md:max-w-full">
        {videos.map((video, index) => (
          <VideoCard key={index} {...video} />
        ))}
      </div>
    </div>
  );
}

export default VideoSection;
