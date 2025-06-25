import * as React from "react";

type TimeDisplayProps = {
  time: string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ time }) => {
  return (
    <div className="overflow-hidden px-4 py-2 rounded border-solid border-[1.236px] border-zinc-900">
      {time}
    </div>
  );
}

export default TimeDisplay;