import * as React from 'react';
import { PlaybackControlProps } from '../../types/types';

export const PlaybackControl: React.FC<PlaybackControlProps> = ({ currentTime, duration, progress }) => (
  <div className="flex overflow-hidden justify-center items-center max-w-full h-[113px] w-[962px]">
    <div className="flex overflow-hidden flex-col justify-center items-center self-stretch px-4 py-4 my-auto min-w-[240px] w-[962px]">
      <div className="flex flex-col w-full rounded-none max-w-[928px] max-md:max-w-full">
        <div className="overflow-hidden gap-2.5 self-stretch text-sm text-white w-[108px]">
          Playback Time
        </div>
        <div className="mt-3 text-base font-medium text-white whitespace-nowrap">
          {currentTime}
        </div>
        <div className="flex flex-col items-start mt-3 rounded bg-slate-700 max-md:max-w-full">
          <div 
            className="flex max-w-full bg-blue-600 rounded min-h-[8px]" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 text-sm text-white whitespace-nowrap bg-white bg-opacity-0 max-md:max-w-full">
          {duration}
        </div>
      </div>
    </div>
  </div>
);