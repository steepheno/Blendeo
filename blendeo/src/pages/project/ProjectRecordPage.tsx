import ImageComponent from '@/components/record/ImageComponent';
import Searchbar from '@/components/layout/Searchbar';
import recordStop from "@/assets/stop.png";

import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/projectStore';

const ProjectRecordPage = () => {
  const { getRedirectState } = useProjectStore();
  const currentProject = getRedirectState('project-fork');
  const navigate = useNavigate();

  const [recordingTime, setRecordingTime] = useState(0);
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const forkedVideoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>("");
  const recordedChunksRef = useRef<Blob[]>([]);

  // cleanup function to handle URL revocation
  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    const initializeVideo = async () => {
      try {
        if (forkedVideoRef.current && currentProject) {
          forkedVideoRef.current.src = currentProject.videoUrl;
          forkedVideoRef.current.muted = false;
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
        console.error("초기화 에러:", err);
      }
    };

    initializeVideo();
    return cleanup;
  }, [currentProject]);

  const startRecording = async () => {
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
            const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
            setRecordingTime(elapsedTime);
          }
        }, 1000);

        try {
          await forkedVideo.play();
        } catch (err) {
          setError("포크된 비디오 재생 실패");
          console.error(err);
          stopRecording();
        }
      };

      mediaRecorder.ondataavailable = (event) => {
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

          // Create object URL for the recorded video
          const recordedVideoURL = URL.createObjectURL(recordedBlob);

          // Navigate with state containing the video URL
          navigate("/project/forkedit", {
            state: {
              recordedVideoURL,
              forkedVideo: currentProject?.videoUrl,
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
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col">
      <div className="flex overflow-hidden flex-col w-full bg-stone-950 max-md:max-w-full">
        <Searchbar />
        <main className="flex flex-col flex-1 w-full max-md:max-w-full justify-center">
          <div className="flex flex-wrap flex-1 justify-center items-center size-full max-md:max-w-full">
            {/* 초 컨트롤러 */}
            <div className="flex overflow-hidden flex-col justify-center items-center self-stretch px-5 my-auto w-[88px]">
              <ImageComponent
                src={"https://cdn.builder.io/api/v1/image/assets/TEMP/e7977e42b45afa4f15e1dda9dccb118de198aa22f05cde5f60c4d4a6712f9cbf?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"}
                alt="Music Control"
                className="object-contain mt-10 w-12 aspect-square my-[20px]"
              />
              <div className="text-white font-pathway text-4xl my-[15px] cursor-pointer">3</div>
              <div className="text-white font-pathway text-4xl my-[15px] cursor-pointer">5</div>
              <div className="text-white font-pathway text-4xl my-[15px] cursor-pointer">10</div>
              <div className="text-white font-pathway text-4xl my-[15px] cursor-pointer">30</div>
            </div>

            {/* fork 및 촬영 */}
            <div className="flex flex-col items-center self-stretch my-auto min-w-[240px] w-[962px] max-md:max-w-full">
              <div className="flex overflow-hidden flex-col justify-center items-center max-w-full">
                <div className="flex overflow-hidden flex-col justify-center w-full max-w-screen-md min-h-[768px] max-md:max-w-full">
                  <div className="flex flex-col gap-4 justify-center items-center rounded-xl w-full max-md:max-w-full">
                    <video
                      ref={forkedVideoRef}
                      className="w-full h-full object-contain min-h-[500px]"
                      playsInline
                    />
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain min-h-[500px]"
                      autoPlay
                      playsInline
                      muted
                    />
                  </div>
                </div>
              </div>
              <div className="text-white my-[20px] self-start">
                <p className='text-left'>{formatTime(recordingTime)}</p>
              </div>
              <div className="flex overflow-hidden flex-wrap gap-2.5 justify-center items-center max-w-full w-[816px]">
                <div className="flex overflow-hidden flex-wrap grow shrink gap-10 justify-center items-center self-stretch px-5 my-auto min-w-[240px] w-[653px]">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className="w-[60px] h-[60px] p-0 m-0">
                    <ImageComponent
                      src={
                        isRecording ? recordStop
                        : "https://cdn.builder.io/api/v1/image/assets/TEMP/c4fb916d889dc55dbd3feb6af5e158dc8f1eb8f7e7f308691a72c6dc14e5a098?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"}
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

export default ProjectRecordPage;