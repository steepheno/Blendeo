import { useEffect, useCallback } from "react";
import { UserCog } from 'lucide-react';
import { useNavigate } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import VideoGrid from "@/components/common/VideoGrid";
import VideoCard from "@/components/common/VideoCard";
import TabNavigation from "@/components/common/TabNavigation";

import { useUser, useAuthStore } from "@/stores/authStore";
import useMyPageStore from "@/stores/myPageStore";
import { ProjectType } from "@/stores/myPageStore";

import { CACHE_DURATION, PAGE_SIZE } from "@/stores/myPageStore";

const MyProfilePage = () => {
  const navigate = useNavigate();
  const authUser = useUser();
  const { isAuthenticated } = useAuthStore();

  const {
    // 프로필 관련 상태와 액션
    profile,
    profileLoading,
    profileError,
    fetchProfile,

    // 프로젝트 관련 상태와 액션
    activeTab,
    projectStates,
    projectLoading,
    setActiveTab,
    loadMore,
    fetchProjects,

    // 편집 관련 상태와 액션
    isEditMode,
    editData,
    setEditMode,
    updateEditData,
    resetEditData,
    saveProfile,

    //Follow 관련 정보
    followData,
    fetchFollowData
  } = useMyPageStore();

  const handleFileChange = (type: 'profileImage' | 'header') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateEditData({ [type]: file });
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await saveProfile();
    } catch (err) {
      console.error('프로필 업데이트 실패:', err);
    }
  };

  const userTabs = [
    { id: "uploaded", label: "업로드한 영상" },
    { id: "liked", label: "마음에 들어한 영상" },
    { id: "scraped", label: "스크랩한 영상" },
  ];

  const handleProjectClick = useCallback((projectId: number) => {
    navigate(`/project/${projectId}`);
  }, [navigate]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as ProjectType);
  }, [setActiveTab]);

  // 초기 데이터 로딩을 위한 useEffect
  useEffect(() => {
    if (!isAuthenticated || !authUser?.id) {
      navigate("/auth/signin", { state: { from: "/profile/me" } });
      return;
    }

    // 최초 로딩시에만 프로필과 팔로우 데이터를 가져옴
    Promise.all([
      fetchProfile(authUser.id),
      fetchFollowData(authUser.id)
    ]);
  }, [authUser?.id, isAuthenticated, navigate, fetchProfile, fetchFollowData]);

  // 탭 변경을 위한 별도의 useEffect
  useEffect(() => {
    const { lastUpdated, projectStates } = useMyPageStore.getState();
    const lastUpdate = lastUpdated[activeTab];
    const hasExpired = !lastUpdate || Date.now() - lastUpdate > CACHE_DURATION;
    
    // 데이터가 없거나 캐시가 만료된 경우에만 새로 불러옴
    if (projectStates[activeTab].items.length === 0 || hasExpired) {
      fetchProjects(activeTab, PAGE_SIZE, true);
    }
  }, [activeTab, fetchProjects]);

  if (profileLoading) {
    return (
      <Layout showNotification>
        <div className="w-full h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (profileError || !profile) {
    return (
      <Layout showNotification>
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-xl text-gray-600">
            {profileError?.message || "프로필을 불러올 수 없습니다."}
          </div>
        </div>
      </Layout>
    );
  }

  const currentProjects = projectStates[activeTab].items;
  const hasMore = projectStates[activeTab].hasMore;
  const loading = projectLoading[activeTab];

  return (
    <Layout showNotification>
      <div className="max-w-4xl mx-auto bg-white">
        {/* 배경 이미지 */}
        <div className="relative w-full h-48 bg-gray-200 rounded-lg mb-4">
          <img
            src={profile.header || "/api/placeholder/1200/300"}
            alt="Channel banner"
            className="w-full h-full object-cover rounded-lg"
          />
          {isEditMode && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <label className="cursor-pointer px-4 py-2 bg-white rounded-md">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange('header')}
                />
                헤더 이미지 변경
              </label>
            </div>
          )}
        </div>

        {/* 프로필 정보 섹션 */}
        <div className="flex px-4 mb-8">
          {/* 프로필 이미지 */}
          <div className="relative flex items-center mr-6">
            <img
              src={profile.profileImage || "/api/placeholder/80/80"}
              alt={`${profile.nickname}'s profile`}
              className="w-20 h-20 rounded-full"
            />
            {isEditMode && (
              <div className="absolute inset-0 flex items-center justify-center">
                <label className="cursor-pointer p-2 bg-white rounded-full">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange('profileImage')}
                  />
                  <UserCog className="w-6 h-6" />
                </label>
              </div>
            )}
          </div>

          <div className="flex-grow py-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex flex-row items-end gap-4">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editData.nickname}
                      onChange={(e) => updateEditData({ nickname: e.target.value })}
                      className="text-xl font-bold border rounded px-2 py-1"
                      placeholder="닉네임을 입력하세요"
                    />
                  ) : (
                    <h1 className="text-xl font-bold">{profile.nickname}</h1>
                  )}
                  <p className="text-gray-600 text-sm">{profile.email}</p>
                </div>

                {isEditMode ? (
                  <textarea
                    value={editData.intro}
                    onChange={(e) => updateEditData({ intro: e.target.value })}
                    className="w-full mt-2 border rounded px-2 py-1"
                    rows={3}
                    placeholder="자기소개를 입력하세요"
                  />
                ) : (
                  <p className="text-gray-600 text-sm mt-1">{profile.intro}</p>
                )}

                <div className="flex gap-4 mt-3">
                  <span className="text-sm">
                    <span className="font-bold">{followData.followerCount}</span>
                    <span className="text-gray-600"> 팔로워</span>
                  </span>
                  <span className="text-sm">
                    <span className="font-bold">{followData.followingCount}</span>
                    <span className="text-gray-600"> 팔로잉</span>
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  {profile.instruments.map((instrument) => (
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
                {isEditMode ? (
                  <>
                    <button
                      onClick={handleProfileUpdate}
                      className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        resetEditData();
                      }}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300"
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditMode(true);
                      updateEditData({
                        nickname: profile.nickname,
                        intro: profile.intro || '',
                      });
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
                  >
                    <UserCog />
                  </button>
                )}
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
    </Layout>
  );
};

export default MyProfilePage;
