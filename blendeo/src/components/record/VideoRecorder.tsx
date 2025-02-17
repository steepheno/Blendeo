// VideoRecorder.tsx
import { useEffect, useRef, useState, useCallback, type FC } from "react";
import {
  RotateCw,
  Video,
  Square,
  FlipHorizontal,
  X,
  Timer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { VideoData } from "@/types/components/recording/video";
import useVideoStore from "@/stores/videoStore";

type Orientation = "portrait" | "landscape";

interface Dimensions {
  width: number;
  height: number;
}

interface VideoRecorderProps {
  onError?: (error: string) => void;
  onRecordingComplete?: (blob: Blob) => void;
  onComplete?: () => void;
}

type DimensionsMap = {
  [K in Orientation]: Dimensions;
};

const DIMENSIONS: DimensionsMap = {
  portrait: { width: 480, height: 676 },
  landscape: { width: 676, height: 480 },
};

const COUNTDOWN_OPTIONS = [0, 3, 5, 10, 30] as const;

const VideoRecorder: FC<VideoRecorderProps> = ({
  onError,
  onRecordingComplete,
}) => {
  const navigate = useNavigate();
  const { setVideoData } = useVideoStore();

  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedDelay, setSelectedDelay] = useState(3);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountdownStarted, setIsCountdownStarted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const countdownTimerRef = useRef<NodeJS.Timeout>();
  const recordingTimerRef = useRef<NodeJS.Timeout>();

  const getSupportedMimeType = useCallback((): string => {
    const types = [
      // "video/webm;codecs=vp8,opus",
      // "video/webm",
      "video/mp4;codecs=avc1.42E01E,mp4a.40.2"
      // "video/webm;codecs=vp9",
    ];

    return types.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
  }, []);

  const handleError = useCallback(
    (errorMessage: string): void => {
      setError(errorMessage);
      onError?.(errorMessage);
    },
    [onError]
  );

  const setupCamera = useCallback(async (): Promise<void> => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: DIMENSIONS[orientation].width },
          height: { ideal: DIMENSIONS[orientation].height },
        },
        audio: true,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);

      streamRef.current = newStream;
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError(null);
    } catch (err) {
      const errorMessage =
        "카메라를 시작할 수 없습니다. 카메라 권한을 확인해주세요.";
      handleError(errorMessage);
      console.error("카메라 접근 에러:", err);
    }
  }, [orientation, handleError]);

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
  }, [setupCamera, handleError, getSupportedMimeType]);

  const handleRotate = (): void => {
    setOrientation((prev: Orientation) =>
      prev === "portrait" ? "landscape" : "portrait"
    );
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
                  video.addEventListener('seeked', () => {
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
  }, [handleError, onRecordingComplete, setVideoData, navigate, getSupportedMimeType]);

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

  const videoStyle = {
    transform: `scale(${isFlipped ? -1 : 1}, 1)`,
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {error && (
        <div className="w-full max-w-md p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-3 pt-2">
          <Timer className="w-10 h-10 text-gray-100" />
          {COUNTDOWN_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedDelay(option)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                selectedDelay === option
                  ? "bg-violet-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-colors ${isRecording && "opacity-50 cursor-not-allowed"}`}
              disabled={isRecording}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="relative bg-black-900 rounded-lg w-676 h-676">
          <div
            className="relative bg-gray-900 rounded-lg overflow-hidden"
            style={{
              width: DIMENSIONS[orientation].width,
              height: DIMENSIONS[orientation].height,
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={videoStyle}
            />
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
                <button
                  onClick={cancelCountdown}
                  className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors"
                  aria-label="카운트다운 취소"
                >
                  <X className="w-6 h-6" />
                </button>
                <span className="text-8xl font-bold text-white">
                  {countdown}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleRotate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isRecording || isCountdownStarted}
        >
          <RotateCw className="w-5 h-5" />
          회전
        </button>

        <button
          type="button"
          onClick={handleFlip}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <FlipHorizontal className="w-5 h-5" />
          좌우반전
        </button>

        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center gap-2 px-4 py-2 ${
            isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white rounded-lg transition-colors`}
          disabled={isCountdownStarted && !isRecording}
        >
          {isRecording ? (
            <>
              <Square className="w-5 h-5" />
              녹화 중지
            </>
          ) : (
            <>
              <Video className="w-5 h-5" />
              녹화 시작
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoRecorder;
