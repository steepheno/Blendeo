// hooks/useNotifications.ts
import { useState, useEffect } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    // 초기 알림 데이터 로드
    const fetchNotifications = async () => {
      // API 호출을 시뮬레이션하는 예시 데이터
      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "새로운 메시지",
          message: "새로운 메시지가 도착했습니다.",
          timestamp: new Date().toISOString(),
          isRead: false,
        },
        {
          id: "2",
          title: "시스템 알림",
          message: "시스템 점검 예정입니다.",
          timestamp: new Date().toISOString(),
          isRead: false,
        },
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const addNotification = (notification: Omit<Notification, "id">) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(), // 간단한 ID 생성
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification,
  };
};
