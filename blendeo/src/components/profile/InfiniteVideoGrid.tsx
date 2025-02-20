import React, { useEffect, useRef, useCallback } from "react";
import { ProjectListItem } from "@/types/api/project";
import VideoCard from "@/components/common/VideoCard";
import useMyPageStore from "@/stores/myPageStore";

interface InfiniteVideoGridProps {
  projects: ProjectListItem[];
  onProjectClick: (projectId: number) => void;
}

const InfiniteVideoGrid: React.FC<InfiniteVideoGridProps> = ({
  projects,
  onProjectClick,
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const store = useMyPageStore();

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        !store.getProjectLoading() &&
        store.getHasMoreProjects()
      ) {
        store.loadMore();
      }
    },
    [store]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    });

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {projects.map((project) => (
        <VideoCard
          key={`project-${project.projectId}`}
          project={project}
          onClick={() => onProjectClick(project.projectId)}
        />
      ))}
      <div ref={targetRef} className="h-10 col-span-full" />
      {store.getProjectLoading() && (
        <div className="col-span-full flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      )}
    </div>
  );
};

export default InfiniteVideoGrid;
