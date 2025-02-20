// src/pages/search/SearchPage.tsx
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import VideoGrid from "@/components/common/VideoGrid";
import VideoCard from "@/components/common/VideoCard";
import { useSearch } from "@/hooks/useSearch";
import type { ProjectListItem } from "@/types/api/project";
import type { SearchProjectResponse } from "@/types/api/search";

const SearchPage = () => {
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const observerRef = useRef<HTMLDivElement>(null);

  const { searchTerm, searchResults, loading, hasMore, loadMore } = useSearch();

  // 무한 스크롤 설정
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

  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get("search") as string;

    if (searchTerm.trim()) {
      // 현재 페이지가 /search가 아닐 경우 직접 URL로 이동
      if (!window.location.pathname.includes("/search")) {
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        // 이미 검색 페이지에 있는 경우 파라미터만 업데이트
        const params = new URLSearchParams();
        params.set("q", searchTerm.trim());
        setSearchParams(params);
      }
    }
  };

  // API 응답을 ProjectListItem 형식으로 변환
  const convertToProjectListItem = (
    searchResult: SearchProjectResponse
  ): ProjectListItem => ({
    ...searchResult,
    forkCnt: 0,
    thumbnail: searchResult.thumbnail || null,
    authorProfileImage: searchResult.authorProfileImage,
  });

  return (
    <Layout showNotification>
      <div className="flex flex-col gap-6 px-20 py-8">
        {/* 검색 입력창 */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            name="search"
            type="text"
            defaultValue={searchTerm}
            placeholder="프로젝트 제목 또는 @닉네임으로 검색"
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>

        {/* 검색 결과 */}
        {searchResults.length > 0 ? (
          <VideoGrid type="search">
            {searchResults.map((result, index) => (
              <VideoCard
                key={`project-${result.projectId}-${index}`}
                project={convertToProjectListItem(result)}
                onClick={() => handleProjectClick(result.projectId)}
              />
            ))}
          </VideoGrid>
        ) : (
          !loading &&
          searchTerm && (
            <div className="text-center py-10 text-gray-500">
              검색 결과가 없습니다.
            </div>
          )
        )}

        {/* 로딩 인디케이터 */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {/* 무한 스크롤 트리거 */}
        {hasMore && !loading && (
          <div ref={observerRef} className="h-10 w-full" />
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
