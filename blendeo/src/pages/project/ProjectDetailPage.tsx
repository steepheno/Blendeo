import Layout from "@/components/layout/Layout";
import VideoPlayer from "@/components/detail/VideoPlayer";
import InteractionButton from "@/components/detail/InteractionButton";
import CommentsSection from "@/components/detail/CommentsSection";
import ContributorsSection from "@/components/detail/ContributorsSection";
import SidePanel from "@/components/detail/SidePanel";
import { getProject } from "@/api/project";
import { Project } from "@/types/api/project";

import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  MessageSquare,
  Heart,
  Bookmark,
  Share2,
  Music,
  Users,
} from "lucide-react";

import { TabType } from "@/types/components/video/videoDetail";

const ProjectDetailPage = () => {
  // params 전체를 로깅하여 디버깅
  const params = useParams();
  const { projectId } = params;
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState<TabType>(null);
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      // 디버깅을 위한 로깅 추가
      console.log('All params:', params);
      console.log('projectId:', projectId);
      console.log('Current path:', location.pathname);

      if (!projectId) {
        setError('잘못된 프로젝트 ID입니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const projectIdNumber = parseInt(projectId, 10);
        
        if (isNaN(projectIdNumber)) {
          throw new Error('유효하지 않은 프로젝트 ID 형식입니다.');
        }
        
        const response = await getProject(projectIdNumber);
        if (!response) {
          throw new Error('프로젝트를 찾을 수 없습니다.');
        }
        setProjectData(response);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '프로젝트 정보를 불러오는데 실패했습니다.';
        setError(errorMessage);
        console.error('Error fetching project data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, location.pathname]);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>로딩 중...</div>
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
    <Layout showNotification={true}>
      <div className="flex h-screen bg-white">
        <div className="flex-1 flex">
          <div
            className={`transition-all duration-300 ease-in-out p-4 ${
              activeTab ? "w-3/4" : "w-full"
            }`}
          >
            <div className="relative h-full">
              <VideoPlayer
                videoUrl={projectData.videoUrl}
                thumbnail={projectData.thumbnail || "/thumbnail.jpg"}
                metadata={{
                  title: projectData.projectTitle,
                  content: projectData.contents,
                  author: {
                    name: "Cathy",
                    profileImage: "/profile.jpg",
                  },
                }}
                isPortrait={true}
              />

              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
                <InteractionButton icon={Music} count={projectData.viewCnt.toString()} label="Blendit!" />
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
                <CommentsSection />
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