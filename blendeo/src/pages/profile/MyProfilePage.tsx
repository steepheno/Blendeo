import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ProfileSection from "@/components/profile/ProfileSection";
import VideoSection from "@/components/profile/VideoSection";
import { useUser, useAuthStore } from "@/stores/authStore";
import { getUser, getFollowers, getFollowings } from "@/api/user";
import { User, FollowResponse } from "@/types/api/user";
import { useNavigate } from "react-router-dom";

console.log("\n=== MyProfilePage Script Loaded ===");

const MyProfilePage = () => {
  console.log("\n=== MyProfilePage Component Initializing ===");
  const navigate = useNavigate();
  const authUser = useUser();
  const { isAuthenticated } = useAuthStore();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [followData, setFollowData] = useState<FollowResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tags = [
    {
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/3cfd686c8979fc9df87b0da219112b1086c7de88b99667a87bc65c7b4ae4f2db?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882",
      label: "# 드럼",
    },
    {
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/ce8ace9898899cd56b940c9f933a7aaaad5cbcea74bd1a9c7bf53b5dc1f4f4f9?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882",
      label: "# 베이스",
    },
  ];

  const videos = [
    {
      thumbnailSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/87be716c5472827d2c4d008ebc545a462b2403c9b5751fae38c20e7dbb051624?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882",
      title: "대학 밴드 동아리 cover 영상",
      username: "Minseo-Kim",
      views: "7만회",
      timeAgo: "13시간 전",
      tags: ["드럼", "베이스", "기타", "키보드"],
    },
    {
      thumbnailSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/87be716c5472827d2c4d008ebc545a462b2403c9b5751fae38c20e7dbb051624?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882",
      title: "대학 밴드 동아리 cover 영상",
      username: "Minseo-Kim",
      views: "7만회",
      timeAgo: "13시간 전",
      tags: ["드럼", "베이스", "기타", "키보드"],
    },
    {
      thumbnailSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/87be716c5472827d2c4d008ebc545a462b2403c9b5751fae38c20e7dbb051624?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882",
      title: "대학 밴드 동아리 cover 영상",
      username: "Minseo-Kim",
      views: "7만회",
      timeAgo: "13시간 전",
      tags: ["드럼", "베이스", "기타", "키보드"],
    },
    {
      thumbnailSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/87be716c5472827d2c4d008ebc545a462b2403c9b5751fae38c20e7dbb051624?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882",
      title: "대학 밴드 동아리 cover 영상",
      username: "Minseo-Kim",
      views: "7만회",
      timeAgo: "13시간 전",
      tags: ["드럼", "베이스", "기타", "키보드"],
    },
    {
      thumbnailSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d3644dc7fb6e5db4c22fd06d9d7da0d2c0e4beb30bf8c8ecf3ebab4f3bb86a85?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882",
      title: "대학 밴드 동아리 cover 영상",
      username: "Minseo-Kim",
      views: "7만회",
      timeAgo: "13시간 전",
      tags: ["드럼", "베이스", "기타", "키보드"],
    },
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isAuthenticated || !authUser?.id) {
        console.log("Auth check failed:", {
          isAuthenticated,
          userId: authUser?.id,
        });
        setError("인증이 필요합니다");
        navigate("/auth/signin", { state: { from: "/profile/me" } });
        return;
      }

      try {
        console.log("Starting API calls for user:", authUser.id);
        setIsLoading(true);
        setError(null);

        const [userResponse, followersResponse, followingsResponse] =
          await Promise.all([
            getUser(authUser.id),
            getFollowers(authUser.id),
            getFollowings(authUser.id),
          ]);

        setProfileData(userResponse as User);

        const followingsData = followingsResponse as FollowResponse;
        const followersData = followersResponse as FollowResponse;

        const combinedFollowData: FollowResponse = {
          followingIdList: followingsData.followingIdList,
          followingNicknameList: followingsData.followingNicknameList,
          followingCount: followingsData.followingCount,
          followerIdList: followersData.followerIdList,
          followerNicknameList: followersData.followerNicknameList,
          followerCount: followersData.followerCount,
        };

        setFollowData(combinedFollowData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "프로필을 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [authUser?.id, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <Layout showNotification>
        <div className="w-full h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error || !profileData) {
    return (
      <Layout showNotification>
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-xl text-gray-600">
            {error || "프로필을 불러올 수 없습니다."}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showNotification>
      <div className="w-full">
        <ProfileSection
          username={profileData.nickname}
          displayName={profileData.nickname}
          userAvatar={profileData.profileImage || ""}
          tags={tags}
          followingCount={followData?.followingCount?.toString() || "0"}
          followerCount={followData?.followerCount?.toString() || "0"}
        />
        <VideoSection title="내 영상들" videos={videos} />
        <VideoSection title="좋아요 누른 영상들" videos={videos} />
      </div>
    </Layout>
  );
};

export default MyProfilePage;
