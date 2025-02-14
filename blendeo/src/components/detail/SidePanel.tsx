import { SidePanelProps } from "@/types/components/video/videoDetail";

// Side Panel Component
const SidePanel: React.FC<SidePanelProps> = ({ activeTab, content }) => {
  if (!activeTab) return null;

  return (
    <div className="w-96 border-l flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium">
          {activeTab === "comments" ? "Comments" : (activeTab === "settings" ? "Settings" : "Contributors")}
        </h2>
      </div>
      {content}
    </div>
  );
};

export default SidePanel;
