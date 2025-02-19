import VideoRecorder from "@/components/record/VideoRecorder";
import { useEffect, useRef, useCallback } from "react";

const SeedRecordPage = () => {
  const streamRef = useRef<MediaStream | null>(null);

  const handleCleanup = useCallback(() => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }
  }, []);

  const handleStream = useCallback((stream: MediaStream) => {
    streamRef.current = stream;
  }, []);

  useEffect(() => {
    // 뒤로가기 이벤트 감지
    const handlePopState = () => {
      handleCleanup();
    };

    // 페이지 새로고침/나가기 감지
    const handleBeforeUnload = () => {
      handleCleanup();
    };

    // 이벤트 리스너 등록
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleCleanup();
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleCleanup]);

  // history API를 통한 뒤로가기 감지
  useEffect(() => {
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      window.dispatchEvent(new Event("popstate"));
    };

    return () => {
      history.pushState = originalPushState;
    };
  }, []);

  return (
    <div
      className="w-full h-full"
      style={{
        backgroundColor: "#171222",
      }}
    >
      <VideoRecorder onStreamReady={handleStream} onUnmount={handleCleanup} />
    </div>
  );
};

export default SeedRecordPage;
