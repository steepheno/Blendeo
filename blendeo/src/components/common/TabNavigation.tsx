// @/components/common/TabNavigation.tsx
interface TabNavigationProps {
  activeTab: string;
  tabs: Array<{id: string; label: string}>;
  onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  tabs,
  onTabChange,
}) => {
  return (
    <div className="flex flex-col pb-3 mt-2.5 w-full text-sm font-bold text-slate-500">
      <div className="flex flex-wrap justify-between items-start px-4 w-full border-b border-zinc-200">
        {tabs.map(({ id, label }) => (
          <div
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col flex-1 shrink justify-center items-center pt-4 pb-3.5 border-gray-200 basis-0 border-b-[3px] min-w-[240px] cursor-pointer
              ${activeTab === id ? "text-neutral-900 border-neutral-900" : "border-transparent"}`}
          >
            <div>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;