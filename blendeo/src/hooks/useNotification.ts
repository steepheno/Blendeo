// src/hooks/useNotification.ts
import { useEffect, useCallback } from "react";
import { getExistingNotifications } from "../api/notification";
import { useNotificationStore } from "../stores/notificationStore";
import { NotificationResponse } from "../types/api/notification";
import { Notification } from "../types/components/notification/notification";

export const useNotification = () => {
  const { notifications, setNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();

  const transformNotification = (
    apiNotification: NotificationResponse
  ): Notification => {
    const utcDate = new Date(apiNotification.createdAt);
    const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000); // UTC+9 수동 변환

    return {
      id: apiNotification.notificationId,
      user: {
        name: apiNotification.nickname,
        avatar: apiNotification.profileImage,
      },
      message: apiNotification.content,
      timestamp: kstDate.toLocaleString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      isRead: apiNotification.read,
    };
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const response: NotificationResponse[] = await getExistingNotifications();
      const transformedNotifications = response.map(transformNotification);
      setNotifications(transformedNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [setNotifications]);

  useEffect(() => {
    fetchNotifications();
    // 주기적으로 알림을 가져오기 위한 interval 설정
    const interval = setInterval(fetchNotifications, 30000); // 30초마다 갱신
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};
