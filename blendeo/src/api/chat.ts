import axiosInstance from "./axios";
import type {
  ChatRoom,
  CreateRoomRequest,
  GetMessagesResponse,
  SearchUserResponse,
} from "@/types/api/chat";

export const chatAPI = {
  // 채팅방 목록 조회
  getRooms: async () => {
    try {
      const response = await axiosInstance.get<ChatRoom[]>("/chat/my/rooms");
      console.log("ChatAPI getRooms response:", response);
      return response as ChatRoom[];
    } catch (error) {
      console.error("ChatAPI getRooms error:", error);
      throw error;
    }
  },

  // 특정 채팅방의 메시지 조회
  getRoomMessages: async (roomId: number) => {
    const response = await axiosInstance.get<GetMessagesResponse>(
      `/chat/rooms/${roomId}/messages`
    );
    return response;
  },

  // 새로운 채팅방 생성
  createRoom: async (data: CreateRoomRequest) => {
    const response = await axiosInstance.post<ChatRoom>(
      `/chat/rooms/create?roomName=${data.roomName}`
    );
    return response;
  },

  searchUserByEmail: async (email: string): Promise<SearchUserResponse[]> => {
    const response = await axiosInstance.get<SearchUserResponse[]>(
      `/chat/search/user/email`,
      {
        params: {
          email,
          page: 0,
          size: 10,
        },
      }
    );
    return response;
  },

  // 이메일로 채팅방에 사용자 초대
  inviteUserByEmail: async (roomId: number, email: string) => {
    try {
      const response = await axiosInstance.post<string>(
        `/chat/rooms/${roomId}/invite`,
        { email }
      );
      return response;
    } catch (error) {
      console.error("ChatAPI inviteUserByEmail error:", error);
      throw error;
    }
  },
};
