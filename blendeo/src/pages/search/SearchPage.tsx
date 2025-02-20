// src/pages/search/SearchPage.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import VideoGrid from "@/components/common/VideoGrid";
import VideoCard from "@/components/common/VideoCard";
import { useSearch } from "@/hooks/useSearch";
import type { ProjectListItem } from "@/types/api/project";
import type { SearchProjectResponse } from "@/types/api/search";
import type { InstrumentCategory } from "@/types/api/auth";

const INSTRUMENTS_BY_CATEGORY: InstrumentCategory = {
  현악기: [
    { instrument_id: 1, instrument_name: "일렉트릭 기타" },
    { instrument_id: 2, instrument_name: "어쿠스틱 기타" },
    { instrument_id: 3, instrument_name: "클래식 기타" },
    { instrument_id: 4, instrument_name: "베이스 기타" },
    { instrument_id: 5, instrument_name: "바이올린" },
    { instrument_id: 6, instrument_name: "첼로" },
  ],
  건반악기: [
    { instrument_id: 9, instrument_name: "피아노" },
    { instrument_id: 8, instrument_name: "신디사이저" },
    { instrument_id: 19, instrument_name: "멜로디언" },
  ],
  타악기: [
    { instrument_id: 7, instrument_name: "드럼" },
    { instrument_id: 12, instrument_name: "카혼" },
    { instrument_id: 14, instrument_name: "탬버린" },
    { instrument_id: 15, instrument_name: "셰이커" },
    { instrument_id: 21, instrument_name: "실로폰" },
    { instrument_id: 20, instrument_name: "캐스터넷츠" },
    { instrument_id: 13, instrument_name: "핸드 드럼" },
  ],
  목관악기: [{ instrument_id: 10, instrument_name: "색소폰" }],
  전자음향: [
    { instrument_id: 11, instrument_name: "MIDI 컨트롤러" },
    { instrument_id: 30, instrument_name: "글리치 사운드" },
    { instrument_id: 29, instrument_name: "노이즈" },
    { instrument_id: 24, instrument_name: "오토튠" },
    { instrument_id: 23, instrument_name: "보코더" },
    { instrument_id: 26, instrument_name: "필드 레코딩" },
    { instrument_id: 27, instrument_name: "샘플" },
    { instrument_id: 28, instrument_name: "패드" },
  ],
  "바디 퍼커션": [
    { instrument_id: 16, instrument_name: "클랩" },
    { instrument_id: 17, instrument_name: "발구르기" },
    { instrument_id: 22, instrument_name: "비트박스" },
    { instrument_id: 18, instrument_name: "보컬" },
    { instrument_id: 25, instrument_name: "보컬 이펙트" },
  ],
};

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const observerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("현악기");

  const {
    searchTerm,
    searchResults,
    loading,
    hasMore,
    loadMore,
    selectedInstrument,
    setSelectedInstrument,
  } = useSearch();

  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? "" : category));
  };

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

    const params = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
    } else {
      params.delete("q");
    }

    if (!window.location.pathname.includes("/search")) {
      navigate(`/search?${params.toString()}`);
    } else {
      setSearchParams(params);
    }
  };

  const handleInstrumentClick = (
    instrumentId: number,
    instrumentName: string
  ) => {
    const params = new URLSearchParams(searchParams);
    if (selectedInstrument === instrumentName) {
      params.delete("instrument");
      params.delete("instrumentId");
      setSelectedInstrument(null);
    } else {
      params.set("instrument", instrumentName);
      params.set("instrumentId", instrumentId.toString());
      setSelectedInstrument(instrumentName);
    }
    setSearchParams(params);
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

  // 선택된 악기에 따라 결과 필터링
  const filteredResults = selectedInstrument
    ? searchResults.filter((result) =>
        result.instruments.includes(selectedInstrument)
      )
    : searchResults;

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

        {/* 악기 카테고리 */}
        <div className="w-full">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.keys(INSTRUMENTS_BY_CATEGORY).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 선택된 카테고리의 악기들 */}
          {selectedCategory && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {INSTRUMENTS_BY_CATEGORY[selectedCategory].map((instrument) => (
                  <button
                    key={instrument.instrument_id}
                    onClick={() =>
                      handleInstrumentClick(
                        instrument.instrument_id,
                        instrument.instrument_name
                      )
                    }
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedInstrument === instrument.instrument_name
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {instrument.instrument_name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 검색 결과 */}
        {filteredResults.length > 0 ? (
          <VideoGrid type="search">
            {filteredResults.map((result, index) => (
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
