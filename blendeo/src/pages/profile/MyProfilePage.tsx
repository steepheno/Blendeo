import { useEffect, useCallback, useState } from "react";
import { Pencil, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import InfiniteVideoGrid from "@/components/profile/InfiniteVideoGrid";
import TabNavigation from "@/components/common/TabNavigation";
import FollowListModal from "@/components/follow/FollowListModal";

import { useUser, useAuthStore } from "@/stores/authStore";
import useMyPageStore from "@/stores/myPageStore";
import { ProjectType } from "@/stores/myPageStore";

import axiosInstance from "@/api/axios";
import { AxiosResponse } from "axios";

import noUserImg from "@/assets/no_user.jpg";
import noHeaderImg from "@/assets/defaultHeader.png";

import { toast } from "sonner";

const useProfileData = (userId: number) => {
  const {
    profile,
    profileLoading,
    profileError,
    followData,
    fetchInitialData,
    getCurrentProjects,
    getProjectLoading,
    getHasMoreProjects,
    setActiveTab,
  } = useMyPageStore();

  useEffect(() => {
    fetchInitialData(userId);
    setActiveTab("uploaded");
  }, [userId, fetchInitialData, setActiveTab]);

  return {
    profile,
    profileLoading,
    profileError,
    followData,
    getCurrentProjects,
    getProjectLoading,
    getHasMoreProjects,
  };
};

const MyProfilePage = () => {
  const navigate = useNavigate();
  const authUser = useUser();
  const { isAuthenticated } = useAuthStore();

  const {
    profile,
    profileLoading,
    profileError,
    followData,
    getCurrentProjects,
  } = useProfileData(authUser?.id as number);

  const {
    activeTab,
    setActiveTab,
    isEditMode,
    editData,
    setEditMode,
    updateEditData,
    resetEditData,
    saveProfile,
  } = useMyPageStore();

  const [followModalType, setFollowModalType] = useState<
    "following" | "followers" | null
  >(null);

  const handleFileChange = useCallback(
    (type: "profileImage" | "header") =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          updateEditData({ [type]: file });
        }
      },
    [updateEditData]
  );

  const handleProfileUpdate = useCallback(async () => {
    try {
      await saveProfile();
    } catch (err) {
      console.error("프로필 업데이트 실패:", err);
    }
  }, [saveProfile]);

  const userTabs = [
    { id: "uploaded", label: "업로드한 영상" },
    { id: "scraped", label: "스크랩한 영상" },
  ];

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

  const handleFollowListClick = useCallback(
    (type: "following" | "followers") => {
      setFollowModalType(type);
    },
    []
  );

  // 회원 탈퇴
  const deleteAccount = async () => {
    if (
      window.confirm(
        "정말 탈퇴하시겠습니까? 모든 데이터가 삭제되며 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      try {
        const response: AxiosResponse = await axiosInstance.delete('/user/delete-user');
        sessionStorage.clear();  
        toast.success("탈퇴 처리가 완료되었습니다.");
        navigate("/main");
        console.log(response);
      } catch (error) {
        console.error("회원 탈퇴 처리 중 오류가 발생했습니다." + error);
      }
    }
  };

  // 악기 수정
  const modiInstrument = () => {
    navigate("/profile/selectinstrument", {
      state: {
        mode: "edit",
      },
    });
  };

  useEffect(() => {
    if (!isAuthenticated || !authUser?.id) {
      navigate("/auth/signin", { state: { from: "/profile/me" } });
    }
  }, [authUser?.id, isAuthenticated, navigate]);

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

  const currentProjects = getCurrentProjects();

  return (
    <Layout showNotification>
      <div className="max-w-4xl mx-auto bg-white">
        {/* 배경 이미지 */}
        <div className="relative w-full h-48 bg-gray-200 rounded-lg mb-4">
          <img
            src={profile.header || noHeaderImg}
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
                  onChange={handleFileChange("header")}
                />
                헤더 이미지 변경
              </label>
            </div>
          )}
        </div>

        {/* 프로필 정보 섹션 */}
        <div className="flex px-4 mb-8">
          <div className="relative flex items-center mr-6">
            <img
              src={profile.profileImage || noUserImg}
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
                    onChange={handleFileChange("profileImage")}
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
                      onChange={(e) =>
                        updateEditData({ nickname: e.target.value })
                      }
                      className="text-xl font-bold border rounded px-2 py-1"
                      placeholder="닉네임을 입력하세요"
                    />
                  ) : (
                    <h1 className="text-xl font-bold">{profile.nickname}</h1>
                  )}
                  <p className="text-gray-600 text-sm">{profile.email}</p>
                </div>

                {isEditMode ? (
                  <>
                    <textarea
                      value={editData.intro}
                      onChange={(e) =>
                        updateEditData({ intro: e.target.value })
                      }
                      className="w-full mt-2 border rounded px-2 py-1"
                      rows={3}
                      placeholder="자기소개를 입력하세요"
                    />
                    {/* 탈퇴하기 버튼 */}
                    <div className="flex justify-end mt-2">
                      <span className="text-sm">
                        <a
                          onClick={deleteAccount}
                          className="text-gray-300 cursor-pointer"
                        >
                          탈퇴하기
                        </a>
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600 text-sm mt-1">{profile.intro}</p>
                )}

                <div className="flex gap-4 mt-3">
                  <span
                    className="text-sm cursor-pointer hover:text-blue-600"
                    onClick={() => handleFollowListClick("following")}
                  >
                    <span className="font-bold">
                      {followData.followingCount}
                    </span>
                    <span className="text-gray-600"> 팔로잉</span>
                  </span>
                  <span
                    className="text-sm cursor-pointer hover:text-blue-600"
                    onClick={() => handleFollowListClick("followers")}
                  >
                    <span className="font-bold">
                      {followData.followerCount}
                    </span>
                    <span className="text-gray-600"> 팔로워</span>
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
                  <span
                    className="inline-flex items-center text-black-600 cursor-pointer"
                    onClick={modiInstrument}
                  >
                    <Pencil className="ml-5 w-5 h-5" />
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isEditMode ? (
                  <>
                    <button
                      onClick={handleProfileUpdate}
                      className="bg-violet-600 text-white px-4 py-2 rounded-full hover:bg-violet-700"
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
                        intro: profile.intro || "",
                      });
                    }}
                    className="bg-violet-600 text-white px-6 py-2 rounded-full hover:bg-violet-700"
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

        <InfiniteVideoGrid
          projects={currentProjects}
          onProjectClick={handleProjectClick}
        />
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

export default MyProfilePage;
