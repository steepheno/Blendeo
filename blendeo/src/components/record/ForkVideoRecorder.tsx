import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Square } from "lucide-react";
import useForkVideoStore from "@/stores/forkVideoStore";

type Orientation = "portrait" | "landscape";

interface Dimensions {
  width: number;
  height: number;
}

type DimensionsMap = {
  [K in Orientation]: Dimensions;
};

const DIMENSIONS: DimensionsMap = {
  portrait: { width: 480, height: 676 },
  landscape: { width: 676, height: 480 },
};

interface ForkVideoRecorderProps {
  videoUrl: string;
  repeatCount: number;
}

const ForkVideoRecorder: React.FC<ForkVideoRecorderProps> = ({
  videoUrl,
  repeatCount,
}) => {
  const navigate = useNavigate();
  const { setRecordedData } = useForkVideoStore();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLoop, setCurrentLoop] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalOrientation, setOriginalOrientation] =
    useState<Orientation>("portrait");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const previewRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const destinationNodeRef = useRef<MediaStreamAudioDestinationNode | null>(
    null
  );

  // 원본 비디오의 방향 감지
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleMetadata = () => {
        const orientation =
          video.videoWidth > video.videoHeight ? "landscape" : "portrait";
        setOriginalOrientation(orientation);
      };

      video.addEventListener("loadedmetadata", handleMetadata);
      return () => video.removeEventListener("loadedmetadata", handleMetadata);
    }
  }, []);

  // Web Audio API 설정
  const setupAudioContext = useCallback(async (userStream: MediaStream) => {
    if (!videoRef.current) return;

    // AudioContext 초기화
    audioContextRef.current = new AudioContext();

    // 비디오와 마이크의 오디오 소스 생성
    const videoSource = audioContextRef.current.createMediaElementSource(
      videoRef.current
    );
    const micSource =
      audioContextRef.current.createMediaStreamSource(userStream);

    // 마이크와 비디오 오디오를 믹스하기 위한 게인 노드
    const videoGain = audioContextRef.current.createGain();
    const micGain = audioContextRef.current.createGain();

    videoGain.gain.value = 1.0; // 비디오 볼륨
    micGain.gain.value = 0.6; // 마이크 볼륨

    // 비디오 오디오는 스피커로 직접 출력되도록 연결
    videoSource.connect(videoGain);
    videoGain.connect(audioContextRef.current.destination); // 스피커로 출력

    // 녹화를 위한 destination 노드 생성
    destinationNodeRef.current =
      audioContextRef.current.createMediaStreamDestination();

    // 비디오와 마이크 둘 다 녹화 대상에 연결
    micSource.connect(micGain);
    micGain.connect(destinationNodeRef.current);
  }, []);

  // 비디오 녹화 설정
  const setupRecording = useCallback(async () => {
    try {
      setIsLoading(true);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      // 카메라와 마이크 스트림 가져오기
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: DIMENSIONS[originalOrientation].width },
          height: { ideal: DIMENSIONS[originalOrientation].height },
        },
        audio: true,
      });

      // AudioContext가 없으면 설정
      if (!audioContextRef.current) {
        await setupAudioContext(userStream);
      }

      if (!destinationNodeRef.current) {
        throw new Error("Audio destination node not initialized");
      }

      // 비디오 스트림과 오디오 스트림 결합
      const combinedStream = new MediaStream([
        ...userStream.getVideoTracks(),
        ...destinationNodeRef.current.stream.getAudioTracks(),
      ]);

      streamRef.current = combinedStream;
      if (previewRef.current) {
        previewRef.current.srcObject = userStream;
      }

      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
      });

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
        });

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

        setRecordedData({
          blobUrl,
          orientation: originalOrientation,
          duration,
        });

        navigate("/fork/edit");
      };

      mediaRecorderRef.current = mediaRecorder;
      setError(null);
    } catch (err) {
      setError(
        "카메라나 오디오 설정을 시작할 수 없습니다. 권한을 확인해주세요."
      );
      console.error("설정 에러:", err);
    } finally {
      setIsLoading(false);
    }
  }, [originalOrientation, navigate, setRecordedData, setupAudioContext]);

  // 컴포넌트 마운트 시 설정
  useEffect(() => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setError("이 브라우저는 비디오 녹화를 지원하지 않습니다.");
      return;
    }

    void setupRecording();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, [setupRecording]);

  // 비디오 재생 종료 처리
  const handleVideoEnd = () => {
    if (currentLoop < repeatCount - 1) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        void videoRef.current.play();
      }
      setCurrentLoop((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      setCurrentLoop(0);
      if (isRecording) {
        stopRecording();
      }
    }
  };

  // 동기화된 재생 및 녹화 시작
  const startSyncedRecording = async () => {
    if (!isPlaying && videoRef.current && !isLoading) {
      try {
        setIsLoading(true);

        // AudioContext 재개
        if (audioContextRef.current?.state === "suspended") {
          await audioContextRef.current.resume();
        }

        // 비디오 초기화
        videoRef.current.currentTime = 0;
        setIsPlaying(true);
        setIsRecording(true);

        // MediaRecorder 시작
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.start(200); // 더 작은 타임슬라이스 사용
        }

        // 약간의 지연 후 비디오 재생 시작
        await new Promise((resolve) => setTimeout(resolve, 100));
        await videoRef.current.play();
      } catch (err) {
        setError("녹화 시작 중 오류가 발생했습니다.");
        console.error("녹화 시작 에러:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 녹화 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 비디오 컨테이너의 스타일 계산
  const getVideoContainerStyle = () => {
    const dimensions = DIMENSIONS[originalOrientation];
    return {
      width: dimensions.width,
      height: dimensions.height,
    };
  };

  return (
    <div
      className={`flex gap-2 items-start p-4 ${
        originalOrientation === "landscape" ? "flex-col" : "flex-row"
      }`}
    >
      {/* 원본 비디오 플레이어 */}
      <div className="flex flex-col items-center space-y-4">
        <div
          className="bg-black rounded-lg overflow-hidden"
          style={getVideoContainerStyle()}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            onEnded={handleVideoEnd}
            preload="auto"
            playsInline
            crossOrigin="anonymous"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>

        <div className="text-sm text-gray-600">
          현재 {currentLoop + 1}번째 재생 중 / 총 {repeatCount}회
        </div>
      </div>

      {/* 녹화 미리보기 */}
      <div className="flex flex-col items-center space-y-4">
        {error && (
          <div className="w-full p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div
          className="bg-black rounded-lg overflow-hidden"
          style={getVideoContainerStyle()}
        >
          <video
            ref={previewRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        </div>

        <button
          onClick={startSyncedRecording}
          disabled={isRecording || isPlaying || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            "준비중..."
          ) : isRecording ? (
            <>
              <Square className="w-5 h-5" />
              녹화 중
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

export default ForkVideoRecorder;
