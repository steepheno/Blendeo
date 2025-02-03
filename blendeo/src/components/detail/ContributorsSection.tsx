import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";

interface ContributorsSectionProps {
  projectId: number;
}

const ContributorsSection: React.FC<ContributorsSectionProps> = () => {
  const { followUser, unfollowUser, currentUser, getFollowings, followings } =
    useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // 현재 로그인한 사용자의 팔로잉 목록 가져오기
    if (currentUser) {
      getFollowings(currentUser.id);
    }
  }, [currentUser, getFollowings]);

  const handleFollowToggle = async (contributorId: number) => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      // followings?.followingIdList가 있는지 확인하고, 해당 유저가 팔로우 중인지 확인
      const isFollowing = followings?.followingIdList.includes(contributorId);

      if (isFollowing) {
        await unfollowUser(contributorId);
      } else {
        await followUser(contributorId);
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {currentUser?.followers?.map((contributor) => (
        <div key={contributor.follower} className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src="/api/placeholder/48/48"
              alt={contributor.following}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{contributor.following}</h3>
            <p className="text-sm text-gray-500">
              {contributor.follower} collaborations
            </p>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleFollowToggle(Number(contributor.follower))}
            className={`px-4 py-1 text-sm border rounded-full transition-colors ${
              followings?.followingIdList.includes(Number(contributor.follower))
                ? "bg-purple-600 text-white border-purple-600"
                : "border-purple-600 text-purple-600 hover:bg-purple-50"
            }`}
          >
            {followings?.followingIdList.includes(Number(contributor.follower))
              ? "Following"
              : "Follow"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ContributorsSection;
