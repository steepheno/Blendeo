import { useState } from "react";
import { X } from "lucide-react";

const NotificationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      user: {
        name: "유리리",
        avatar: "/api/placeholder/40/40",
      },
      message: "님이 내 음악을 Blend 했어요!",
      timestamp: "방금 전",
      isRead: false,
    },
    {
      id: 2,
      user: {
        name: "민지",
        avatar: "/api/placeholder/40/40",
      },
      message: "님이 회원님의 게시물을 좋아합니다.",
      timestamp: "1시간 전",
      isRead: false,
    },
    {
      id: 3,
      user: {
        name: "하니",
        avatar: "/api/placeholder/40/40",
      },
      message: "님이 회원님을 팔로우하기 시작했습니다.",
      timestamp: "2시간 전",
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const markAsRead = (notificationId: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        {/* 알림 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-violet-700 hover:bg-violet-800 text-white rounded-full p-3 shadow-lg relative"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {unreadCount}
            </div>
          )}
        </button>

        {/* 알림 팝오버 */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 bg-white w-80 rounded-lg shadow-xl">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold">알림</h2>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    모두 읽음으로 표시
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 알림 목록 */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-3 mb-4 last:mb-0 p-2 rounded-lg transition-colors ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <img
                    src={notification.user.avatar}
                    alt={notification.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {notification.user.name}
                      </span>{" "}
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-500">
                      {notification.timestamp}
                    </span>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-violet-700 mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationButton;
