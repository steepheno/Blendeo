/* 구독 상세정보 */

import * as React from "react";
import FollowingProjectResponse from "@/api/user";

const SubscriptionItem: React.FC<FollowingProjectResponse> = ({
  authorProfileImage,
  title,
  authorNickname,
  createdAt,
}) => {
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}일 전`;
    } else if (hours > 0) {
      return `${hours}시간 전`;
    } else if (minutes > 0) {
      return `${minutes}분 전`;
    } else if (seconds > 10) {
      return `${seconds}초 전`;
    } else {
      return "방금 전";
    }
  };
  return (
    <div className="flex gap-3 items-center px-4 py-2 w-[60px] bg-white bg-opacity-0 min-h-[60px]">
      <img
        loading="lazy"
        src={authorProfileImage}
        alt={authorNickname}
        className="object-contain shrink-0 self-stretch my-auto rounded-lg aspect-[0.75] w-[39px]"
      />
      <div className="flex flex-col justify-center self-stretch my-auto w-[170px]">
        <div className="overflow-hidden max-w-full h-6 text-base font-medium text-neutral-3000 w-[184px] truncate">
          {authorNickname} | {title}
        </div>
        <div className="overflow-hidden max-w-full text-sm text-slate-500 w-[184px]">
          {getRelativeTime(createdAt)}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionItem;
