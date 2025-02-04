import { useUserStore } from "@/stores/userStore";
import { useProjectStore } from "@/stores/projectStore";
import { useEffect, useState, useCallback } from "react";
import { Loader2, AlertCircle, UserPlus, UserMinus } from "lucide-react";
import type { User } from "@/types/api/user";

interface ContributorsSectionProps {
  projectId: number;
}

const ContributorsSection: React.FC<ContributorsSectionProps> = ({
  projectId,
}) => {
  const { followUser, unfollowUser, currentUser, getFollowings, followings } =
    useUserStore();

  const { currentProject, getProjectContributors, contributors } =
    useProjectStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;

    try {
      setError(null);
      setIsLoading(true);
      await Promise.all([
        getProjectContributors(projectId),
        getFollowings(currentUser.id),
      ]);
    } catch (err) {
      setError("Failed to load contributors");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, projectId, getProjectContributors, getFollowings]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFollowToggle = async (contributorId: number) => {
    if (!currentUser) {
      setError("Please sign in to follow contributors");
      return;
    }

    setIsLoading(true);
    try {
      const isFollowing = followings?.followingIdList.includes(contributorId);

      if (isFollowing) {
        await unfollowUser(contributorId);
      } else {
        await followUser(contributorId);
      }
      setError(null);
    } catch (error) {
      setError("Failed to update following status");
      console.error("Failed to toggle follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">
          Contributors ({contributors.length})
        </h2>

        <div className="space-y-4">
          {/* Original Author */}
          {currentProject && (
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={
                    currentProject.author.profileImage ||
                    "/api/placeholder/48/48"
                  }
                  alt={currentProject.author.nickname}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">
                  {currentProject.author.nickname}
                </h3>
                <p className="text-sm text-purple-600">Original Creator</p>
              </div>
              {currentUser?.id !== currentProject.author.id && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleFollowToggle(currentProject.author.id)}
                  className={`
                    px-4 py-1.5 text-sm rounded-full transition-colors
                    flex items-center gap-2
                    ${
                      followings?.followingIdList.includes(
                        currentProject.author.id
                      )
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "border border-purple-600 text-purple-600 hover:bg-purple-50"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : followings?.followingIdList.includes(
                      currentProject.author.id
                    ) ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Contributors List */}
          {contributors.length > 0 ? (
            contributors.map((contributor: User) => (
              <div
                key={contributor.id}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={contributor.profileImage || "/api/placeholder/48/48"}
                    alt={contributor.nickname}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{contributor.nickname}</h3>
                  <p className="text-sm text-gray-500">Contributor</p>
                </div>
                {currentUser?.id !== contributor.id && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleFollowToggle(contributor.id)}
                    className={`
                      px-4 py-1.5 text-sm rounded-full transition-colors
                      flex items-center gap-2
                      ${
                        followings?.followingIdList.includes(contributor.id)
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "border border-purple-600 text-purple-600 hover:bg-purple-50"
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : followings?.followingIdList.includes(contributor.id) ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Follow
                      </>
                    )}
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No additional contributors yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributorsSection;
