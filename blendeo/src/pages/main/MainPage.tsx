import { useEffect, useState } from "react";
import MusicCard from "@/components/common/MusicCard";
import GenreTag from "@/components/common/GenreTag";
import Layout from "@/components/layout/Layout";
import { useProjectStore } from "@/stores/projectStore";
import { Project } from "@/types/api/project";

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

const MainPage = () => {
  // 상태 관리
  const [selectedTab, setSelectedTab] = useState<
    "forYou" | "ranking" | "latest"
  >("forYou");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [projects, setProjects] = useState<Project[]>([]);

  // Project Store에서 필요한 메서드들을 가져옵니다
  const { getProject } = useProjectStore();

  // 프로젝트 목록을 가져오는 함수
  const fetchProjects = async () => {
    try {
      // 실제 API 연동시에는 여기서 프로젝트 목록을 가져오는 API를 호출해야 합니다
      // 현재 API에는 프로젝트 목록을 가져오는 엔드포인트가 없어 보이므로,
      // 백엔드 팀과 협의하여 추가가 필요합니다

      // 임시로 프로젝트 데이터를 하드코딩합니다
      const mockProjects: Project[] = [
        {
          id: 1,
          forkId: 0,
          author: {
            id: 1,
            email: "user@example.com",
            nickname: "Lady Gaga & Ariana Grande",
          },
          title: "Rain on Me",
          contents: "Project description",
          contributorCnt: 2,
          createdAt: new Date(
            Date.now() - 2 * 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          state: true,
          thumbnail: "https://example.com/thumbnail1.jpg",
          runningTime: 180,
          viewCnt: 3200000,
          likeCnt: 15000,
          videoUrl: "https://example.com/video1.mp4",
        },
        // ... 더 많은 mock 데이터
      ];

      setProjects(mockProjects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedTab, selectedGenre]);

  // 조회수를 포맷팅하는 함수
  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  // 경과 시간을 계산하는 함수
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

  return (
    <Layout showNotification={true}>
      <div>
        <div className="flex flex-col flex-1 shrink self-start px-20 pt-2.5 basis-0 min-w-[240px] max-md:px-5 max-md:max-w-full">
          <div className="flex flex-col w-full max-md:max-w-full">
            <div className="flex flex-col w-full text-5xl font-black tracking-tighter text-white leading-[60px] min-h-[366px] max-md:max-w-full max-md:text-4xl max-md:leading-[56px]">
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
                  onClick={() => setSelectedTab("forYou")}
                  className={`flex flex-col flex-1 shrink justify-center items-center pt-4 pb-3.5 border-gray-200 basis-0 border-b-[3px] min-w-[240px] cursor-pointer
                    ${selectedTab === "forYou" ? "text-neutral-900 border-neutral-900" : ""}`}
                >
                  <div className="w-[53px]">For you</div>
                </div>
                <div
                  onClick={() => setSelectedTab("ranking")}
                  className={`flex flex-col flex-1 shrink justify-center items-center pt-4 pb-3.5 whitespace-nowrap border-gray-200 basis-0 border-b-[3px] min-w-[240px] cursor-pointer
                    ${selectedTab === "ranking" ? "text-neutral-900 border-neutral-900" : ""}`}
                >
                  <div className="w-[57px]">Ranking</div>
                </div>
                <div
                  onClick={() => setSelectedTab("latest")}
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

            <div className="flex flex-wrap gap-3 items-start p-4 mt-2.5 w-full max-md:max-w-full">
              <div className="flex flex-wrap flex-1 shrink gap-3 items-start w-full basis-0 min-w-[240px] max-md:max-w-full">
                {projects.map((project) => (
                  <MusicCard
                    key={project.id}
                    imageUrl={project.thumbnail}
                    title={`${project.title} | ${project.author.nickname}`}
                    timeAgo={getTimeAgo(project.createdAt)}
                    views={formatViews(project.viewCnt)}
                    onClick={() => getProject(project.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MainPage;
