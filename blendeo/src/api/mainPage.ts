import axiosInstance from "@/api/axios";
import type { ProjectListItem } from '@/types/api/project';

export const mainPageApi = {
  /**
   * 최신 프로젝트 목록을 조회합니다.
   * @param page 페이지 번호 (기본값: 0)
   * @param size 페이지 크기 (기본값: 10)
   */
  getNewProjects: async (page = 0, size = 10): Promise<ProjectListItem[]> => {
    return axiosInstance.get<ProjectListItem[]>('/project/new', {
      params: {
        page,
        size
      }
    });
  }
};