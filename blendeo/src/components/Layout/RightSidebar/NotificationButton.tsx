// components/Layout/RightSidebar/NotificationButton.tsx
import { Bell } from "lucide-react";

interface NotificationButtonProps {
  unreadCount?: number;
  onClick: () => void;
}

const NotificationButton = ({
  unreadCount = 0,
  onClick,
}: NotificationButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg w-full"
  >
    <div className="relative">
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
    <span>알림</span>
  </button>
);

export default NotificationButton;
