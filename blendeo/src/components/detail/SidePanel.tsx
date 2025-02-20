import { X } from "lucide-react";
import { Button } from "../ui/button";

const TAB_TITLES = {
  comments: "댓글",
  settings: "설정",
  contributors: "기여자",
  showTree: "트리 보기",
} as const;

interface SidePanelProps {
  activeTab: "comments" | "settings" | "contributors" | "showTree" | null;
  content: React.ReactNode;
  onClose: () => void;
}

const SidePanel = ({ activeTab, content, onClose }: SidePanelProps) => {
  if (!activeTab) return null;

  return (
    <div className="w-96 flex flex-col rounded-lg border border-1 border-custom-lavender bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-custom-lavender rounded-t-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <span className="text-lg text-gray-500 font-semibold">
            {TAB_TITLES[activeTab]}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-b-lg">{content}</div>
    </div>
  );
};

export default SidePanel;
