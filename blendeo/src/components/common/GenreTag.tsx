import * as React from "react";
import { GenreTagProps } from "@/types/components/main/genreTag";

const GenreTag: React.FC<GenreTagProps> = ({ label, width }) => {
  return (
    <div
      className={`flex gap-2 justify-center items-center px-4 bg-gray-100 rounded-2xl min-h-[32px] w-[${width}]`}
    >
      <div className="flex-1 shrink self-stretch my-auto w-full">{label}</div>
    </div>
  );
};

export default GenreTag;
