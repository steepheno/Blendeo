import { useEffect, useRef, useState, useCallback, type FC } from "react";
import {
  RotateCw,
  Video,
  Square,
  FlipHorizontal,
  X,
  Timer,
  AlertCircle,
  Music,
  GripVertical,
  Circle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { VideoData } from "@/types/components/recording/video";
import useVideoStore from "@/stores/videoStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "../ui/input";

type Orientation = "portrait" | "landscape";

interface Dimensions {
  width: number;
  height: number;
}

interface VideoData2 {
  blobUrl: string;
  orientation: "landscape" | "portrait";
  duration: number;
}

interface VideoRecorderProps {
  onError?: (error: string) => void;
  onRecordingComplete?: (blob: Blob) => void;
  onComplete?: () => void;
  onStreamReady?: (stream: MediaStream) => void;
  onUnmount?: () => void;
}

type DimensionsMap = {
  [K in Orientation]: Dimensions;
};

const DIMENSIONS: DimensionsMap = {
  portrait: { width: 480 * 0.95, height: 676 * 0.95 },
  landscape: { width: 676 * 1.3, height: 480 * 1.3 },
};

const COUNTDOWN_OPTIONS = [0, 3, 5, 10, 30] as const;

interface Position {
  x: number;
  y: number;
}

interface DraggableToolboxProps {
  children: React.ReactNode;
  initialPosition?: Position;
}
const DraggableToolbox: React.FC<DraggableToolboxProps> = ({
  children,
  initialPosition = { x: 20, y: 20 },
}) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const toolboxRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragRef.current) {
        const newX = e.clientX - dragRef.current.x;
        const newY = e.clientY - dragRef.current.y;

        // 화면 경계 체크
        const box = toolboxRef.current?.getBoundingClientRect();
        if (box) {
          const maxX = window.innerWidth - box.width;
          const maxY = window.innerHeight - box.height;

          setPosition({
            x: Math.min(Math.max(0, newX), maxX),
            y: Math.min(Math.max(0, newY), maxY),
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <Card
      ref={toolboxRef}
      className={`fixed shadow-lg rounded-lg overflow-hidden ${
        isDragging ? "cursor-grabbing" : ""
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 50,
      }}
    >
      {/* 드래그 핸들 */}
      <div
        className="h-6 bg-violet-500 cursor-grab flex items-center justify-center"
        onMouseDown={handleMouseDown}
      >
        <GripVertical className="w-4 h-4 text-white" />
      </div>

      {/* 컨텐츠 */}
      <div className="bg-white p-4">{children}</div>
    </Card>
  );
};
const VideoRecorder: FC<VideoRecorderProps> = ({
  onError,
  onRecordingComplete,
  onStreamReady,
}) => {
  const navigate = useNavigate();
  const { setVideoData } = useVideoStore();
  const [timer, _setTimer] = useState(0);

  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedDelay, setSelectedDelay] = useState(3);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountdownStarted, setIsCountdownStarted] = useState(false);

  const [showGuide, setShowGuide] = useState(true);
  const [isMuted] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>(
    []
  );
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [showExitDialog, setShowExitDialog] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const countdownTimerRef = useRef<NodeJS.Timeout>();
  const recordingTimerRef = useRef<NodeJS.Timeout>();

  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [_metronomeAudio, _setMetronomeAudio] = useState<AudioContext | null>(
    null
  );

  const [timeSignature, setTimeSignature] = useState(4);
  const [_currentBeat, _setCurrentBeat] = useState(1);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleModalOpen = () => {
    setShowUploadModal(true);
  };

  // 파일 업로드 처리 함수
  const handleVideoUpload = async (file: Blob | File) => {
    try {
      const formData = new FormData();
      formData.append("video", file);

      async function createVideoData(blob: Blob): Promise<VideoData2> {
        const file = new File([blob], "recorded-video.mp4", {
          type: blob.type,
        });
        const blobUrl = URL.createObjectURL(file);

        const video = document.createElement("video");
        video.src = blobUrl;
        video.load();

        const duration = await new Promise<number>((resolve) => {
          video.addEventListener("loadedmetadata", () => {
            if (video.duration === Infinity) {
              video.currentTime = Number.MAX_SAFE_INTEGER;
              video.addEventListener("seeked", () => {
                resolve(video.duration);
              });
            } else {
              resolve(video.duration);
            }
          });
        });

        const orientation =
          video.videoWidth > video.videoHeight ? "landscape" : "portrait";

        return {
          blobUrl,
          orientation,
          duration,
        };
      }

      const videoData = await createVideoData(file);

      setVideoData(videoData);
      if (onRecordingComplete) {
        onRecordingComplete(file);
      }
      navigate("/seed/edit");

      // 파일 이름 로깅을 위한 타입 체크
      const fileName = file instanceof File ? file.name : "blob";
      console.log("파일 업로드 성공:", fileName);
    } catch (error) {
      console.error("업로드 중 오류 발생:", error);
    }
  };

  // 가이드라인 내용
  const guideSteps = [
    {
      title: "카메라 설정",
      description: "원하는 카메라를 선택하고 방향을 조정하세요.",
    },
    {
      title: "타이머 설정",
      description:
        "필요한 경우 타이머를 설정하여 준비 시간을 가질 수 있습니다.",
    },
    {
      title: "녹화 시작",
      description: "녹화 버튼을 눌러 최대 5분까지 녹화할 수 있습니다.",
    },
  ];

  // 페이지 이탈 방지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRecording) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isRecording]);

  const getSupportedMimeType = useCallback((): string => {
    const types = [
      // "video/webm;codecs=vp8,opus",
      // "video/webm",
      "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
      // "video/webm;codecs=vp9",
    ];

    return types.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
  }, []);

  // 사용 가능한 카메라 목록 가져오기
  const getAvailableCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");
      setAvailableCameras(cameras);
      if (cameras.length > 0 && !selectedCamera) {
        setSelectedCamera(cameras[0].deviceId);
      }
    } catch (err) {
      console.error("카메라 목록 가져오기 실패:", err);
    }
  }, [selectedCamera]);

  useEffect(() => {
    void getAvailableCameras();
  }, [getAvailableCameras]);

  const handleError = useCallback(
    (errorMessage: string): void => {
      setError(errorMessage);
      onError?.(errorMessage);
    },
    [onError]
  );

  useEffect(() => {
    // 브라우저 지원 여부 확인
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      handleError("이 브라우저는 비디오 녹화를 지원하지 않습니다.");
      return;
    }

    const mimeType = getSupportedMimeType();
    if (!mimeType) {
      handleError("지원되는 비디오 형식이 없습니다.");
      return;
    }

    void setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current);
      }
    };
  }, [handleError, getSupportedMimeType]);

  const handleRotate = async (): Promise<void> => {
    if (!isRecording) {  // 녹화 중이 아닐 때만 실행
      setOrientation((prev: Orientation) => 
        prev === "portrait" ? "landscape" : "portrait"
      );
      // orientation이 변경된 후 카메라 재시작
      await setupCamera();
    }
  };

  const handleFlip = (): void => {
    setIsFlipped((prev) => !prev);
  };

  const initializeRecording = useCallback((): void => {
    if (!streamRef.current) {
      handleError("카메라가 준비되지 않았습니다.");
      return;
    }

    try {
      chunksRef.current = [];
      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: mimeType,
      });

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // 먼저 이렇게 VideoData를 만드는 함수를 수정해볼게요
      async function createVideoData(blob: Blob): Promise<VideoData> {
        // Blob을 File로 변환 (이름과 타입 지정)
        const file = new File([blob], "recorded-video.mp4", {
          type: blob.type,
        });
        const blobUrl = URL.createObjectURL(file);

        // 비디오 엘리먼트를 만들어서 duration 얻기
        const video = document.createElement("video");
        video.src = blobUrl;
        video.load();

        const duration = await new Promise<number>((resolve) => {
          video.addEventListener("loadedmetadata", () => {
            // 메타데이터가 로드된 후 duration 확인
            if (video.duration === Infinity) {
              // seekable이 설정될 때까지 기다림
              video.currentTime = Number.MAX_SAFE_INTEGER;
              video.addEventListener("seeked", () => {
                // 실제 duration을 얻을 수 있음
                resolve(video.duration);
              });
            } else {
              resolve(video.duration);
            }
          });
        });

        // 화면 방향과 크기 정보도 가져오기
        const orientation =
          video.videoWidth > video.videoHeight ? "landscape" : "portrait";

        return {
          blobUrl,
          orientation,
          duration,
        };
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });

        const videoData = await createVideoData(blob);

        setVideoData(videoData);
        if (onRecordingComplete) {
          onRecordingComplete(blob);
        }

        setIsRecording(false);
        navigate("/seed/edit");
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setError(null);
    } catch (err) {
      handleError("녹화를 시작할 수 없습니다.");
      console.error("녹화 시작 에러:", err);
    }
  }, [
    handleError,
    onRecordingComplete,
    setVideoData,
    navigate,
    getSupportedMimeType,
  ]);

  const startRecording = useCallback((): void => {
    setIsCountdownStarted(true);
    if (selectedDelay === 0) {
      initializeRecording();
      return;
    }

    setCountdown(selectedDelay);

    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 0) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    recordingTimerRef.current = setTimeout(() => {
      initializeRecording();
    }, selectedDelay * 1000);
  }, [selectedDelay, initializeRecording]);

  const cancelCountdown = useCallback((): void => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
    }
    setCountdown(null);
    setIsCountdownStarted(false);
  }, []);

  const stopRecording = useCallback((): void => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    cancelCountdown();
  }, [isRecording, cancelCountdown]);

  // cleanup 함수를 분리하여 관리
  // cleanup 함수 강화
  const cleanup = useCallback(() => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error("MediaRecorder stop error:", error);
      }
      mediaRecorderRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = undefined;
    }
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = undefined;
    }
    chunksRef.current = [];
  }, []);

  // 뒤로가기 및 페이지 이동 감지 추가
  useEffect(() => {
    const handlePopState = () => {
      cleanup();
    };

    // 페이지 새로고침/나가기 감지
    const handleBeforeUnload = () => {
      cleanup();
    };

    // 뒤로가기 이벤트 리스너
    window.addEventListener("popstate", handlePopState);
    // 페이지 나가기 이벤트 리스너
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      cleanup();
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cleanup]);

  // history API를 통한 뒤로가기 감지
  useEffect(() => {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // pushState 오버라이드
    history.pushState = function (...args) {
      cleanup();
      return originalPushState.apply(this, args);
    };

    // replaceState 오버라이드
    history.replaceState = function (...args) {
      cleanup();
      return originalReplaceState.apply(this, args);
    };

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [cleanup]);

  // setupCamera 함수 수정
  const setupCamera = useCallback(async (): Promise<void> => {
    try {
      // 기존 스트림 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: DIMENSIONS[orientation].width },
          height: { ideal: DIMENSIONS[orientation].height },
        },
        audio: true,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);

      // 음소거 상태 적용
      const audioTrack = newStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMuted;
      }

      streamRef.current = newStream;
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError(null);

      if (onStreamReady) onStreamReady(newStream);
    } catch (err) {
      const errorMessage =
        "카메라를 시작할 수 없습니다. 카메라 권한을 확인해주세요.";
      handleError(errorMessage);
      console.error("카메라 접근 에러:", err);
    }
  }, [orientation, selectedCamera, isMuted, handleError, onStreamReady]);

  // handleExit 함수 수정
  const handleExit = useCallback(() => {
    cleanup();
    navigate(-1);
  }, [navigate, cleanup]);


  // orientation이 변경될 때마다 카메라를 재시작하는 useEffect 추가
  useEffect(() => {  
    if (!isRecording) {  
      void setupCamera();
    }
  }, [orientation]);  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* 가이드라인 다이얼로그 */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>녹화 가이드라인</DialogTitle>
            <DialogDescription>
              <div className="space-y-4 mt-4">
                {guideSteps.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowGuide(false)}>시작하기</Button>
        </DialogContent>
      </Dialog>

      {/* 페이지 이탈 경고 다이얼로그 */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>녹화를 중단하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              녹화 중인 영상은 저장되지 않습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                stopRecording();
                handleExit();
              }}
            >
              나가기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* 새로운 업로드 모달 */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>영상 업로드</DialogTitle>
            <DialogDescription>
              MP4 형식의 영상 파일을 선택해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Input
                id="video-upload"
                type="file"
                accept=".mp4"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                  }
                }}
              />
            </div>
            {selectedFile && (
              <p className="text-sm text-gray-500">
                선택된 파일: {selectedFile.name}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              취소
            </Button>
            <Button
              onClick={() => {
                if (selectedFile) {
                  handleVideoUpload(selectedFile);
                  setShowUploadModal(false);
                }
              }}
              disabled={!selectedFile}
            >
              업로드
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 에러 알림 */}
      {error && (
        <div className="w-full max-w-md mb-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* 메인 카드 */}
      <div
        className="flex gap-4"
        style={{
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 비디오 프리뷰 */}
        <div
          className="relative bg-gray-900 rounded-xl overflow-hidden shadow-inner"
          style={{
            width: DIMENSIONS[orientation].width,
            height: DIMENSIONS[orientation].height,
          }}
        >
          {/* 타이머 컨트롤 */}
          {!isRecording && (
            <div
              className="flex flex-row items-center gap-3 pt-2 absolute top-0 right-2"
              style={{
                zIndex: "100000",
              }}
            >
              <Timer className="w-6 h-6 text-gray-400" />
              <div className="gap-3 flex">
                {COUNTDOWN_OPTIONS.map((option) => (
                  <TooltipProvider key={option}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            selectedDelay === option ? "default" : "outline"
                          }
                          size="sm"
                          className={`w-8 h-8 rounded-full ${
                            selectedDelay === option
                              ? "bg-violet-500 hover:bg-violet-600"
                              : "hover:bg-gray-100"
                          } ${isRecording && "opacity-50 cursor-not-allowed"}`}
                          onClick={() => setSelectedDelay(option)}
                          disabled={isRecording}
                        >
                          {option}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{option}초 타이머</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              transform: `scale(${isFlipped ? -1 : 1}, 1)`,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={cancelCountdown}
              >
                <X className="w-6 h-6" />
              </Button>
              <span className="text-8xl font-bold text-white animate-pulse">
                {countdown}
              </span>
            </div>
          )}

          {/* 녹화 시간 표시 */}
          {isRecording && (
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
              <Circle className="h-3 w-3 fill-red-500 text-red-500" />
              <span className="text-sm font-medium text-white">
                {Math.floor(timer / 60)}:
                {(timer % 60).toString().padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 컨트롤 버튼들 */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          onClick={handleRotate}
          disabled={isRecording || isCountdownStarted}
          className="gap-2"
        >
          <RotateCw className="w-4 h-4" />
          회전
        </Button>

        <Button variant="outline" onClick={handleFlip} className="gap-2">
          <FlipHorizontal className="w-4 h-4" />
          좌우반전
        </Button>

        <Button
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isCountdownStarted && !isRecording}
          className="gap-2 min-w-[120px]"
        >
          {isRecording ? (
            <>
              <Square className="w-4 h-4" />
              녹화 중지
            </>
          ) : (
            <>
              <Video className="w-4 h-4" />
              녹화 시작
            </>
          )}
        </Button>
        <Button onClick={handleModalOpen}>파일 업로드</Button>
      </div>
      <DraggableToolbox>
        {/* 카메라 선택 및 컨트롤 */}
        <div className="p-2 bg-white w-[300px] space-y-4">
          {/* 카메라 선택 */}
          <div>
            <p className="text-sm font-medium mb-1">카메라 선택</p>
            <Select
              value={selectedCamera}
              onValueChange={(value) => {
                setSelectedCamera(value);
                void setupCamera();
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="카메라 선택" />
              </SelectTrigger>
              <SelectContent>
                {availableCameras.map((camera) => (
                  <SelectItem key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${camera.deviceId.slice(0, 4)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 메트로놈 설정 */}
          <div className="space-y-2">
            <p className="text-sm font-medium">메트로놈 설정</p>
            <div className="flex items-center gap-3">
              <Button
                variant={metronomeEnabled ? "default" : "outline"}
                onClick={() => setMetronomeEnabled(!metronomeEnabled)}
                className="flex items-center gap-2"
              >
                <Music className="w-4 h-4" />
                {metronomeEnabled ? "켜짐" : "꺼짐"}
              </Button>
              <Select
                value={timeSignature.toString()}
                onValueChange={(value) => setTimeSignature(Number(value))}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="박자" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2/4</SelectItem>
                  <SelectItem value="3">3/4</SelectItem>
                  <SelectItem value="4">4/4</SelectItem>
                  <SelectItem value="6">6/8</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* BPM 조절 */}
          <div className="space-y-2">
            <p className="text-sm font-medium">BPM</p>
            <div className="flex items-center gap-3">
              <Slider
                value={[bpm]}
                onValueChange={(value) => setBpm(value[0])}
                min={60}
                max={200}
                step={1}
                className="w-full"
              />
              <span className="text-sm font-semibold w-[50px] text-center">
                {bpm} BPM
              </span>
            </div>
          </div>
          {/* 
          메트로놈 시각적 요소
          {metronomeEnabled && (
            <VisualMetronome
              bpm={bpm}
              timeSignature={timeSignature}
              currentBeat={currentBeat}
            />
          )} */}
        </div>
      </DraggableToolbox>
    </div>
  );
};

export default VideoRecorder;
