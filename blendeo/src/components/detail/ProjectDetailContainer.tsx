import VideoPlayer from "@/components/detail/VideoPlayer";
import InteractionButton from "@/components/detail/InteractionButton";
import CommentsSection from "@/components/detail/CommentsSection";
import SettingsSection from "@/components/detail/SettingsSection";
import ContributorsSection from "@/components/detail/ContributorsSection";
import SidePanel from "@/components/detail/SidePanel";
import hamburgerIcon from "@/assets/hamburger_icon.png";

import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  getProject,
  checkLikeBookmark,
  getParent,
  getProjectRandom,
} from "@/api/project";
import { getAllComments } from "@/api/comment";
import { Project } from "@/types/api/project";

import { useProjectStore } from "@/stores/projectStore";
import { toast } from "sonner";

import {
  MessageSquare,
  Heart,
  Bookmark,
  Copy,
  Users,
  GitBranchPlusIcon,
  ArrowLeftCircle,
  ArrowRightCircle,
  GitFork,
  ArrowUpLeft,
} from "lucide-react";

import { useUserStore } from "@/stores/userStore";
import useForkVideoStore from "@/stores/forkVideoStore";

import {
  likeProject,
  unlikeProject,
  bookProject,
  unbookProject,
} from "@/api/project";

// 애니메이션 variants 정의
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

// 스와이프 감도 설정
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

type RedirectSource =
  | "project-edit"
  | "project-create"
  | "project-detail"
  | "project-fork";

// 형제 프로젝트 조회 API 함수
const getSiblingProject = async (
  currentProjectId: number,
  direction: "next" | "before"
) => {
  try {
    const response = await fetch(
      `/api/v1/project/get/sibling?currentProjectId=${currentProjectId}&direction=${direction}`
    );
    if (!response.ok) throw new Error("Failed to fetch sibling project");
    return await response.json();
  } catch (error) {
    console.error("Error fetching sibling project:", error);
    return null;
  }
};

type TabType = "comments" | "settings" | "contributors" | "showTree" | null;

const ProjectDetailContainer = () => {
  const params = useParams();
  const { projectId } = params;
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, setCurrentUser, getUser } = useUserStore();
  const { setRedirectState } = useProjectStore();

  const [activeTab, setActiveTab] = useState<TabType>(null);
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [siblingLoading, setSiblingLoading] = useState(false);
  const [[direction], setPage] = useState([0, 0]);

  const [heartFilled, setHeartFilled] = useState(false);
  const [commentCnt, setCommentCnt] = useState<number>(0);
  const [bookmarkFilled, setBookmarkFilled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localLikeCnt, setLocalLikeCnt] = useState(0);

  const setOriginalProjectData = useForkVideoStore(
    (state) => state.setOriginalProjectData
  );

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) {
        setError("잘못된 프로젝트 ID입니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const projectIdNumber = parseInt(projectId, 10);

        if (isNaN(projectIdNumber)) {
          throw new Error("유효하지 않은 프로젝트 ID 형식입니다.");
        }

        const response = await getProject(projectIdNumber);
        if (!response) {
          throw new Error("프로젝트를 찾을 수 없습니다.");
        }
        setProjectData(response);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "프로젝트 정보를 불러오는데 실패했습니다.";
        setError(errorMessage);
        console.error("Error fetching project data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // 댓글
    const fetchCommentCnt = async () => {
      if (!projectId) return;
      try {
        const response = await getAllComments(Number(projectId));
        setCommentCnt(response.length);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        setCommentCnt(0);
      }
    };

    fetchProjectData();
    fetchCommentCnt();
  }, [projectId, location.pathname, getUser, setCurrentUser]);

  // 좋아요 상태 확인
  useEffect(() => {
    const checkUserInteractions = async () => {
      if (!projectId) return;

      try {
        const response = await checkLikeBookmark(Number(projectId));
        setHeartFilled(response.liked);
        setBookmarkFilled(response.scraped);
      } catch (error) {
        console.error("Failed to check like/bookmark status:", error);
      }
    };
    checkUserInteractions();
  }, [projectId]);

  // 좋아요 실시간 업데이트
  useEffect(() => {
    if (projectData) {
      setLocalLikeCnt(projectData.likeCnt);
    }
  }, [projectData]);

  const paginate = useCallback((newDirection: number) => {
    setPage((prev) => [prev[0] + newDirection, newDirection]);
  }, []);

  const handleSiblingNavigation = useCallback(
    async (direction: "next" | "before") => {
      if (!projectId || siblingLoading) return;

      try {
        setSiblingLoading(true);
        paginate(direction === "next" ? 1 : -1);

        const siblingProject = await getSiblingProject(
          parseInt(projectId),
          direction
        );

        if (siblingProject) {
          navigate(`/project/${siblingProject.projectId}`);
        } else {
          toast.error(direction === "next"
            ? "다음 프로젝트가 없습니다."
            : "이전 프로젝트가 없습니다."
          );

          paginate(direction === "next" ? -1 : 1);
        }
      } catch (error) {
        console.error(`Error navigating to ${direction} project:`, error);
        toast.error("프로젝트 이동 중 오류가 발생했습니다.");
        paginate(direction === "next" ? -1 : 1);
      } finally {
        setSiblingLoading(false);
      }
    },
    [projectId, siblingLoading, navigate, paginate]
  );

  const handleTabClick = (tab: TabType) => {
    if (tab === "showTree") navigate("tree");
    setActiveTab(activeTab === tab ? null : tab);
  };

  const handleForkClick = (type: RedirectSource) => {
    if (projectData) {
      toast.success("프로젝트 이동 중 오류가 발생했습니다.");
      setOriginalProjectData(projectData);
      setRedirectState(projectData, type);
      navigate("/fork/record");
    }
  };

  const handleSettingClick = (tab: TabType) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  // 좋아요
  const handleLikeClick = async () => {
    if (!projectData) return;
    try {
      if (heartFilled) {
        await unlikeProject(projectData?.projectId);
        setLocalLikeCnt((prev) => prev - 1);
      } else {
        await likeProject(projectData?.projectId);
        setLocalLikeCnt((prev) => prev + 1);
      }
      setHeartFilled(!heartFilled);
    } catch (error) {
      console.error("좋아요 토글 실패: ", error);
      toast.error("좋아요 처리 중 에러 발생");
    }
  };

  // 좋아요 수
  const likeTotal = async () => {
    try {
      const response = await getProjectRandom();
      return response.likeCnt;
    } catch (error) {
      console.error("좋아요 수 조회 실패: ", error);
    }
  };
  console.log(likeTotal); // 빌드용 코드

  // 북마크
  const handleBookmarkClick = async () => {
    if (!projectData) return;
    try {
      if (bookmarkFilled) {
        unbookProject(projectData?.projectId);
      } else {
        bookProject(projectData?.projectId);
      }
      setBookmarkFilled(!bookmarkFilled);
    } catch (error) {
      alert(error);
    }
  };

  const renderLoadingState = () => (
    <div className="flex items-center justify-center h-screen">
      <div>로딩 중....</div>
      <div className="text-sm text-gray-500">Project ID: {projectId}</div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex items-center justify-center h-screen flex-col gap-2">
      <div className="text-red-500">{error}</div>
      <div className="text-sm">Project ID: {projectId}</div>
      <div className="text-sm">Path: {location.pathname}</div>
      <div className="text-sm">All params: {JSON.stringify(params)}</div>
    </div>
  );

  // 부모 페이지 리다이렉트
  const goToParent = async (currentProjectId: string | undefined) => {
    try {
      const response = await getParent(Number(currentProjectId));
      console.log(response);
      const parentPjtId = response.projectId;
      navigate(`/project/${parentPjtId}`);
    } catch (error) {
      console.error("부모 프로젝트 조회 실패:", error);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      // 복사 성공 시 스타일
      const shareButton = document.querySelector("[data-share-button]");
      if (shareButton) {
        shareButton.classList.add("bg-purple-100");
        const icon = shareButton.querySelector("svg");

        if (icon) {
          icon.classList.remove("text-gray-600");
          icon.classList.add("text-purple-600");
        }
      }

      // 2초 후 원상복구
      setTimeout(() => {
        setCopied(false);
        const shareButton = document.querySelector("[data-share-button");

        if (shareButton) {
          shareButton.classList.remove("bg-purple-100");
          const icon = shareButton.querySelector("svg");
          if (icon) {
            icon.classList.remove("text-purple-600");
            icon.classList.add("text-gray-600");
          }
        }
      }, 2000);
    } catch (error) {
      console.error("URL 복사 중 오류가 발생했습니다. : ", error);
    }
  };

  const renderInteractionButtons = () => (
    <div className="ml-4 flex flex-col items-center justify-end h-full space-y-2">
      {currentUser?.id === projectData?.authorId && (
        <img
          className="w-10 h-10 cursor-pointer"
          src={hamburgerIcon}
          alt="수정삭제버튼"
          onClick={() => handleSettingClick("settings")}
        />
      )}
      <InteractionButton
        icon={GitBranchPlusIcon}
        label="Blendit!"
        onClick={() => handleForkClick("project-fork")}
        iconColor="#6D28D9"
      />
      <InteractionButton
        icon={Heart}
        count={localLikeCnt.toString()}
        fill={heartFilled ? "red" : "none"}
        iconColor={heartFilled ? "red" : "#4B5563"}
        onClick={() => handleLikeClick()}
      />
      <InteractionButton
        icon={MessageSquare}
        count={commentCnt.toString()}
        isActive={activeTab === "comments"}
        onClick={() => handleTabClick("comments")}
      />
      <InteractionButton
        icon={Users}
        count={projectData?.contributorCnt.toString() || "0"}
        isActive={activeTab === "contributors"}
        onClick={() => handleTabClick("contributors")}
      />
      <InteractionButton
        icon={Bookmark}
        fill={bookmarkFilled ? "#6D28D9" : "none"}
        iconColor={bookmarkFilled ? "#6D28D9" : "#4B5563"}
        onClick={() => handleBookmarkClick()}
      />
      <InteractionButton
        icon={ArrowUpLeft}
        onClick={() => goToParent(projectId)}
      />
      <InteractionButton
        onClick={copyLink}
        icon={Copy}
        count={copied ? "복사됨!" : "0"}
        isActive={copied}
      />
      <InteractionButton
        icon={GitFork}
        onClick={() => handleTabClick("showTree")}
      />
    </div>
  );

  const renderSidePanelContent = () => {
    if (!projectData) return null;

    switch (activeTab) {
      case "comments":
        return <CommentsSection projectId={projectData.projectId} />;
      case "settings":
        return <SettingsSection projectId={projectData.projectId} />;
      case "contributors":
        return <ContributorsSection projectId={projectData.projectId} />;
      default:
        return null;
    }
  };

  if (isLoading) return renderLoadingState();
  if (error || !projectData) return renderErrorState();

  return (
    <div>
      <div className="flex h-full w-full">
        <div className="w-full h-full relative flex items-stretch pt-10 justify-center">
          <div className="flex flex-col justify-center items-center p-4">
            <InteractionButton
              icon={ArrowLeftCircle}
              onClick={() => handleSiblingNavigation("before")}
              size={8}
              disabled={siblingLoading}
            />
          </div>

          <div className="flex">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={projectId}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(_, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    handleSiblingNavigation("next");
                  } else if (swipe > swipeConfidenceThreshold) {
                    handleSiblingNavigation("before");
                  }
                }}
                className="w-full h-full flex"
              >
                <div className="flex relative">
                  <VideoPlayer
                    videoUrl={projectData.videoUrl}
                    metadata={{
                      title: projectData.title,
                      content: projectData.contents,
                      author: {
                        id: projectData.authorId,
                        name: projectData.authorNickname,
                        profileImage: projectData.authorProfileImage,
                      },
                      viewCnt: projectData.viewCnt,
                    }}
                    isPortrait={true}
                  />
                  <div className="flex flex-col justify-center items-center gap-4 ml-4">
                    {renderInteractionButtons()}
                  </div>
                </div>

                <SidePanel
                  activeTab={
                    activeTab && activeTab !== "showTree" ? activeTab : null
                  }
                  content={renderSidePanelContent()}
                  onClose={() => setActiveTab(null)}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col justify-center p-4">
            <InteractionButton
              icon={ArrowRightCircle}
              onClick={() => handleSiblingNavigation("next")}
              size={8}
              disabled={siblingLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailContainer;
