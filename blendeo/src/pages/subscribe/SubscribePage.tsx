import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import VideoGrid from "@/components/common/VideoGrid";
import VideoCard from "@/components/common/VideoCard";
import { useSubscriptionStore } from "@/stores/subscriptionStore";

const SubscribePage = () => {
  const navigate = useNavigate();
  const { projects, isLoading, hasMore, fetchProjects, loadMore } =
    useSubscriptionStore();
  const observerRef = useRef<HTMLDivElement>(null);

  // 프로젝트 클릭 시 상세 페이지로 이동
  const handleProjectClick = useCallback(
    (projectId: number) => {
      navigate(`/project/${projectId}`);
    },
    [navigate]
  );

  // 초기 데이터 로드
  useEffect(() => {
    fetchProjects();
    window.scrollTo(0, 0);
  }, [fetchProjects]);

  // 무한 스크롤 구현
  useEffect(() => {
    const currentRef = observerRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [hasMore, isLoading, loadMore]);

  return (
    <Layout>
      <div className="flex flex-col flex-1 shrink self-start px-20 pt-2.5 basis-0 min-w-[240px]">
        <h1 className="text-2xl font-bold mb-6">구독 중인 채널의 영상</h1>
        <VideoGrid type="uploaded">
          {projects.map((project) => (
            <VideoCard
              key={`project-${project.projectId}`}
              project={project}
              onClick={() => handleProjectClick(project.projectId)}
            />
          ))}
        </VideoGrid>
        {(hasMore || isLoading) && (
          <div
            ref={observerRef}
            className="h-10 w-full flex justify-center items-center"
          >
            {isLoading && <span>불러오는 중...</span>}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubscribePage;
