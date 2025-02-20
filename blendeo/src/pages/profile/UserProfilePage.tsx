import { MessageSquare } from "lucide-react";
import { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import VideoGrid from "@/components/common/VideoGrid";
import VideoCard from "@/components/common/VideoCard";
import TabNavigation from "@/components/common/TabNavigation";
import { chatAPI } from "@/api/chat";

import { ProjectType } from "@/stores/userPageStore";
import useUserPageStore from "@/stores/userPageStore";
import { useAuthStore } from "@/stores/authStore";

import noUserImg from "@/assets/no_user.jpg";
import noHeaderImg from "@/assets/defaultHeader.png";
import FollowListModal from "@/components/follow/FollowListModal";

import { toast } from "sonner";

const useProfileData = (userId: number) => {
  const {
    user,
    userLoading,
    userError,
    followData,
    getCurrentProjects,
    getProjectLoading,
    getHasMoreProjects,
    fetchInitialData,
    setActiveTab,
  } = useUserPageStore();

  useEffect(() => {
    if (userId) {
      fetchInitialData(userId);
      setActiveTab("uploaded");
    }
  }, [userId, fetchInitialData, setActiveTab]);

  return {
    user,
    userLoading,
    userError,
    followData,
    getCurrentProjects,
    getProjectLoading,
    getHasMoreProjects,
  };
};

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const {
    user,
    userLoading,
    userError,
    followData,
    getCurrentProjects,
    getProjectLoading,
    getHasMoreProjects,
  } = useProfileData(parseInt(userId as string));

  const { activeTab, setActiveTab, loadMore, followUser, unfollowUser } =
    useUserPageStore();

  const [followModalType, setFollowModalType] = useState<
    "following" | "followers" | null
  >(null);

  const handleMessageClick = useCallback(async () => {
    if (!currentUser || !userId || !user) {
      toast.error("로그인 후에 메시지를 보낼 수 있어요!");
      navigate("/auth/signin", { state: { from: `/profile/${userId}` } });
      return;
    }

    try {
      const rooms = await chatAPI.getRooms();
      const existingRoom = rooms.find((room) => {
        const participants = room.participants || [];
        const participantIds = participants.map((p) => p.id);
        return (
          participants.length === 2 &&
          participantIds.includes(currentUser.id) &&
          participantIds.includes(parseInt(userId))
        );
      });

      if (existingRoom) {
        navigate(`/chat`, {
          state: { roomId: existingRoom.id, openChat: true },
        });
      } else {
        const response = await chatAPI.createRoom([
          currentUser.id,
          parseInt(userId),
        ]);

        if (!response) {
          throw new Error("채팅방 생성 응답이 없습니다.");
        }

        const roomId = response.roomId;
        if (!roomId) {
          throw new Error("생성된 채팅방 ID를 찾을 수 없습니다.");
        }

        navigate(`/chat`, {
          state: { roomId: roomId, openChat: true },
        });
      }
    } catch (error) {
      console.error("채팅방 처리 중 상세 오류:", error);
      if (error instanceof Error) {
        toast.error(`채팅방 생성 실패: ${error.message}`);
      } else {
        toast.error("채팅방을 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    }
  }, [currentUser, userId, user, navigate]);

  const handleFollowClick = useCallback(async () => {
    if (!userId || !user) return;

    try {
      if (followData.isFollowing) {
        await unfollowUser(parseInt(userId));
      } else {
        await followUser(parseInt(userId));
      }
    } catch (error) {
      toast.error("로그인 후에 팔로우할 수 있어요!");
      navigate("/auth/signin", { state: { from: `/profile/${userId}` } });
      console.error("Failed to follow/unfollow:", error);
    }
  }, [
    userId,
    user,
    followData.isFollowing,
    followUser,
    unfollowUser,
    navigate,
  ]);

  const handleFollowListClick = useCallback(
    (type: "following" | "followers") => {
      setFollowModalType(type);
    },
    []
  );

  const userTabs = [{ id: "uploaded", label: "업로드한 영상" }];

  const handleProjectClick = useCallback(
    (projectId: number) => {
      navigate(`/project/${projectId}`);
    },
    [navigate]
  );

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab as ProjectType);
    },
    [setActiveTab]
  );

  if (userLoading) {
    return (
      <Layout showNotification>
        <div className="w-full h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (userError || !user) {
    console.log(userError, user);

    return (
      <Layout showNotification>
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-xl text-gray-600">
            사용자를 찾을 수 없습니다.
          </div>
        </div>
      </Layout>
    );
  }

  const currentProjects = getCurrentProjects();
  const hasMore = getHasMoreProjects();
  const loading = getProjectLoading();

  return (
    <Layout showNotification>
      <div className="max-w-4xl mx-auto bg-white">
        {/* 배경 이미지 */}
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4">
          <img
            src={user.header || noHeaderImg}
            alt="Channel banner"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* 프로필 정보 섹션 */}
        <div className="flex px-4 mb-8">
          {/* 프로필 이미지 */}
          <div className="flex items-center mr-6">
            <img
              src={user.profileImage || noUserImg}
              alt={`${user.nickname}'s profile`}
              className="w-20 h-20 rounded-full"
            />
          </div>

          <div className="flex-grow py-2">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold">{user.nickname}</h1>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <p className="text-gray-600 text-sm mt-1">{user.intro}</p>

                <div className="flex gap-4 mt-2">
                  <span
                    className="text-gray-700 cursor-pointer hover:text-blue-600"
                    onClick={() => handleFollowListClick("following")}
                  >
                    <strong>{followData.followingCount}</strong> 팔로잉
                  </span>
                  <span
                    className="text-gray-700 cursor-pointer hover:text-blue-600"
                    onClick={() => handleFollowListClick("followers")}
                  >
                    <strong>{followData.followerCount}</strong> 팔로워
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  {user.instruments.map((instrument) => (
                    <span
                      key={instrument.instrument_id}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {instrument.instrument_name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleFollowClick}
                  disabled={followData.loading}
                  className={`px-6 py-2 rounded-full ${
                    followData.isFollowing
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } disabled:opacity-50`}
                >
                  {followData.loading
                    ? "처리 중..."
                    : followData.isFollowing
                      ? "언팔로우"
                      : "팔로우"}
                </button>
                <button
                  onClick={handleMessageClick}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <MessageSquare className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <TabNavigation
          activeTab={activeTab}
          tabs={userTabs}
          onTabChange={handleTabChange}
        />

        <VideoGrid type="uploaded">
          {currentProjects.map((project) => (
            <VideoCard
              key={`project-${project.projectId}`}
              project={project}
              onClick={() => handleProjectClick(project.projectId)}
            />
          ))}
        </VideoGrid>

        {hasMore && (
          <div className="flex justify-center mt-4 mb-8">
            <button
              type="button"
              onClick={() => loadMore()}
              disabled={loading}
              className="px-8 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      <FollowListModal
        isOpen={followModalType !== null}
        onClose={() => setFollowModalType(null)}
        type={followModalType || "following"}
        followData={followData}
      />
    </Layout>
  );
};

export default UserProfile;
