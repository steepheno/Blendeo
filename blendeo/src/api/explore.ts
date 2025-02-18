import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;

export const getAllNodes = async () => {
  try {
    return axios.get(baseURL + `/fork/all/nodes`);
  } catch (error) {
    console.error("Error getAllNodes: ", error);
    throw error;
  }
};

export const getNodeInfo = async (projectId: number) => {
  try {
    return axios.get(baseURL + `/project/get/info/${projectId}`);
  } catch (error) {
    console.error("Error getNodeInfo: ", error);
    throw error;
  }
};

export const getParentNodeInfo = async (projectId: number) => {
  try {
    return axios.get(baseURL + `/project/get/parent?projectId=${projectId}`);
  } catch (error) {
    console.error("Error getParentNodeInfo: ", error);
    throw error;
  }
};
