import { type FC, useEffect, useRef, useState } from "react";
import { Pause, Play, Upload, Volume2 } from "lucide-react";
import useVideoStore from "@/stores/videoStore";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Progress } from "@radix-ui/react-progress";
import { Slider } from "@radix-ui/react-slider";
import { Card } from "../ui/card";

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

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
  };

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
      const videoFile = await fetch(videoData.blobUrl).then((r) => r.blob());
      const file = new File([videoFile], "video.webm", { type: "video/webm" });

      // 비디오 업로드 후 URL 문자열 받기
      const videoUrl = await uploadVideo({
        videoFile: file,
      });

      // Store에 업로드된 영상 URL 저장
      setCreatedUrl(videoUrl);
      // 프로젝트 생성 폼으로 리다이렉트
      navigate("/seed/upload");
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

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

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
  };

  if (!videoData) return null;

  return (
    <div
      className="mx-auto w-full max-w-6xl p-4 space-y-3.5"
      style={{
        backgroundColor: "#171222",
      }}
    >
      <Card
        className="overflow-hidden"
        style={{
          backgroundColor: "#000",
          border: "none",
        }}
      >
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            src={videoData.blobUrl}
            className="h-full w-full"
            onTimeUpdate={handleTimeUpdate}
          />
        </div>
      </Card>

      <div className="flex flex-col space-y-4">
        <div className="flex justify-between text-xs text-muted-foreground">
          <p>Shift 를 누르고 드래그하여 미세하게 조절할 수 있어요!</p>
          {trimData && (
            <div className="flex gap-4">
              <span>시작 : {formatTime(trimData.startTime)}</span>
              <span>끝 : {formatTime(trimData.endTime)}</span>
              <span>
                영상 길이 : {formatTime(trimData.endTime - trimData.startTime)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={handlePlayPause}
            disabled={isProcessing}
            className="rounded-full"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <div ref={containerRef} className="relative flex-1 h-6">
            <div
              ref={timelineRef}
              className="h-full rounded-md bg-secondary"
              onClick={handleTimelineClick}
            >
              {trimData && (
                <>
                  <div
                    className="absolute top-0 h-full bg-primary/20"
                    style={{
                      left: `${(trimData.startTime / videoData.duration) * 100}%`,
                      width: `${((trimData.endTime - trimData.startTime) / videoData.duration) * 100}%`,
                    }}
                  />
                  <div
                    className="absolute top-0 h-full w-1 cursor-ew-resize bg-primary"
                    style={{
                      left: `${(trimData.startTime / videoData.duration) * 100}%`,
                    }}
                    onMouseDown={(e) => handleDrag("startTime", e)}
                  />
                  <div
                    className="absolute top-0 h-full w-1 cursor-ew-resize bg-primary"
                    style={{
                      left: `${(trimData.endTime / videoData.duration) * 100}%`,
                    }}
                    onMouseDown={(e) => handleDrag("endTime", e)}
                  />
                </>
              )}
              <div
                className="absolute top-0 h-full w-0.5 bg-destructive"
                style={{
                  left: `${(currentTime / videoData.duration) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 w-[300px]">
            <Volume2 className="h-4 w-4 text-primary" />
            <Slider
              defaultValue={[volume]}
              max={2}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
            <span className="min-w-[3rem] text-sm text-primary font-medium">
              {Math.round(serverVolume)}%
            </span>
          </div>

          <div className="flex flex-col items-end gap-1">
            {uploadProgress > 0 && (
              <div className="flex flex-col gap-0">
                <Progress value={uploadProgress} className="w-[200px]" />
                <p className="text-sm text-muted-foreground">
                  업로드 진행률: {uploadProgress}% (
                  {(uploadedBytes / (1024 * 1024)).toFixed(2)} MB)
                </p>
              </div>
            )}
            <Button
              onClick={handleUpload}
              disabled={isProcessing}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isProcessing ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;
