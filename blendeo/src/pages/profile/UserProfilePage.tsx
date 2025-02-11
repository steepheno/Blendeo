import { MessageSquare } from 'lucide-react';
import { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Layout from '@/components/layout/Layout';
import VideoGrid from '@/components/common/VideoGrid';
import VideoCard from '@/components/common/VideoCard';
import TabNavigation from '@/components/common/TabNavigation';

import { ProjectType } from '@/stores/userPageStore';
import useUserPageStore from '@/stores/userPageStore';

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [followCounts, setFollowCounts] = useState({ followingCount: 0, followerCount: 0 });
    
    const {
        user,
        userLoading,
        fetchUser,
        activeTab,
        getCurrentProjects,
        getIsLoading,
        getHasMore,
        setActiveTab,
        loadMore,
        fetchProjects,
        followUser,
        unfollowUser,
        getFollowCounts,
        followLoading,
        isFollowing,
        checkIsFollowing,
    } = useUserPageStore();

    const projects = getCurrentProjects();
    const loading = getIsLoading();
    const hasMore = getHasMore();

    // 팔로우 수 fetch
    const fetchFollowCounts = useCallback(async () => {
        if (userId) {
            try {
                const counts = await getFollowCounts(parseInt(userId));
                setFollowCounts(counts);
            } catch (error) {
                console.error('Failed to fetch follow counts:', error);
            }
        }
    }, [userId, getFollowCounts]);

    // userId가 변경될 때마다 유저 정보와 팔로우 수 fetch
    useEffect(() => {
        if (userId) {
            const id = parseInt(userId, 10);
            if (!isNaN(id)) {
                fetchUser(id);
                fetchFollowCounts();
                checkIsFollowing(id);
            }
        }
    }, [userId, fetchUser, fetchFollowCounts, checkIsFollowing]);

    const handleFollowClick = useCallback(async () => {
        if (!userId || !user) return;
        
        try {
            if (isFollowing) {
                await unfollowUser(parseInt(userId));
            } else {
                await followUser(parseInt(userId));
            }
            // 팔로우 수 갱신
            fetchFollowCounts();
        } catch (error) {
            console.error('Failed to follow/unfollow:', error);
        }
    }, [userId, user, followUser, unfollowUser, fetchFollowCounts, isFollowing]);

    const userTabs = [
        { id: "uploaded", label: "업로드한 영상" },
        // { id: "liked", label: "마음에 들어한 영상" },
    ];

    const handleProjectClick = useCallback((projectId: number) => {
        navigate(`/project/${projectId}`);
    }, [navigate]);

    const handleTabChange = useCallback((tab: string) => {
        setActiveTab(tab as ProjectType);
    }, [setActiveTab]);

    useEffect(() => {
        fetchProjects(activeTab);
    }, [activeTab, fetchProjects]);

    if (userLoading) return <div>Loading...</div>;
    if (!user) return <div>User not found</div>;

    return (
        <Layout showNotification={true}>
            <div className="max-w-4xl mx-auto bg-white">
                {/* 배경 이미지 */}
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4">
                    <img
                        src="/api/placeholder/1200/300"
                        alt="Channel banner"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>

                {/* 프로필 정보 섹션 */}
                <div className="flex px-4 mb-8">
                    {/* 프로필 이미지 */}
                    <div className="flex items-center mr-6">
                        <img
                            src={user.profileImage || "/api/placeholder/80/80"}
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
                                    <span className="text-gray-700">
                                        팔로잉 <strong>{followCounts.followingCount}</strong>
                                    </span>
                                    <span className="text-gray-700">
                                        팔로워 <strong>{followCounts.followerCount}</strong>
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
                                    disabled={followLoading}
                                    className={`px-6 py-2 rounded-full ${
                                        isFollowing
                                            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    } disabled:opacity-50`}
                                >
                                    {followLoading
                                        ? '처리 중...'
                                        : isFollowing
                                        ? '언팔로우'
                                        : '팔로우'}
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full">
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
                    {projects.map((project) => (
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
        </Layout>
    );
};

export default UserProfile;