import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as userApi from "@/api/user";
import type { User, UpdateUserRequest, FollowResponse } from "@/types/api/user";

interface UserStore {
  currentUser: User | null;
  followings: FollowResponse | null;
  followers: FollowResponse | null;
  updateUser: (data: UpdateUserRequest) => Promise<void>;
  getUser: (id: number) => Promise<void>;
  followUser: (userId: number) => Promise<void>;
  unfollowUser: (userId: number) => Promise<void>;
  getFollowings: (userId: number) => Promise<void>;
  getFollowers: (userId: number) => Promise<void>;
  setCurrentUser: (user: User | null) => void; // 현재 사용자 설정 함수 추가
}

export const useUserStore = create<UserStore>()(
  devtools(
    (set, get) => ({
      currentUser: null,
      followings: null,
      followers: null,

      setCurrentUser: (user) => {
        set({ currentUser: user });
      },

      updateUser: async (data) => {
        const currentUser = get().currentUser;
        await userApi.updateProfile(data);
        if (currentUser?.id) {
          const updatedUser = await userApi.getUser(currentUser.id);
          set({ currentUser: updatedUser });
        }
      },

      getUser: async (id) => {
        const user = await userApi.getUser(id);
        set({ currentUser: user });
        return user;
      },

      followUser: async (userId) => {
        await userApi.followUser(userId);
        const followings = await userApi.getFollowings(userId);
        set({ followings });
      },

      unfollowUser: async (userId) => {
        await userApi.unfollowUser(userId);
        const followings = await userApi.getFollowings(userId);
        set({ followings });
      },

      getFollowings: async (userId) => {
        const followings = await userApi.getFollowings(userId);
        set({ followings });
      },

      getFollowers: async (userId) => {
        const followers = await userApi.getFollowers(userId);
        set({ followers });
      },
    }),
    { name: "user-store" }
  )
);
