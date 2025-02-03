// components/layout/Layout.tsx
import { ReactNode } from "react";
import Navbar from "./Searchbar";
import Sidebar from "./Sidebar";
import NotificationButton from "../common/NotificationButton";

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
    {/* 기본 우측 사이드바 내용 */}
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
    <div className="flex overflow-hidden flex-col bg-white">
      <Navbar />

      <div className="flex flex-wrap flex-1 gap-2.5 mt-2.5 size-full max-md:max-w-full">
        <div className="flex overflow-hidden flex-col min-w-[240px] w-[330px]">
          <Sidebar />
        </div>
        <div className="flex-1 min-w-0">{children}</div>
        {showRightSidebar && (
          <div className="flex overflow-hidden flex-col min-w-[240px] w-[330px]">
            {rightSidebarContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
