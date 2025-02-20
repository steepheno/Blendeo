// src/types/api/search.ts
/**
 * 검색 엔드포인트에 전달할 수 있는 매개변수를 정의하는 인터페이스
 */
export interface SearchProjectParams {
  title?: string; // 프로젝트 제목으로 검색
  nickname?: string; // 사용자 닉네임으로 검색
  page?: number; // 페이지네이션을 위한 페이지 번호
  size?: number; // 페이지당 결과 수
  instrumentId?: string; // 악기 ID로 필터링
}

/**
 * 검색 결과의 프로젝트 구조를 정의하는 인터페이스
 * 백엔드에서 각 프로젝트 정보를 어떻게 포맷해야 하는지 나타냅니다
 */
export interface SearchProjectResponse {
  projectId: number; // 프로젝트 고유 식별자
  title: string; // 프로젝트 제목
  thumbnail: string; // 프로젝트 썸네일 이미지 URL
  viewCnt: number; // 조회수
  contributionCnt: number; // 기여 수
  duration: number; // 프로젝트 길이 (초 단위)
  authorId: number; // 프로젝트 작성자 ID
  authorNickname: string; // 작성자 닉네임
  authorProfileImage: string; // 작성자 프로필 이미지 URL
  instruments: string[]; // 프로젝트에 사용된 악기 배열
  createdAt: string; // 프로젝트 생성 시간
}
