import Layout from "@/components/layout/Layout";
import VideoPlayer from "@/components/detail/VideoPlayer";
import InteractionButton from "@/components/detail/InteractionButton";
import CommentsSection from "@/components/detail/CommentsSection";
import ContributorsSection from "@/components/detail/ContributorsSection";
import SidePanel from "@/components/detail/SidePanel";
import { useProjectStore } from "@/stores/projectStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const { id } = useParams();
  const { getProject, currentProject, getComments, comments } =
    useProjectStore(); // getComments와 comments 추가
  const [activeTab, setActiveTab] = useState<TabType>(null);

  // 프로젝트 데이터 로드
  useEffect(() => {
    if (id) {
      const projectId = Number(id);
      getProject(projectId);
      getComments(projectId); // 댓글 데이터 로드
    }
  }, [id, getProject, getComments]);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  // 로딩 상태 처리
  if (!currentProject) {
    return <div>Loading...</div>;
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
                videoUrl={currentProject.videoUrl}
                thumbnail={currentProject.thumbnail}
                metadata={{
                  title: currentProject.title,
                  content: currentProject.contents,
                  author: {
                    name: currentProject.author.nickname,
                    profileImage: "/profile.jpg", // 기본 프로필 이미지
                  },
                }}
                isPortrait={true}
              />

              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
                <InteractionButton
                  icon={Music}
                  count={currentProject.contributorCnt.toString()}
                  label="Blendit!"
                />
                <InteractionButton
                  icon={Heart}
                  count={currentProject.likeCnt.toString()}
                />
                <InteractionButton
                  icon={MessageSquare}
                  count={comments.length.toString()}
                  isActive={activeTab === "comments"}
                  onClick={() => handleTabClick("comments")}
                />
                <InteractionButton
                  icon={Users}
                  count={currentProject.contributorCnt.toString()}
                  isActive={activeTab === "contributors"}
                  onClick={() => handleTabClick("contributors")}
                />
                <InteractionButton icon={Bookmark} count="0" />
                <InteractionButton
                  icon={Share2}
                  count={currentProject.viewCnt.toString()}
                />
              </div>
            </div>
          </div>

          <SidePanel
            activeTab={activeTab}
            content={
              activeTab === "comments" ? (
                <CommentsSection projectId={Number(id)} />
              ) : (
                <ContributorsSection projectId={Number(id)} />
              )
            }
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetailPage;
