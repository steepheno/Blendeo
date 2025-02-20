import React from "react";
import { useNavigate } from "react-router-dom";
import { Project } from "@/types/api/project";

interface ChildProjectsSectionProps {
  projectId: number;
  onClose: () => void;
}

const ChildProjectsSection: React.FC<ChildProjectsSectionProps> = ({
  projectId,
  onClose,
}) => {
  const [childProjects, setChildProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchChildProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/v1/project/get/children?projectId=${projectId}`
        );
        if (!response.ok) throw new Error("Failed to fetch child projects");
        const data = await response.json();
        setChildProjects(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load child projects"
        );
        console.error("Error fetching child projects:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildProjects();
  }, [projectId]);

  const handleProjectClick = (childProjectId: number) => {
    navigate(`/project/${childProjectId}`);
    onClose();
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading child projects...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );

  if (childProjects.length === 0)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">하위 프로젝트가 없습니다</div>
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Child Projects</h2>
      <div className="grid grid-cols-2 gap-4">
        {childProjects.map((project) => (
          <div
            key={project.projectId}
            className="cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            onClick={() => handleProjectClick(project.projectId)}
          >
            <div className="relative">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-32 object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 px-2 py-1 text-white text-sm">
                {Math.floor(project.duration)}s
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm mb-1 truncate">
                {project.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{project.authorNickname}</span>
                <span>{project.viewCnt} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChildProjectsSection;
