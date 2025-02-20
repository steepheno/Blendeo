import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as userApi from "@/api/user";
import type {
  User,
  UpdateUserRequest,
  FollowingResponse,
  FollowerResponse,
} from "@/types/api/user";

interface UserStore {
  currentUser: User | null;
  followings: FollowingResponse | null;
  followers: FollowerResponse | null;
  isLoading: boolean;
  error: string | null;
  updateUser: (data: UpdateUserRequest) => Promise<void>;
  getUser: (id: number) => Promise<void>;
  followUser: (targetUserId: number) => Promise<void>;
  unfollowUser: (targetUserId: number) => Promise<void>;
  getFollowings: (userId: number) => Promise<void>;
  getFollowers: (userId: number) => Promise<void>;
  setCurrentUser: (user: User | null) => void;
  clearError: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    (set, get) => ({
      currentUser: null,
      followings: null,
      followers: null,
      isLoading: false,
      error: null,

      setCurrentUser: (user) => {
        set({ currentUser: user });
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const currentUser = get().currentUser;
          if (!currentUser?.id) {
            throw new Error("로그인이 필요합니다.");
          }

          await userApi.updateProfile(data);
          const updatedUser = await userApi.getUser(currentUser.id);
          set({ currentUser: updatedUser });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "프로필 업데이트 중 오류가 발생했습니다.",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      getUser: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const user = await userApi.getUser(id);
          set({ currentUser: user });
          return user;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "사용자 정보를 불러오는 중 오류가 발생했습니다.",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      followUser: async (targetUserId) => {
        try {
          set({ isLoading: true, error: null });
          const currentUser = get().currentUser;
          if (!currentUser?.id) {
            throw new Error("로그인이 필요합니다.");
          }

          await userApi.followUser(targetUserId);

          // 팔로우 후 팔로잉/팔로워 목록 모두 갱신
          const [newFollowings, newFollowers] = await Promise.all([
            userApi.getFollowings(currentUser.id),
            userApi.getFollowers(targetUserId),
          ]);

          set({
            followings: newFollowings,
            followers: newFollowers,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "팔로우 중 오류가 발생했습니다.",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      unfollowUser: async (targetUserId) => {
        try {
          set({ isLoading: true, error: null });
          const currentUser = get().currentUser;
          if (!currentUser?.id) {
            throw new Error("로그인이 필요합니다.");
          }

          await userApi.unfollowUser(targetUserId);

          // 언팔로우 후 팔로잉/팔로워 목록 모두 갱신
          const [newFollowings, newFollowers] = await Promise.all([
            userApi.getFollowings(currentUser.id),
            userApi.getFollowers(targetUserId),
          ]);

          set({
            followings: newFollowings,
            followers: newFollowers,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "언팔로우 중 오류가 발생했습니다.",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      getFollowings: async (userId) => {
        try {
          set({ isLoading: true, error: null });
          const followings = await userApi.getFollowings(userId);
          set({ followings });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "팔로잉 목록을 불러오는 중 오류가 발생했습니다.",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      getFollowers: async (userId) => {
        try {
          set({ isLoading: true, error: null });
          const followers = await userApi.getFollowers(userId);
          set({ followers });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "팔로워 목록을 불러오는 중 오류가 발생했습니다.",
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: "user-store" }
  )
);
