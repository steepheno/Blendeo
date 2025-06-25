import * as React from "react";
import TimeDisplay from "./TimeDisplay";

export const TimerSection: React.FC = () => {
  const times = [
    "00 : 01 : 48 : 17",
    "00 : 03 : 24 : 00"
  ];

  return (
    <div className="flex flex-wrap gap-10 mt-6 text-sm tracking-normal text-center text-white max-md:max-w-full">
      {times.map((time, index) => (
        <TimeDisplay key={index} time={time} />
      ))}
    </div>
  );
}