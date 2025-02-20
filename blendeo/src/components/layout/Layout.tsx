import { ReactNode } from "react";
import Navbar from "./Searchbar";
import Sidebar from "./Sidebar";
import NotificationButton from "../common/NotificationButton";

const styles = `
  ::-webkit-scrollbar {
    display: none;
  }
`;

interface LayoutProps {
  children: ReactNode;
  showRightSidebar?: boolean;
  rightSidebarContent?: ReactNode;
  showNotification?: boolean;
}

interface DefaultRightSidebarProps {
  showNotification?: boolean;
}

const DefaultRightSidebar = ({
  showNotification = false,
}: DefaultRightSidebarProps) => (
  <div className="flex flex-col justify-start items-start">
    {showNotification && <NotificationButton />}
  </div>
);

const Layout = ({
  children,
  showRightSidebar = true,
  showNotification = false,
  rightSidebarContent = (
    <DefaultRightSidebar showNotification={showNotification} />
  ),
}: LayoutProps) => {
  return (
    <div className="flex overflow-hidden flex-col h-full">
      <style>{styles}</style>
      <Navbar />

      <div className="flex flex-wrap flex-1 gap-2.5 mt-2.5 size-full max-md:max-w-full">
        {/* Left Sidebar - 큰 화면에서 더 넓게, 태블릿에서 280px */}
        <div className="flex overflow-hidden flex-col w-[280px] xl:w-[310px] 2xl:w-[330px]">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 h-full">{children}</div>

        {/* Right Sidebar - 화면 크기에 따라 적응형으로 너비 조절 */}
        {showRightSidebar && (
          <div
            className="flex overflow-hidden flex-col transition-all duration-300
          w-[280px] xl:w-[320px] 2xl:w-[380px]
          max-w-[calc(50px+min(230px,max(0px,(100vw-1024px)*1.15)))]"
          >
            {rightSidebarContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
