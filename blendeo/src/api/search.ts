// src/api/search.ts
import axiosInstance from "./axios";
import type {
  SearchProjectParams,
  SearchProjectResponse,
} from "@/types/api/search";

/**
 * 다양한 검색 작업을 처리하는 API 모듈
 * 모든 함수는 미리 설정된 axios 인스턴스를 사용합니다
 */

/**
 * 프로젝트를 제목으로 검색
 * @param params 검색 매개변수를 포함하는 SearchProjectParams 객체
 * @returns SearchProjectResponse 배열을 포함하는 Promise
 */
export const searchProjects = async (
  params: SearchProjectParams
): Promise<SearchProjectResponse[]> => {
  const queryParams = new URLSearchParams();

  // 제공된 검색 매개변수를 기반으로 쿼리 파라미터 구성
  if (params.title) queryParams.append("title", params.title);
  if (params.page !== undefined)
    queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());
  if (params.instrumentId)
    queryParams.append("instrumentId", params.instrumentId);

  const response = await axiosInstance.get<SearchProjectResponse[]>(
    `/search/project/title?${queryParams}`
  );
  return response;
};

/**
 * 사용자 닉네임으로 프로젝트 검색
 * @param params 검색 매개변수를 포함하는 SearchProjectParams 객체
 * @returns SearchProjectResponse 배열을 포함하는 Promise
 */
export const searchByNickname = async (
  params: SearchProjectParams
): Promise<SearchProjectResponse[]> => {
  const queryParams = new URLSearchParams();

  // 닉네임 검색을 위한 쿼리 파라미터 구성
  if (params.nickname) queryParams.append("nickname", params.nickname);
  if (params.page !== undefined)
    queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());

  const response = await axiosInstance.get<SearchProjectResponse[]>(
    `/search/user/project?${queryParams}`
  );
  return response;
};

/**
 * 악기로 프로젝트 검색
 * @param params 검색 매개변수를 포함하는 SearchProjectParams 객체
 * @returns SearchProjectResponse 배열을 포함하는 Promise
 */
export const searchByInstrument = async (
  params: SearchProjectParams
): Promise<SearchProjectResponse[]> => {
  const queryParams = new URLSearchParams();

  // 참고: 악기 검색에서는 instrumentId가 'keyword' 파라미터로 전달됨
  if (params.instrumentId) queryParams.append("keyword", params.instrumentId);
  if (params.page !== undefined)
    queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());

  const response = await axiosInstance.get<SearchProjectResponse[]>(
    `/search/project/instrument?${queryParams}`
  );
  return response;
};
