import * as React from 'react';
import { SliderControlProps } from './edit';
import VideoEditBar from '@/components/common/VideoEditBar';

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  sublabel,
  value,
  onChange
}) => {
  return (
    <div className="flex flex-col w-full max-w-[453px]">
      <div className="flex gap-10 justify-between items-center w-full text-lg font-medium tracking-tight text-white whitespace-nowrap min-h-[20px]">
        <div className="flex gap-1.5 items-center self-stretch my-auto">
          <div className="flex shrink-0 self-stretch my-auto h-[18px] w-[18px]" />
          <div className="self-stretch my-auto w-[116px]">{label}</div>
        </div>
        <div className="flex shrink-0 self-stretch my-auto h-[18px] w-[18px]" />
      </div>
      {sublabel && (
        <div className="self-start mt-5 text-base tracking-normal text-neutral-500">
          {sublabel}
        </div>
      )}
      <div className="flex gap-5 justify-between mt-2 w-full">
        <VideoEditBar />
        <div className="flex gap-1.5 items-start text-sm tracking-normal text-center text-white">
          <div className="overflow-hidden px-3.5 py-2 rounded border-solid border-[1.236px] border-zinc-900 w-[57px]">
            {value}%
          </div>
        </div>
      </div>
    </div>
  );
};