import { useNavigate } from "react-router-dom";
import { useEffect, useCallback, useRef } from "react";

import Layout from "@/components/layout/Layout";
import VideoGrid from "@/components/common/VideoGrid";
import VideoCard from "@/components/common/VideoCard";
import TabNavigation from "@/components/common/TabNavigation";
import HeroSection from "@/components/mainpage/HeroSection";
// import GenreSection from "@/components/mainpage/GenreSection";
import useMainPageStore from "@/stores/mainPageStore";
import type { ProjectType } from "@/stores/mainPageStore";

const styles = `
  ::-webkit-scrollbar {
    display: none;
  }
`;

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

  const observerRef = useRef<HTMLDivElement>(null);

  const projects = getCurrentProjects();
  const loading = getIsLoading();
  const hasMore = getHasMore();

  const mainTabs = [
    { id: "latest", label: "Latest" },
    { id: "ranking", label: "Ranking" },
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

  useEffect(() => {
    fetchProjects(activeTab);
  }, [activeTab, fetchProjects]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    <Layout showNotification={true}>
      <style>{styles}</style>
      <div className="flex flex-col flex-1 shrink self-start px-20 pt-2.5 basis-0 min-w-[240px]">
        <HeroSection />
        <TabNavigation
          activeTab={activeTab}
          tabs={mainTabs}
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
          <div
            ref={observerRef}
            className="h-10 w-full flex justify-center items-center"
          >
            {loading && <span>Loading...</span>}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MainPage;
