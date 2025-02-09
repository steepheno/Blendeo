import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, Timer } from "lucide-react";

import ImageComponent from "@/components/record/ImageComponent";
import Searchbar from "@/components/layout/Searchbar";
import recordStop from "@/assets/stop.png";
import { useProjectStore, useEditStore } from "@/stores/projectStore";

type DelayOptions = 3 | 5 | 10;

const ForkRecordPage = () => {
  const { getRedirectState } = useProjectStore();
  const { setUrl } = useEditStore();

  const currentProject = getRedirectState('project-fork');
  const navigate = useNavigate();

  const [recordingTime, setRecordingTime] = useState<number>(0);
  // Change the type to NodeJS.Timeout
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const forkedVideoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>("");
  const recordedChunksRef = useRef<Blob[]>([]);

  const [isHorizontal, setIsHorizontal] = useState<boolean>(true);
  const [selectedDelay] = useState<DelayOptions>(3);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    console.log("Cleanup called");
  }, []);

  useEffect(() => {
    const initializeVideo = async () => {
      try {
        if (forkedVideoRef.current && currentProject) {
          forkedVideoRef.current.src = currentProject.videoUrl;
          forkedVideoRef.current.muted = false;
          
          forkedVideoRef.current.onloadeddata = () => {
            console.log("Forked video loaded successfully");
          };

          forkedVideoRef.current.onerror = () => {
            console.error("Forked video load error");
          };

          await forkedVideoRef.current.load();
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (err) {
        setError("카메라 초기화 실패");
        console.error("초기화 에러:", err, error);
      }
    };

    initializeVideo();
    return cleanup;
  }, [currentProject, cleanup]);

  const stopRecording = useCallback((): void => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      console.log(recordingTime);
      
    }
  }, [isRecording]);

  const startRecording = useCallback(async (): Promise<void> => {
    if (!streamRef.current || !forkedVideoRef.current) return;

    try {
      recordedChunksRef.current = [];
      const forkedVideo = forkedVideoRef.current;
      forkedVideo.currentTime = 0;

      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: "video/webm;codecs=vp8,opus",
        videoBitsPerSecond: 2500000,
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.onstart = async () => {
        setIsRecording(true);
        startTimeRef.current = Date.now();
        setRecordingTime(0);
    
        timeRef.current = setInterval(() => {
          if (startTimeRef.current) {
            const elapsedTime = Math.floor(
              (Date.now() - startTimeRef.current) / 1000
            );
            setRecordingTime(elapsedTime);
          }
        }, 1000) as NodeJS.Timeout; // Add type assertion here
    
        try {
          await forkedVideo.play();
        } catch (err) {
          setError("포크된 비디오 재생 실패");
          console.error(err);
          stopRecording();
        }
      };

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setIsRecording(false);
        if (timeRef.current) {
          clearInterval(timeRef.current);
        }

        try {
          const endTime = forkedVideo.currentTime;
          forkedVideo.pause();

          const recordedBlob = new Blob(recordedChunksRef.current, {
            type: "video/webm",
          });

          if (recordedBlob.size === 0) {
            throw new Error("녹화된 데이터가 없습니다.");
          }

          const videoFile = URL.createObjectURL(recordedBlob);

          console.log("Recording stopped: ", {
            videoFile,
            forkedUrl: currentProject?.videoUrl,
            endTime
          });

          setUrl(JSON.stringify({
            videoFile,
            forkedUrl: currentProject?.videoUrl
          }));

          navigate("/project/forkedit", {
            state: {
              videoFile,
              forkedUrl: currentProject?.videoUrl,
              forkedEndTime: endTime,
            },
          });
        } catch (err) {
          setError("비디오 저장 실패");
          console.error("비디오 처리 에러:", err);
        }
      };

      mediaRecorder.start(1000);
    } catch (err) {
      setError("녹화 시작 실패");
      console.error("녹화 에러:", err);
    }
  }, [navigate, currentProject?.videoUrl, stopRecording]);

  const startCountdown = useCallback((): void => {
    if (!selectedDelay || isCountingDown) return;

    setIsCountingDown(true);
    setCountdownValue(selectedDelay);

    const countdownInterval = setInterval(() => {
      setCountdownValue((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(countdownInterval);
          setIsCountingDown(false);
          startRecording();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [selectedDelay, isCountingDown, startRecording]);

  const cancelCountdown = useCallback((): void => {
    setIsCountingDown(false);
    setCountdownValue(null);
  }, []);

  useEffect(() => {
    const initializeVideo = async (): Promise<void> => {
      try {
        if (forkedVideoRef.current && currentProject) {
          forkedVideoRef.current.src = currentProject.videoUrl;
          forkedVideoRef.current.muted = false;
          await forkedVideoRef.current.load();

          forkedVideoRef.current.onloadedmetadata = () => {
            const video = forkedVideoRef.current;
            if (video) {
              setIsHorizontal(video.videoWidth > video.videoHeight);
            }
          };
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (err) {
        setError("카메라 초기화 실패");
        console.error("초기화 에러:", err);
      }
    };

    initializeVideo();
    return cleanup;
  }, [currentProject, cleanup]);

  return (
    <div className="flex flex-col">
      <div className="flex overflow-hidden flex-col w-full bg-stone-950 max-md:max-w-full">
        <Searchbar />
        <main className="flex flex-col flex-1 w-full max-md:max-w-full justify-center relative">
          {isCountingDown && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
              <button
                type="button"
                onClick={cancelCountdown}
                className="absolute top-4 right-4 text-white hover:text-gray-300"
                aria-label="Cancel countdown"
              >
                <X size={32} />
              </button>
              <div className="text-white font-pathway text-9xl">
                {countdownValue}
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row flex-1 justify-center items-center size-full max-md:max-w-full">
            <div className="flex flex-row lg:flex-col justify-center items-center self-stretch px-5 my-auto sm:w-auto min-h-[300px]">
              <div className="flex flex-row lg:flex-col items-center justify-center gap-8">
                <Timer className="w-12 h-12 text-white" strokeWidth={1.5} />
                <div className="flex flex-row lg:flex-col gap-4 items-center justify-center" />
              </div>
            </div>

            <div className="flex flex-col items-center self-stretch my-auto min-w-[240px] w-[962px] max-md:max-w-full">
              <div className="flex overflow-hidden flex-col justify-center items-center max-w-full">
                <div className={`flex ${isHorizontal ? 'flex-col' : 'flex-row'} gap-4 justify-center items-center rounded-xl w-full max-md:max-w-full`}>
                  <div className={`${isHorizontal ? 'w-[676px] h-[480px]' : 'w-[480px] h-[676px]'} overflow-hidden`}>
                    <video
                      ref={forkedVideoRef}
                      className="w-full h-full object-cover object-center"
                      style={{
                        aspectRatio: "480/676",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      playsInline
                    />
                  </div>
                  <div className={`${isHorizontal ? 'w-[676px] h-[480px]' : 'w-[480px] h-[676px]'} overflow-hidden`}>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                      autoPlay
                      playsInline
                      muted
                    />
                  </div>
                </div>
              </div>
              <div className="flex overflow-hidden flex-wrap gap-2.5 justify-center items-center max-w-full w-[816px]">
                <div className="flex overflow-hidden flex-wrap grow shrink gap-10 justify-center items-center self-stretch px-5 my-auto min-w-[240px] w-[653px]">
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startCountdown}
                    className="w-[60px] h-[60px] p-0 m-0"
                  >
                    <ImageComponent
                      src={isRecording ? recordStop : "https://cdn.builder.io/api/v1/image/assets/TEMP/c4fb916d889dc55dbd3feb6af5e158dc8f1eb8f7e7f308691a72c6dc14e5a098?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"}
                      alt="녹화/정지"
                      className="object-contain w-[60px] h-[60px] p-0 m-0"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ForkRecordPage;