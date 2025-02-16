import { SidePanelProps } from "@/types/components/video/videoDetail";
import { X } from "lucide-react";
import { Button } from "../ui/button";

const TAB_TITLES = {
  comments: "댓글",
  settings: "설정",
  contributors: "기여자",
  
} as const;

const SidePanel = ({ activeTab, content }: SidePanelProps) => {
  if (!activeTab) return null;

  return (
    <div className="w-96 bg-white flex flex-col rounded-lg border border-1 border-custom-lavender bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-custom-lavender rounded-t-lg">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={() => {}}
          >
            <X className="h-4 w-4" />
          </Button>
          <span className="text-lg text-gray-500 font-semibold">{TAB_TITLES[activeTab]}</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-b-lg">
        {content}
      </div>
    </div>
  );
};

export default SidePanel;
