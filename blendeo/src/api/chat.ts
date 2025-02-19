// src/api/chat.ts
import axiosInstance from "./axios";
import type {
  ChatRoom,
  GetMessagesResponse,
  RoomParticipant,
  SearchUserResponse,
  EditRoomNameRequest,
  CreateRoomResponse,
} from "@/types/api/chat";
import { AxiosError } from "axios";

export const chatAPI = {
  /**
   * 새로운 채팅방을 생성하는 함수
   */
  createRoom: async (userIds: number[]): Promise<CreateRoomResponse> => {
    try {
      const params = new URLSearchParams();
      userIds.forEach((id) => params.append("userIds", id.toString()));

      const response = await axiosInstance.post<CreateRoomResponse>(
        `/chat/rooms/create?${params.toString()}`,
        {}
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 400) {
          throw new Error("잘못된 요청입니다");
        } else if (status === 401) {
          throw new Error("인증이 필요합니다");
        }
        throw new Error("채팅방 생성에 실패했습니다");
      }
      throw error;
    }
  },
  /**
   * 사용자의 모든 채팅방 목록을 조회하는 함수
   */
  getRooms: async () => {
    try {
      const response = await axiosInstance.get<ChatRoom[]>("/chat/my/rooms");
      console.log(response);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("ChatAPI getRooms error:", error);
      }
      throw error;
    }
  },

  /**
   * 특정 채팅방의 메시지 내역을 조회하는 함수
   */
  getRoomMessages: async (roomId: number) => {
    try {
      const response = await axiosInstance.get<GetMessagesResponse>(
        `/chat/rooms/${roomId}/messages`
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("ChatAPI getRoomMessages error:", error);
      }
      throw error;
    }
  },

  /**
   * 이메일로 사용자를 검색하는 함수
   */
  searchUserByEmail: async (
    email: string,
    page: number = 0,
    size: number = 10
  ) => {
    try {
      const response = await axiosInstance.get<SearchUserResponse>(
        "/chat/search/user/email",
        {
          params: {
            email,
            page,
            size,
          },
        }
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("ChatAPI searchUserByEmail error:", error);
      }
      throw error;
    }
  },

  /**
   * 채팅방 참가자 목록을 조회하는 함수
   */
  getRoomParticipants: async (roomId: number) => {
    try {
      const response = await axiosInstance.get<RoomParticipant[]>(
        "/room/participants",
        {
          params: { roomId },
        }
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("ChatAPI getRoomParticipants error:", error);
      }
      throw error;
    }
  },

  /**
   * 채팅방 이름을 수정하는 함수
   */
  editRoomName: async (request: EditRoomNameRequest) => {
    try {
      const response = await axiosInstance.patch(
        `/chat/room/name/edit?roomId=${request.roomId}&roomName=${encodeURIComponent(request.roomName)}`,
        null // body 대신 query parameter 사용
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("ChatAPI editRoomName error:", error);
        if (error.response) {
          const status = error.response.status;
          if (status === 401) {
            throw new Error("인증이 필요합니다");
          } else if (status === 403) {
            throw new Error("권한이 없습니다");
          } else if (status === 404) {
            throw new Error("채팅방을 찾을 수 없습니다");
          }
        }
      }
      throw new Error("채팅방 이름 수정에 실패했습니다");
    }
  },
};

export default chatAPI;
