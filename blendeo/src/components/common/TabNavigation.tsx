// TabNavigation.tsx
interface TabNavigationProps {
  activeTab: "uploaded" | "liked";
  onTabChange: (tab: "uploaded" | "liked") => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="mt-8 border-b">
      <div className="flex gap-4">
        <button
          onClick={() => onTabChange("uploaded")}
          className={`px-4 py-2 transition-colors duration-200 border-b-2 ${
            activeTab === "uploaded"
              ? "text-purple-600 border-purple-600"
              : "text-gray-600 border-transparent hover:text-purple-600"
          }`}
        >
          업로드한 영상
        </button>
        <button
          onClick={() => onTabChange("liked")}
          className={`px-4 py-2 transition-colors duration-200 border-b-2 ${
            activeTab === "liked"
              ? "text-purple-600 border-purple-600"
              : "text-gray-600 border-transparent hover:text-purple-600"
          }`}
        >
          좋아요 한 영상
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
