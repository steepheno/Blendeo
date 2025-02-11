import { MessageSquare } from 'lucide-react';
import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Layout from '@/components/layout/Layout';
import VideoGrid from '@/components/common/VideoGrid';
import VideoCard from '@/components/common/VideoCard';
import TabNavigation from '@/components/common/TabNavigation';

import { ProjectType } from '@/stores/userPageStore';
import useUserPageStore from '@/stores/userPageStore';

const UserProfile = () => {
    const { userId } = useParams(); // URL에서 userId 추출
    const navigate = useNavigate();
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
    } = useUserPageStore();

    const projects = getCurrentProjects();
    const loading = getIsLoading();
    const hasMore = getHasMore();

    // userId가 변경될 때마다 유저 정보 fetch
    useEffect(() => {
        if (userId) {
            const id = parseInt(userId, 10);
            if (!isNaN(id)) {
                fetchUser(id);
            }
        }
    }, [userId, fetchUser]);

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
                                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                                    팔로우
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