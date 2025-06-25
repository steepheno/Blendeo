import * as React from "react";
import { MusicCardProps } from "@/types/components/main/musicCard";

const MusicCard: React.FC<MusicCardProps> = ({
  imageUrl,
  title,
  timeAgo,
  views,
}) => {
  return (
    <div className="flex flex-col grow shrink justify-between pb-3 min-h-[237px] min-w-[240px] w-[193px]">
      <img
        loading="lazy"
        src={imageUrl}
        alt={title}
        className="object-contain w-full rounded-xl aspect-[1.51]"
      />
      <div className="flex flex-col mt-5 w-full">
        <div className="w-full text-base font-medium text-neutral-900">
          {title}
        </div>
        <div className="w-full text-sm text-slate-500">
          {timeAgo}, {views} views
        </div>
      </div>
    </div>
  );
};

export default MusicCard;
