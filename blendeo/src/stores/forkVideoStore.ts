import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { VideoData } from "../types/components/recording/video";
import { uploadBlendedVideo, createProject } from "@/api/project";

import {
  CreateProjectRequest,
  Project,
} from "@/types/api/project";

interface forkVideoStore {
  // State
  originalProjectData: Project | null;
  recordedData: VideoData | null;
  isVideoLoaded: boolean;
  isProcessing: boolean;
  newBlobUrl: string | null;
  uploadProgress: number;
  uploadedBytes: number;
  createdUrl: string;
  loopCnt: number;

  // Actions
  setOriginalProjectData: (data: Project) => void;
  setRecordedData: (data: VideoData) => void;
  clearVideoData: () => void;
  setIsProcessing: (processing: boolean) => void;
  setNewBlobUrl: (url: string) => void;
  clearBlobUrls: () => void;
  setCreatedUrl: (url: string) => void;
  setLoopCnt: (num: number) => void;

  uploadVideo: (options: {
    originalUrl: string;
    loopCnt: number;
    videoFile: File;
  }) => Promise<string>;
  uploadProject: (data: CreateProjectRequest) => Promise<number>;
  setUploadProgress: (progress: number, loaded: number) => void;
}

const useForkVideoStore = create<forkVideoStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      originalProjectData: null,
      videoData: null,
      isVideoLoaded: false,
      isProcessing: false,
      originalUrl: null,
      newBlobUrl: null,
      uploadProgress: 0,
      uploadedBytes: 0,
      createdUrl: null,
      loopCnt: 1,

      // Video data management
      setOriginalProjectData : (data: Project) => 
        set(
          () => ({
            originalProjectData: data
          })
        ),
      setRecordedData: (data: VideoData) =>
        set(() => ({
          recordedData: data,
          isVideoLoaded: true,
          originalBlobUrl: data.blobUrl,
        })),
      clearVideoData: () =>
        set(() => ({
          videoData: null,
          isVideoLoaded: false,
          trimData: null,
          originalBlobUrl: null,
          editedBlobUrl: null,
          uploadProgress: 0,
          uploadedBytes: 0,
          seedProject: null,
        })),

      // Edit state management

      // Processing state management
      setIsProcessing: (processing) =>
        set(() => ({ isProcessing: processing })),

      // Blob URL management
      // setOriginalBlobUrl: (url) => set(() => ({ originalBlobUrl: url })),
      // setEditedBlobUrl: (url) => set(() => ({ editedBlobUrl: url })),
      // clearBlobUrls: () =>
      //   set(() => ({
      //     originalBlobUrl: null,
      //     editedBlobUrl: null,
      //   })),

      // Upload progress management
      setUploadProgress: (progress, loaded) =>
        set(() => ({
          uploadProgress: progress,
          uploadedBytes: loaded,
        })),

      // Upload functionality
      uploadVideo: async (options) => {
        const { setIsProcessing, setUploadProgress } = get();

        try {
          setIsProcessing(true);

          const response = await uploadBlendedVideo(
            {
              videoFile: options.videoFile,
              loopCnt: options.loopCnt,
              forkedUrl: options.originalUrl,
            },
            (progress, loaded) => {
              setUploadProgress(progress, loaded);
            }
          );
          return response; // 업로드된 영상 S3 가 저장되어있음.
        } catch (error) {
          console.error("Failed to upload video:", error);
          throw error;
        } finally {
          setIsProcessing(false);
        }
      },

      // Seed project upload
      uploadProject: async (data: CreateProjectRequest): Promise<number> => {
        const { setIsProcessing } = get();

        try {
          setIsProcessing(true);
          const response = await createProject(data);
          set({ createdUrl: data.videoUrl }); // videoUrl을 createdUrl로 저장
          return response.projectId;
        } catch (error) {
          console.error("Failed to create project:", error);
          throw error;
        } finally {
          setIsProcessing(false);
        }
      },

      setCreatedUrl: (url) => set(() => ({ createdUrl: url })),
      setLoopCnt: (num: number) => set(() => ({loopCnt : num}))
    }),
    {
      name: "fork-video-store",
    }
  )
);

export default useForkVideoStore;
