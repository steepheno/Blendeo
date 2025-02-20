// src/api/search.ts
import axiosInstance from "./axios";
import type {
  SearchProjectParams,
  SearchProjectResponse,
} from "@/types/api/search";

export const searchProjects = async (
  params: SearchProjectParams
): Promise<SearchProjectResponse[]> => {
  const queryParams = new URLSearchParams();

  if (params.title) queryParams.append("title", params.title);
  if (params.page !== undefined)
    queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());

  const response = await axiosInstance.get<SearchProjectResponse[]>(
    `/search/project/title?${queryParams}`
  );
  return response;
};

export const searchByNickname = async (
  params: SearchProjectParams
): Promise<SearchProjectResponse[]> => {
  const queryParams = new URLSearchParams();

  if (params.nickname) queryParams.append("nickname", params.nickname);
  if (params.page !== undefined)
    queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());

  const response = await axiosInstance.get<SearchProjectResponse[]>(
    `/search/user/project?${queryParams}`
  );
  return response;
};

export const searchByInstrument = async (
  params: SearchProjectParams
): Promise<SearchProjectResponse[]> => {
  const queryParams = new URLSearchParams();

  if (params.instrument) queryParams.append("keyword", params.instrument);
  if (params.page !== undefined)
    queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());

  const response = await axiosInstance.get<SearchProjectResponse[]>(
    `/search/project/instrument?${queryParams}`
  );
  return response;
};
