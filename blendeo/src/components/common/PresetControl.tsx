import * as React from 'react';
import { PresetControlProps } from '../../types/components/editing/edit';

const PresetControl: React.FC<PresetControlProps> = ({
  label,
  sublabel,
  value,
  onChange
}) => {
  return (
    <div className="flex flex-col w-full max-w-[452px]">
      <div className="flex gap-10 justify-between items-center w-full text-lg font-medium tracking-tight text-white whitespace-nowrap min-h-[20px]">
        <div className="flex gap-1.5 items-center self-stretch my-auto">
          <div className="flex shrink-0 self-stretch my-auto h-[18px] w-[18px]" />
          <div className="self-stretch my-auto w-[116px]">{label}</div>
        </div>
        <div className="flex shrink-0 self-stretch my-auto h-[18px] w-[18px]" />
      </div>
      <div className="flex gap-10 mt-4 whitespace-nowrap">
        <div className="grow my-auto text-base tracking-normal text-neutral-500">
          {sublabel}
        </div>
        <div className="overflow-hidden grow px-2.5 py-2 text-sm tracking-normal text-white rounded border-solid border-[1.236px] border-zinc-900 w-fit">
          {value}
        </div>
      </div>
    </div>
  );
};

export default PresetControl;