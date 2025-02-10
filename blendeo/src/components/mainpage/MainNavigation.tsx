// @/components/mainpage/MainNavigation.tsx
interface MainNavigationProps {
  activeTab: "forYou" | "ranking" | "latest";
  onTabChange: (tab: "forYou" | "ranking" | "latest") => void;
}

const MainNavigation: React.FC<MainNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "forYou", label: "For you" },
    { id: "ranking", label: "Ranking" },
    { id: "latest", label: "Latest" }
  ];

  return (
    <div className="flex flex-col pb-3 mt-2.5 w-full text-sm font-bold">
      <div className="flex gap-4 border-b border-zinc-200">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id as "forYou" | "ranking" | "latest")}
            className={`px-4 py-2 transition-colors duration-200 border-b-2 ${
              activeTab === id
                ? "text-neutral-900 border-neutral-900"
                : "text-slate-500 border-transparent hover:text-neutral-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainNavigation;