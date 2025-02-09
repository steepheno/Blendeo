import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import GenreTag from "@/components/common/GenreTag";
import Layout from "@/components/layout/Layout";
import { useProjectStore } from "@/stores/projectStore";
import VideoSection from "@/components/profile/VideoSection";
import mainImg from "@/assets/mainImg.png";

import { Project, ProjectListItem } from "@/types/api/project";

// VideoSection에서 사용하는 비디오 props 타입
interface VideoProps {
  thumbnailSrc: string;
  title: string;
  username: string;
  views: string;
  timeAgo: string;
  tags: string[];
  onClick?: () => void;
}

const genreTags = [
  { label: "All", width: "50px" },
  { label: "Pop", width: "59px" },
  { label: "Rock", width: "67px" },
  { label: "Rap", width: "59px" },
  { label: "Country", width: "88px" },
  { label: "Jazz", width: "62px" },
  { label: "Acoustic", width: "94px" },
  { label: "Electronic", width: "102px" },
  { label: "Classical", width: "101px" },
  { label: "Metal", width: "71px" },
  { label: "Indie", width: "73px" },
];

const SELECTED_TAB_KEY = "selectedMainPageTab";

const MainPage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"forYou" | "ranking" | "latest">(
    () => {
      const savedTab = localStorage.getItem(SELECTED_TAB_KEY);
      return (savedTab as "forYou" | "ranking" | "latest") || "forYou";
    }
  );
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [projects, setProjects] = useState<Project[]>([]);

  const { getNewProjects } = useProjectStore();

  const handleTabSelect = (tab: "forYou" | "ranking" | "latest") => {
    setSelectedTab(tab);
    localStorage.setItem(SELECTED_TAB_KEY, tab);
  };

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const getTimeAgo = (createdAt: string): string => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 30) {
      const months = Math.floor(days / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    }
    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
    return "Today";
  };

  const convertToVideoProps = (project: Project): VideoProps => ({
    thumbnailSrc: project.thumbnail || '/default-thumbnail.jpg',
    title: project.title,
    username: project.author.nickname,
    views: formatViews(project.viewCnt),
    timeAgo: getTimeAgo(project.createdAt),
    tags: [],
    onClick: () => handleProjectClick(project.id)
  });

  const fetchProjects = useCallback(async () => {
    try {
      if (selectedTab === "latest") {
        console.log("Fetching latest projects...");
        const response = await getNewProjects();
        console.log("API Response:", response);
        
        const convertedProjects: Project[] = response.map((item: ProjectListItem) => ({
          id: item.projectId,
          title: item.title, // ProjectListItem의 정의에 따라 수정
          thumbnail: item.thumbnail,
          viewCnt: item.viewCnt,
          contributorCnt: item.contributionCnt,
          author: {
            id: item.authorId,
            nickname: item.authorNickname,
            email: "",
            profileImage: null,
          },
          forkId: item.forkCnt || 0,
          contents: "",
          createdAt: new Date().toISOString(),
          state: true,
          runningTime: 0,
          likeCnt: 0,
          videoUrl: "",
        }));
        
        console.log("Converted Projects:", convertedProjects);
        setProjects(convertedProjects);
      } else {
        const mockProjects: Project[] = [
          {
            id: 1,
            title: "Rain on Me",
            thumbnail: "https://example.com/thumbnail1.jpg",
            viewCnt: 3200000,
            contributorCnt: 2,
            author: {
              id: 1,
              nickname: "Lady Gaga & Ariana Grande",
              email: "user@example.com",
              profileImage: null
            },
            forkId: 0,
            contents: "Project description",
            createdAt: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString(),
            state: true,
            runningTime: 180,
            likeCnt: 15000,
            videoUrl: "https://example.com/video1.mp4",
          },
        ];
        setProjects(mockProjects);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }, [selectedTab, getNewProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, selectedGenre]);

  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <Layout showNotification={true}>
      <div>
        <div className="flex flex-col flex-1 shrink self-start px-20 pt-2.5 basis-0 min-w-[240px] max-md:px-5 max-md:max-w-full">
          <div className="flex flex-col w-full max-md:max-w-full">
            <div
              style={{ backgroundImage: `url(${mainImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
              className="flex flex-col w-full text-5xl font-black tracking-tighter text-white leading-[60px] min-h-[366px] max-md:max-w-full max-md:text-4xl max-md:leading-[56px]"
            >
              <div className="flex flex-col justify-center p-4 w-full max-md:max-w-full max-md:text-4xl max-md:leading-[56px]">
                <div className="flex overflow-hidden flex-col justify-center px-5 py-8 w-full rounded-xl max-md:max-w-full max-md:text-4xl max-md:leading-[56px]">
                  <div className="flex self-center max-w-full min-h-[120px] w-[893px]" />
                  <div className="mt-8 max-md:max-w-full max-md:text-4xl max-md:leading-[56px]">
                    Dive into a world of
                    <br />
                    music creation and discovery
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col pb-3 mt-2.5 w-full text-sm font-bold text-slate-500 max-md:max-w-full">
              <div className="flex flex-wrap justify-between items-start px-4 w-full border-b border-zinc-200 max-md:max-w-full">
                <div
                  onClick={() => handleTabSelect("forYou")}
                  className={`flex flex-col flex-1 shrink justify-center items-center pt-4 pb-3.5 border-gray-200 basis-0 border-b-[3px] min-w-[240px] cursor-pointer
                    ${selectedTab === "forYou" ? "text-neutral-900 border-neutral-900" : ""}`}
                >
                  <div className="w-[53px]">For you</div>
                </div>
                <div
                  onClick={() => handleTabSelect("ranking")}
                  className={`flex flex-col flex-1 shrink justify-center items-center pt-4 pb-3.5 whitespace-nowrap border-gray-200 basis-0 border-b-[3px] min-w-[240px] cursor-pointer
                    ${selectedTab === "ranking" ? "text-neutral-900 border-neutral-900" : ""}`}
                >
                  <div className="w-[57px]">Ranking</div>
                </div>
                <div
                  onClick={() => handleTabSelect("latest")}
                  className={`flex flex-col flex-1 shrink justify-center items-center pt-4 pb-3.5 whitespace-nowrap border-gray-200 basis-0 border-b-[3px] min-w-[240px] cursor-pointer
                    ${selectedTab === "latest" ? "text-neutral-900 border-neutral-900" : ""}`}
                >
                  <div className="w-[46px]">Latest</div>
                </div>
              </div>
            </div>

            <div className="flex overflow-hidden flex-wrap gap-3 items-start p-3 mt-2.5 w-full text-sm font-medium whitespace-nowrap min-h-[56px] text-neutral-900 max-md:max-w-full">
              {genreTags.map((tag, index) => (
                <GenreTag
                  key={index}
                  {...tag}
                  onClick={() => setSelectedGenre(tag.label)}
                  isSelected={selectedGenre === tag.label}
                />
              ))}
            </div>

            <div className="mt-2.5 w-full max-md:max-w-full">
              <VideoSection
                title={
                  selectedTab === "forYou"
                    ? "For You"
                    : selectedTab === "ranking"
                    ? "Ranking"
                    : "Latest Projects"
                }
                videos={projects.map(convertToVideoProps)}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MainPage;