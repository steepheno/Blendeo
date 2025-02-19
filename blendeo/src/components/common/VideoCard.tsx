import { GitFork, Users, Clock } from "lucide-react";
import { ProjectListItem } from "@/types/api/project";

interface VideoCardProps {
  project: ProjectListItem;
  onClick?: (projectId: number) => void;
}

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const formatViewCount = (count: number): string => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}만회`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}천회`;
  }
  return `${count}회`;
};

const getTimeDiff = (createdAt: string): string => {
  const diff = new Date().getTime() - new Date(createdAt).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days >= 30) {
    const months = Math.floor(days / 30);
    return `${months}개월 전`;
  }
  if (days >= 7) {
    const weeks = Math.floor(days / 7);
    return `${weeks}주 전`;
  }
  if (days > 0) {
    return `${days}일 전`;
  }
  return "오늘";
};

const VideoCard = ({ project, onClick }: VideoCardProps) => {
  return (
    <div
      className="w-full max-w-sm  bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick?.(project.projectId)}
    >
      <div className="relative aspect-[3/2] bg-gray-100">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Thumbnail</span>
          </div>
        )}

        <div
          className="absolute bottom-1 right-1 flex items-center gap-2 bg-black/80 rounded px-0.5 py-0.5"
          style={{
            opacity: "0.7",
          }}
        >
          <div className="flex items-center gap-0.5">
            <span
              className="text-white"
              style={{
                fontSize: "0.65rem",
              }}
            >
              {project.forkCnt}
            </span>
          </div>
          <div
            className="flex items-center"
            style={{
              gap: "0.2rem",
            }}
          >
            <Users className="w-3 h-3 text-white" />
            <span
              className="text-white"
              style={{
                fontSize: "0.65rem",
              }}
            >
              {project.contributionCnt}
            </span>
          </div>
          <div
            className="flex items-center"
            style={{
              gap: "0.2rem",
            }}
          >
            <Clock className="w-3 h-3 text-white" />
            <span
              className="text-white"
              style={{
                fontSize: "0.65rem",
              }}
            >
              {formatDuration(project.duration)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            {project.authorProfileImage ? (
              <img
                src={project.authorProfileImage}
                alt={project.authorNickname}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {project.title}
            </h3>
            <p className="text-xs text-gray-500">{project.authorNickname}</p>
            <p className="text-xs text-gray-500">
              조회수 {formatViewCount(project.viewCnt)} •{" "}
              {getTimeDiff(project.createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-1 flex flex-wrap gap-1">
          {project.instruments.map((instrument, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
              style={{
                fontSize: "0.65rem",
              }}
            >
              #{instrument}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
