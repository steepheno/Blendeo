import axiosInstance from "./axios";
import { Project } from "@/types/api/project";
import { GraphData } from "@/pages/explore/ExplorePage";

const baseURL = import.meta.env.VITE_API_URL;

export const getAllNodes = async () => {
  try {
    return axiosInstance.get<GraphData[]>(`/fork/all/nodes`);
  } catch (error) {
    console.error("Error getAllNodes: ", error);
    throw error;
  }
};

export const getNodeInfo = async (projectId: number) => {
  try {
    return axiosInstance.get<Project>(baseURL + `/project/get/info/${projectId}`);
  } catch (error) {
    console.error("Error getNodeInfo: ", error);
    throw error;
  }
};
