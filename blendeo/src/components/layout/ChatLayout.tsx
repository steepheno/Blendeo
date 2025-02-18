import Navbar from "./Searchbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
  showNotification?: boolean;
}

const ChatLayout: React.FC<LayoutProps> = ({
  children,
  showRightSidebar,
  showNotification,
}) => {
  return (
    <div className="flex overflow-hidden flex-col bg-white">
      <Navbar showNotification={showNotification} />

      <div className="flex flex-wrap flex-1 gap-0 size-full max-md:max-w-full">
        {/* Left Sidebar - 큰 화면에서 더 넓게, 태블릿에서 280px */}
        <div className="flex overflow-hidden flex-col w-[280px] xl:w-[310px] 2xl:w-[330px]">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">{children}</div>

        {showRightSidebar && (
          <div className="w-[280px] xl:w-[310px] 2xl:w-[330px]">
            {/* 오른쪽 사이드바 내용 */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
