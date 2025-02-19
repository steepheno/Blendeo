import { useNavigate } from "react-router-dom";
import { useEffect, useCallback } from "react";

import Layout from "@/components/layout/Layout";
import VideoGrid from "@/components/common/VideoGrid";
import VideoCard from "@/components/common/VideoCard";
import TabNavigation from "@/components/common/TabNavigation";
import HeroSection from "@/components/mainpage/HeroSection";
// import GenreSection from "@/components/mainpage/GenreSection";
import useMainPageStore from "@/stores/mainPageStore";
import type { ProjectType } from "@/stores/mainPageStore";

const MainPage = () => {
  const navigate = useNavigate();
  const { 
    activeTab,
    getCurrentProjects,
    getIsLoading,
    getHasMore,
    setActiveTab,
    loadMore,
    fetchProjects,
  } = useMainPageStore();

  const projects = getCurrentProjects();
  const loading = getIsLoading();
  const hasMore = getHasMore();

  const mainTabs = [
    { id: "forYou", label: "For you" },
    { id: "ranking", label: "Ranking" },
    { id: "latest", label: "Latest" }
  ];

  const handleProjectClick = useCallback((projectId: number) => {
    navigate(`/project/${projectId}`);
  }, [navigate]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as ProjectType);
  }, [setActiveTab]);

  // const handleGenreSelect = useCallback((genre: string) => {
  //   console.log("Selected genre:", genre);
  // }, []);

  useEffect(() => {
    fetchProjects(activeTab);    
  }, [activeTab, fetchProjects]);

  return (
    <Layout showNotification={true}>
      <div className="flex flex-col flex-1 shrink self-start px-20 pt-2.5 basis-0 min-w-[240px]">
        <HeroSection />
        <TabNavigation 
          activeTab={activeTab}
          tabs={mainTabs}
          onTabChange={handleTabChange}
        />
        {/* <GenreSection
          selectedGenre="All"

          onGenreSelect={handleGenreSelect}
        /> */}
        <VideoGrid type="uploaded">
          {projects.map((project) => (
            <VideoCard
              key={`project-${project.projectId}`}
              project={project}
              onClick={()=>handleProjectClick(project.projectId)}

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

export default MainPage;
