import { create } from 'zustand';
import { projectTreeAPI } from '../api/project'
import type { ProjectTreeData } from '@/types/components/project/project';

interface ProjectTreeState {
  treeData: ProjectTreeData | null;
  isLoading: boolean;
  error: string | null;
  fetchProjectTree: (projectId: number) => Promise<void>;
  resetTreeData: () => void;
}

export const useProjectTreeStore = create<ProjectTreeState>((set) => ({
  treeData: null,
  isLoading: false,
  error: null,

  fetchProjectTree: async (projectId: number) => {
    try {
      set({ isLoading: true, error: null });
      const data = await projectTreeAPI.getProjectTree(projectId);
      set({ treeData: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '프로젝트 트리를 불러오는데 실패했습니다.',
        isLoading: false 
      });
    }
  },

  resetTreeData: () => {
    set({ treeData: null, error: null });
  }
}));