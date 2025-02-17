import { type FC, useEffect, useRef, useState } from "react";
import { Pause, Play, Upload, Volume2 } from "lucide-react";
import useVideoStore from "@/stores/videoStore";
import { useNavigate } from "react-router-dom";

const HANDLE_WIDTH = 6;

const VideoEditor: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [volume, setVolume] = useState(1);
  const [serverVolume, setServerVolume] = useState(1);
  const navigate = useNavigate();
  // const [noiseReduction, setNoiseReduction] = useState(false);

  const {
    videoData,
    trimData,
    setTrimData,
    isProcessing,
    setIsProcessing,
    uploadVideo,
    uploadProgress,
    uploadedBytes,
    setCreatedUrl,
  } = useVideoStore();

  useEffect(() => {
    if (!videoRef.current) return;
    // 볼륨 범위를 0-2에서 0-1로 변환하여 비디오에 적용
    videoRef.current.volume = Math.min(volume, 1);
    // 서버에 전송할 볼륨값 업데이트 (0-200%)
    setServerVolume(volume * 100);
  }, [volume]);

  // 타임라인 너비 계산 및 업데이트
  useEffect(() => {
    const updateTimelineWidth = () => {
      if (containerRef.current) {
        const containerWidth =
          containerRef.current.getBoundingClientRect().width;
        // Play 버튼 영역(48px)과 간격(8px)을 고려하여 타임라인 너비 설정
        setTimelineWidth(containerWidth - 56);
      }
    };

    updateTimelineWidth();
    window.addEventListener("resize", updateTimelineWidth);

    return () => {
      window.removeEventListener("resize", updateTimelineWidth);
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current || !trimData || !videoData?.duration) return;

    const startTime = Number(trimData.startTime);
    if (
      !Number.isFinite(startTime) ||
      startTime < 0 ||
      startTime > videoData.duration
    ) {
      const initialTrimData = {
        ...trimData,
        startTime: 0,
        endTime: videoData.duration,
        videoDuration: videoData.duration,
      };
      setTrimData(initialTrimData);
      return;
    }

    videoRef.current.currentTime = startTime;
  }, [trimData, videoData, setTrimData]);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !videoData?.duration || !trimData) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / timelineWidth;
    const clickedTime = percentage * videoData.duration;

    let newTime = clickedTime;
    if (clickedTime < trimData.startTime) {
      newTime = trimData.startTime;
    } else if (clickedTime > trimData.endTime) {
      newTime = trimData.endTime;
    }

    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleTrimChange = (type: "startTime" | "endTime", value: number) => {
    if (!videoData?.duration || !trimData) return;

    const newTrimData = {
      ...trimData,
      [type]: value,
      videoDuration: videoData.duration,
    };

    if (type === "startTime" && value >= trimData.endTime) {
      newTrimData.startTime = trimData.endTime - 1;
    }
    if (type === "endTime" && value <= trimData.startTime) {
      newTrimData.endTime = trimData.startTime + 1;
    }

    setTrimData(newTrimData);
  };

  const handlePlayPause = () => {
    if (!videoRef.current || !trimData) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      if (currentTime >= trimData.endTime) {
        videoRef.current.currentTime = trimData.startTime;
      }
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || !trimData) return;

    const currentTime = videoRef.current.currentTime;
    setCurrentTime(currentTime);

    if (currentTime >= trimData.endTime) {
      videoRef.current.currentTime = trimData.startTime;
    }
  };

  const handleUpload = async () => {
    if (!trimData || !videoData) return;

    setIsProcessing(true);
    try {
      const videoFile = await fetch(videoData.blobUrl).then(r => r.blob());
      const file = new File([videoFile], 'video.webm', { type: 'video/webm' });

      // 비디오 업로드 후 URL 문자열 받기
      const videoUrl = await uploadVideo({
        videoFile: file,
      });

      // Store에 업로드된 영상 URL 저장
      setCreatedUrl(videoUrl);
      // 프로젝트 생성 폼으로 리다이렉트
      navigate('/seed/upload');
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // const handleNoiseReductionChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const isChecked = e.target.checked;
  //   setNoiseReduction(isChecked);
  //   console.log(isChecked ? "잡음제거됨" : "잡음제거 취소됨");
  // };

  const getTimelinePosition = (time: number): number => {
    if (!videoData?.duration) return 0;
    return (time / videoData.duration) * timelineWidth;
  };

  const handleDrag = (
    type: "startTime" | "endTime",
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!trimData) return;

    const startX = e.clientX;
    const initialTime =
      type === "startTime" ? trimData.startTime : trimData.endTime;

    const startDrag = (dragEvent: MouseEvent) => {
      if (!timelineRef.current || !videoData?.duration) return;

      const deltaX = dragEvent.clientX - startX;
      const sensitivity = dragEvent.shiftKey ? 0.05 : 1;
      const scaledDelta = deltaX * sensitivity;
      const timePerPixel = videoData.duration / timelineWidth;
      const timeDelta = scaledDelta * timePerPixel;
      const newTime = Math.max(
        0,
        Math.min(videoData.duration, initialTime + timeDelta)
      );

      handleTrimChange(type, newTime);
    };

    const stopDrag = () => {
      document.removeEventListener("mousemove", startDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", startDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  if (!videoData) return null;

  return (
    <div className="mx-auto w-full max-w-6xl p-4">
      <div className="relative mb-4 aspect-video bg-gray-900">
        <video
          ref={videoRef}
          src={videoData.blobUrl}
          className="h-full w-full"
          onTimeUpdate={handleTimeUpdate}
        />
      </div>

      <div className="mt-2 text-xs text-gray-300 flex flex-row justify-between pb-1">
        <div className="text-gray-300">
          <p>Shift 를 누르고 드래그하여 미세하게 조절할 수 있어요!</p>
        </div>
        {trimData && (
          <div className="flex justify-end gap-4">
            <span>시작 : {trimData.startTime.toFixed(3)}s</span>
            <span>끝 : {trimData.endTime.toFixed(3)}s</span>
            <span>
              영상 길이 : {(trimData.endTime - trimData.startTime).toFixed(3)}s
            </span>
          </div>
        )}
      </div>

      <div ref={containerRef} className="flex flex-row gap-2 items-center">
        <div className="flex items-center">
          <button
            type="button"
            onClick={handlePlayPause}
            className="rounded-full bg-violet-600 p-2 text-white hover:bg-violet-800"
            disabled={isProcessing}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
        </div>

        <div
          ref={timelineRef}
          className="relative h-16 cursor-pointer rounded bg-gray-200"
          style={{ width: timelineWidth + 8 }}
          onClick={handleTimelineClick}
        >
          {trimData && (
            <div
              className="absolute top-0 h-full bg-violet-300"
              style={{
                left: getTimelinePosition(trimData.startTime),
                width: getTimelinePosition(
                  trimData.endTime - trimData.startTime
                ),
              }}
            />
          )}

          {trimData && (
            <>
              <div
                className="absolute top-0 h-full w-3 cursor-ew-resize bg-violet-500"
                style={{
                  left:
                    getTimelinePosition(trimData.startTime) - HANDLE_WIDTH / 2,
                }}
                onMouseDown={(e) => handleDrag("startTime", e)}
              />

              <div
                className="absolute top-0 h-full w-3 cursor-ew-resize bg-violet-500"
                style={{
                  left:
                    getTimelinePosition(trimData.endTime) - HANDLE_WIDTH / 2,
                }}
                onMouseDown={(e) => handleDrag("endTime", e)}
              />
            </>
          )}

          <div
            className="absolute top-0 h-full w-0.5 bg-red-500"
            style={{
              left: getTimelinePosition(currentTime),
            }}
          />
        </div>
      </div>

      <div className="flex flex-row items-center w-full justify-between pt-2">
        <div className="flex items-center gap-2">
          <Volume2 size={20} className="text-violet-600" />
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-60 h-2 rounded-lg appearance-none cursor-pointer bg-gray-200
                [&::-webkit-slider-runnable-track]:h-2 
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:h-4 
                [&::-webkit-slider-thumb]:w-4 
                [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:bg-violet-600 
                [&::-webkit-slider-thumb]:mt-[-4px] 
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:shadow-md"
            style={{
              background: `linear-gradient(to right, 
                  rgb(124, 58, 237) 0%, 
                  rgb(124, 58, 237) ${(volume / 2) * 100}%, 
                  rgb(229, 231, 235) ${(volume / 2) * 100}%, 
                  rgb(229, 231, 235) 100%)`,
            }}
          />
          <span className="min-w-[3rem] text-sm text-violet-600 font-medium">
            {Math.round(serverVolume)}%
          </span>
          {/* <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <input
              type="checkbox"
              id="noiseReduction"
              checked={noiseReduction}
              onChange={handleNoiseReductionChange}
              className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
            />
            <label htmlFor="noiseReduction" className="text-gray-300">잡음 제거</label>
          </div> */}
        </div>

        <div className="flex flex-col gap-2 items-end">
          {uploadProgress > 0 && (
            <div className="text-sm text-gray-300">
              업로드 진행률: {uploadProgress}% ({(uploadedBytes / (1024 * 1024)).toFixed(2)} MB)
            </div>
          )}
          <button
            type="button"
            onClick={handleUpload}
            className="flex items-center gap-2 rounded hover:bg-violet-800 px-4 py-2 hover:text-violet-700 border border-violet-900 bg-violet-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isProcessing}
          >
            <Upload size={20} />
            {isProcessing ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;
