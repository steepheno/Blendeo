// pages/edit.tsx
import { useEffect } from "react";

import VideoEditor from "@/components/record/VideoEditor";
import useVideoStore from "@/stores/videoStore";
import { type TrimData } from "@/types/components/recording/video";
import Searchbar from "@/components/layout/Searchbar";

const SeedEditPage = () => {
  const { videoData, trimData, setTrimData, isVideoLoaded } = useVideoStore();

  useEffect(() => {
    // 비디오가 로드되었고 아직 trimData가 없는 경우에만 초기화
    if (videoData && isVideoLoaded && !trimData) {
      const initialTrimData: TrimData = {
        startTime: 0,
        endTime: videoData.duration ?? 0,
        videoDuration: videoData.duration ?? 0,
      };
      setTrimData(initialTrimData);
    }
  }, [videoData, isVideoLoaded, trimData, setTrimData]);

  // 비디오가 로드되지 않은 경우 처리
  if (!isVideoLoaded || !videoData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Please upload a video first</p>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full"
      style={{
        backgroundColor: "#171222",
      }}
    >
      <Searchbar />
      <VideoEditor />
    </div>
  );
};

export default SeedEditPage;
