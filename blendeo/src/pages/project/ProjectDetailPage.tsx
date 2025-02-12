import Layout from "@/components/layout/Layout";
import VideoPlayer from "@/components/detail/VideoPlayer";
import InteractionButton from "@/components/detail/InteractionButton";
import CommentsSection from "@/components/detail/CommentsSection";
import ContributorsSection from "@/components/detail/ContributorsSection";
import SidePanel from "@/components/detail/SidePanel";
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
} from "lucide-react";

import { TabType } from "@/types/components/video/videoDetail";

type RedirectSource = 'project-edit' | 'project-create' | 'project-detail' | 'project-fork';

const ProjectDetailPage = () => {
  // params 전체를 로깅하여 디버깅
  const params = useParams();
  const { projectId } = params;
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<TabType>(null);
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setRedirectState } = useProjectStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectData = async () => {
      console.log("projectId:", projectId);
      console.log("Current path:", location.pathname);

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
        const errorMessage =
          err instanceof Error
            ? err.message
            : "프로젝트 정보를 불러오는데 실패했습니다.";
        setError(errorMessage);
        console.error("Error fetching project data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, location.pathname]);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(activeTab === tab ? null : tab);
  };
  
  const handleForkClick = (type : RedirectSource) => {
    if (projectData) {  // null 체크
        alert("Blend 페이지로 이동합니다!");
        setRedirectState(projectData, type);
        navigate('/project/forkrecord');
    }
};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>로딩 중....</div>
        <div className="text-sm text-gray-500">Project ID: {projectId}</div>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-2">
        <div className="text-red-500">{error}</div>
        <div className="text-sm">Project ID: {projectId}</div>
        <div className="text-sm">Path: {location.pathname}</div>
        <div className="text-sm">All params: {JSON.stringify(params)}</div>
      </div>
    );
  }

  return (
    <Layout showRightSidebar={false}>
      <div className="flex h-screen bg-white w-full">
        <div className="flex-1 flex">
          <div className="relative h-full flex items-start pt-10">
            <div className="flex items-end">
            <div className="flex-1">
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
            </div>

            <div className="ml-4 flex flex-col items-center space-y-4">
              <InteractionButton icon={Music} count={projectData.viewCnt.toString()} label="Blendit!" onClick={()=>handleForkClick("project-fork")}/>
              <InteractionButton icon={Heart} count="0" />
              <InteractionButton
                icon={MessageSquare}
                count="0"
                isActive={activeTab === "comments"}
                onClick={() => handleTabClick("comments")}
              />
              <InteractionButton
                icon={Users}
                count={projectData.contributorCnt.toString()}
                isActive={activeTab === "contributors"}
                onClick={() => handleTabClick("contributors")}
              />
              <InteractionButton icon={Bookmark} count="0" />
              <InteractionButton icon={Share2} count="0" />
            </div>
            </div>
          </div>

          <SidePanel
            activeTab={activeTab}
            content={
              activeTab === "comments" ? (
                <CommentsSection projectId={projectData.projectId}/>
              ) : (
                <ContributorsSection />
              )
            }
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetailPage;