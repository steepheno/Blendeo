import Layout from "@/components/layout/Layout";
import VideoPlayer from "@/components/detail/VideoPlayer";
import InteractionButton from "@/components/detail/InteractionButton";
import CommentsSection from "@/components/detail/CommentsSection";
import SettingsSection from "@/components/detail/SettingsSection";
import ContributorsSection from "@/components/detail/ContributorsSection";
import SidePanel from "@/components/detail/SidePanel";
import hamburgerIcon from "@/assets/hamburger_icon.png"
import { getProject } from "@/api/project";
import { Project } from "@/types/api/project";
import { useProjectStore } from "@/stores/projectStore";

import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Heart,
  Bookmark,
  Share2,
  Music,
  Users,
  GitBranchPlusIcon,
  ArrowLeftCircle,
  ArrowRightCircle,
} from "lucide-react";

import { TabType } from "@/types/components/video/videoDetail";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";

type RedirectSource = 'project-edit' | 'project-create' | 'project-detail' | 'project-fork';

const ProjectDetailPage = () => {
  const params = useParams();
  const { projectId } = params;
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, setCurrentUser, getUser } = useUserStore();
  const { setRedirectState } = useProjectStore();

  const [activeTab, setActiveTab] = useState<TabType>(null);
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userId = useAuthStore.getState().userId;
        const accessToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1];

        if (userId && accessToken) {
          const response = await getUser(Number(userId));
          console.log(response);
        }
      } catch (error) {
        console.error("Failed to load user: ", error);
      }
    };

    const fetchProjectData = async () => {
      if (!projectId) {
        setError("잘못된 프로젝트 ID입니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const projectIdNumber = parseInt(projectId, 10);

        if (isNaN(projectIdNumber)) {
          throw new Error("유효하지 않은 프로젝트 ID 형식입니다.");
        }

        const response = await getProject(projectIdNumber);
        if (!response) {
          throw new Error("프로젝트를 찾을 수 없습니다.");
        }
        setProjectData(response);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error
          ? err.message
          : "프로젝트 정보를 불러오는데 실패했습니다.";
        setError(errorMessage);
        console.error("Error fetching project data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
    fetchProjectData();
  }, [projectId, location.pathname, getUser, setCurrentUser]);

  const handleTabClick = (tab: TabType) => {
    if (tab === 'showTree') navigate('tree');
    setActiveTab(activeTab === tab ? null : tab);
  };

  const handleForkClick = (type: RedirectSource) => {
    if (projectData) {
      alert("Blend 페이지로 이동합니다!");
      setRedirectState(projectData, type);
      navigate('/project/forkrecord');
    }
  };

  const handleSettingClick = (tab: TabType) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-screen">
      <div>로딩 중....</div>
      <div className="text-sm text-gray-500">Project ID: {projectId}</div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex items-center justify-center h-screen flex-col gap-2">
      <div className="text-red-500">{error}</div>
      <div className="text-sm">Project ID: {projectId}</div>
      <div className="text-sm">Path: {location.pathname}</div>
      <div className="text-sm">All params: {JSON.stringify(params)}</div>
    </div>
  );

  const renderInteractionButtons = () => (
    <div className="ml-4 flex flex-col items-center justify-end h-full space-y-2">
      {currentUser?.id === projectData?.authorId && (
        <img
          className="w-10 h-10 cursor-pointer"
          src={hamburgerIcon}
          alt="수정삭제버튼"
          onClick={() => handleSettingClick("settings")}
        />
      )}
      <InteractionButton
        icon={Music}
        count={projectData?.viewCnt.toString() || "0"}
        label="Blendit!"
        onClick={() => handleForkClick("project-fork")}
      />
      <InteractionButton icon={Heart} count="0" onClick={() => { }} />
      <InteractionButton
        icon={MessageSquare}
        count="0"
        isActive={activeTab === "comments"}
        onClick={() => handleTabClick("comments")}
      />
      <InteractionButton
        icon={Users}
        count={projectData?.contributorCnt.toString() || "0"}
        isActive={activeTab === "contributors"}
        onClick={() => handleTabClick("contributors")}
      />
      <InteractionButton icon={Bookmark} count="0" onClick={() => { }} />
      <InteractionButton icon={Share2} count="0" onClick={() => { }} />
      {/* 컨플릭트시 이부분은 kill */}
      <InteractionButton
        icon={GitBranchPlusIcon}
        count="0"
        onClick={() => handleTabClick("showTree")}
      />
    </div>
  );

  const renderSidePanelContent = () => {
    if (!projectData) return null;

    switch (activeTab) {
      case "comments":
        return <CommentsSection projectId={projectData.projectId} />;
      case "settings":
        return <SettingsSection projectId={projectData.projectId} />;
      case "contributors":
        return <ContributorsSection projectId={projectData.projectId} />;
      default:
        return null;
    }
  };

  if (isLoading) return renderLoadingState();
  if (error || !projectData) return renderErrorState();

  return (
    <Layout showRightSidebar={false}>
      <div className="flex flex-1 h-full w-full">
        <div className="w-full h-full relative flex items-stretch pt-10 justify-center">
          <div className="flex flex-col justify-center p-4">
            <InteractionButton
              icon={ArrowLeftCircle}
              onClick={() => {}}
              size={8}
            />
          </div>
          <VideoPlayer
            videoUrl={projectData.videoUrl}
            metadata={{
              title: projectData.title,
              content: projectData.contents,
              author: {
                id: projectData.authorId,
                name: projectData.authorNickname,
                profileImage: projectData.authorProfileImage,
              },
              viewCnt: projectData.viewCnt
            }}
            isPortrait={true}
          />
          <div>
            {renderInteractionButtons()}
          </div>
          <SidePanel
            activeTab={activeTab && activeTab !== 'showTree' ? activeTab : null}
            content={renderSidePanelContent()}
          />
          <div className="flex flex-col justify-center p-4">
          <InteractionButton
              icon={ArrowRightCircle}
              onClick={() => {}}
              size={8}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetailPage;