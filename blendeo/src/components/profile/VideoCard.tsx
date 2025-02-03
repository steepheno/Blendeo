// src/components/common/VideoCard.tsx
type VideoCardProps = {
  thumbnailSrc: string;
  title: string;
  username: string;
  views: string;
  timeAgo: string;
  tags?: string[]; // 태그는 선택적으로 변경
  onClick?: () => void; // 클릭 이벤트 추가
};

function VideoCard({
  thumbnailSrc,
  title,
  username,
  views,
  timeAgo,
  tags = [], // 기본값 빈 배열
  onClick,
}: VideoCardProps) {
  return (
    <div
      className="flex flex-col self-stretch my-auto bg-white rounded-md min-h-[218px] min-w-[240px] w-[301px] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-2.5 justify-center items-center pl-px w-full bg-white rounded-md min-h-[147px]">
        <img
          loading="lazy"
          src={thumbnailSrc}
          alt={title}
          className="object-contain gap-2.5 self-stretch my-auto rounded-md aspect-[2.04] min-h-[147px] min-w-[240px] w-[300px]"
        />
      </div>
      <div className="flex flex-col justify-center w-full text-xs font-medium leading-none text-stone-900">
        <div className="flex flex-col justify-center px-2 w-full min-h-[14px]">
          <div className="overflow-hidden self-stretch w-full">{title}</div>
        </div>
      </div>
      <div className="flex justify-between items-center px-2 w-full text-xs font-medium text-black whitespace-nowrap">
        <div className="flex-1 shrink gap-3 self-stretch my-auto w-full h-3 min-w-[240px]">
          {username}
        </div>
      </div>
      <div className="flex justify-between items-center px-2 w-full text-xs font-medium text-black">
        <div className="flex flex-1 shrink gap-2 items-center self-stretch my-auto w-full basis-0 min-h-[12px] min-w-[240px]">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="overflow-hidden self-stretch px-1 py-1 my-auto bg-violet-100 rounded-[100px]"
            >
              # {tag}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center px-2 w-full text-xs font-medium text-black">
        <div className="flex flex-1 shrink gap-1 items-center self-stretch my-auto w-full basis-0 min-h-[12px] min-w-[240px]">
          <div className="self-stretch my-auto">조회수 {views}</div>
          <div className="self-stretch my-auto">·</div>
          <div className="self-stretch my-auto">{timeAgo}</div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
