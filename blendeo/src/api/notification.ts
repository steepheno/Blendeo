import axiosInstance from "./axios";
import { NotificationResponse } from "../types/api/notification";

export const getExistingNotifications = async () => {
  const response =
    await axiosInstance.get<NotificationResponse[]>(`/notify/get/week`);
  return response;
};
