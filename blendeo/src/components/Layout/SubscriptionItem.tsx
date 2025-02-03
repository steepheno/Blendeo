/* 구독 상세정보 */

import * as React from "react";
import { SubscriptionItemProps } from "@/types/components/sidebar/sidebar";

const SubscriptionItem: React.FC<SubscriptionItemProps> = ({
  imageUrl,
  title,
  timeAgo,
  views,
}) => {
  return (
    <div className="flex gap-4 items-center px-4 py-3 w-full bg-white bg-opacity-0 min-h-[76px]">
      <img
        loading="lazy"
        src={imageUrl}
        alt={title}
        className="object-contain shrink-0 self-stretch my-auto rounded-lg aspect-[0.75] w-[39px]"
      />
      <div className="flex flex-col justify-center self-stretch my-auto w-[184px]">
        <div className="overflow-hidden max-w-full h-6 text-base font-medium text-neutral-900 w-[184px]">
          {title}
        </div>
        <div className="overflow-hidden max-w-full text-sm text-slate-500 w-[184px]">
          {timeAgo}, {views} views
        </div>
      </div>
    </div>
  );
};

export default SubscriptionItem;
