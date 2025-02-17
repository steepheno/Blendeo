import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { VideoData, TrimData } from "../types/components/recording/video";
import { uploadBlendedVideo, createProject } from "@/api/project";
// import { SimpleProjectData } from "@/types/api/project";
import {
  CreateProjectRequest,
} from "@/types/api/project";

interface VideoStore {
  // State
  videoData: VideoData | null;
  isVideoLoaded: boolean;
  isProcessing: boolean;
  trimData: TrimData | null;
  originalBlobUrl: string | null;
  editedBlobUrl: string | null;
  uploadProgress: number;
  uploadedBytes: number;
  createdUrl: string;

  // Actions
  setVideoData: (data: VideoData) => void;
  clearVideoData: () => void;
  setTrimData: (data: TrimData) => void;
  clearTrimData: () => void;
  setIsProcessing: (processing: boolean) => void;
  setOriginalBlobUrl: (url: string) => void;
  setEditedBlobUrl: (url: string) => void;
  clearBlobUrls: () => void;
  setCreatedUrl: (url: string) => void;

  // Upload functionality
  uploadVideo: (options: {
    videoFile: File;
    startPoint?: number;
    duration?: number;
    // volume?: number;
    // noiseReduction?: boolean;
  }) => Promise<string>;
  uploadProject: (data: CreateProjectRequest) => Promise<number>;
  setUploadProgress: (progress: number, loaded: number) => void;
}

const useVideoStore = create<VideoStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      videoData: null,
      isVideoLoaded: false,
      isProcessing: false,
      trimData: null,
      originalBlobUrl: null,
      editedBlobUrl: null,
      uploadProgress: 0,
      uploadedBytes: 0,
      seedProject: null,

      // Video data management
      setVideoData: (data) =>
        set(() => ({
          videoData: data,
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
      setTrimData: (data) => set(() => ({ trimData: data })),
      clearTrimData: () => set(() => ({ trimData: null })),

      // Processing state management
      setIsProcessing: (processing) =>
        set(() => ({ isProcessing: processing })),

      // Blob URL management
      setOriginalBlobUrl: (url) => set(() => ({ originalBlobUrl: url })),
      setEditedBlobUrl: (url) => set(() => ({ editedBlobUrl: url })),
      clearBlobUrls: () =>
        set(() => ({
          originalBlobUrl: null,
          editedBlobUrl: null,
        })),

      // Upload progress management
      setUploadProgress: (progress, loaded) =>
        set(() => ({
          uploadProgress: progress,
          uploadedBytes: loaded,
        })),

      // Upload functionality
      uploadVideo: async (options) => {
        const { trimData, setIsProcessing, setUploadProgress } = get();

        if (!trimData) {
          throw new Error("Trim data is required");
        }

        try {
          setIsProcessing(true);

          const response = await uploadBlendedVideo(
            {
              videoFile: options.videoFile,
              startPoint: options.startPoint ?? trimData.startTime,
              duration:
                options.duration ?? trimData.endTime - trimData.startTime,
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
    }),
    {
      name: "video-store",
    }
  )
);

export default useVideoStore;
