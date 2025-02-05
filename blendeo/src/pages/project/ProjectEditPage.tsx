import { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Searchbar from "@/components/layout/Searchbar";
import { useEditStore } from '@/stores/projectStore';
import { uploadBlendedVideo } from "@/api/project";

interface LocationState {
  recordedVideoURL: string;
  forkedVideo: string;
  forkedEndTime: number;
}

const ForkedEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recordedVideoURL, forkedVideo: forkedVideoUrl, forkedEndTime } = location.state as LocationState;

  const forkedVideoRef = useRef<HTMLVideoElement>(null);
  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const [forkedVolume, setForkedVolume] = useState(1);
  const [recordedVolume, setRecordedVolume] = useState(1);
  const [error, setError] = useState<string>("");
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  //const { getRedirectState } = useProjectStore();
  const { setUrl } = useEditStore();

  useEffect(() => {
    let isMounted = true;

    const initializeVideos = async () => {
      try {
        console.log("VideoEditPage 초기화 시작");

        // 녹화된 영상 설정
        const recordedVideo = recordedVideoRef.current;
        if (recordedVideo && recordedVideoURL) {
          recordedVideo.src = recordedVideoURL;
          await new Promise((resolve) => {
            recordedVideo.onloadedmetadata = () => {
              console.log("녹화된 영상 메타데이터 로드 완료");
              resolve(true);
            };
            recordedVideo.onerror = () => {
              console.error("녹화된 비디오 로드 실패");
              resolve(false);
            };
          });
        }

        // 포크된 영상 설정
        const forkedVideo = forkedVideoRef.current;
        if (forkedVideo && forkedVideoUrl) {
          forkedVideo.src = forkedVideoUrl;

          await new Promise((resolve) => {
            forkedVideo.onloadedmetadata = () => {
              console.log("포크된 영상 메타데이터 로드 완료");
              resolve(true);
            };
            forkedVideo.onerror = () => {
              console.error("포크된 비디오 로드 실패");
              resolve(false);
            };
          });

          const handleTimeUpdate = () => {
            if (forkedVideo.currentTime >= forkedEndTime) {
              forkedVideo.pause();
              forkedVideo.currentTime = forkedEndTime;
            }
          };

          forkedVideo.addEventListener("timeupdate", handleTimeUpdate);

          if (isMounted) {
            setVideosLoaded(true);
            console.log("비디오 초기화 완료, videosLoaded 설정됨");
          }

          return () => {
            forkedVideo.removeEventListener("timeupdate", handleTimeUpdate);
            // Cleanup: revoke object URL
            URL.revokeObjectURL(recordedVideoURL);
          };
        }
      } catch (error) {
        console.error("비디오 초기화 에러: ", error);
        if (isMounted) {
          setError("비디오를 불러오는데 실패했습니다.");
        }
      }
    };

    initializeVideos();

    return () => {
      isMounted = false;
    };
  }, [recordedVideoURL, forkedVideoUrl, forkedEndTime]);

  const playBothVideos = async () => {
    try {
      if (!videosLoaded) {
        setError("비디오가 아직 로딩 중입니다.");
        return;
      }

      const forkedVideo = forkedVideoRef.current;
      const recordedVideo = recordedVideoRef.current;

      if (!forkedVideo || !recordedVideo) {
        console.error("비디오 요소를 찾을 수 없습니다.");
        return;
      }

      // 볼륨 설정
      forkedVideo.volume = forkedVolume;
      recordedVideo.volume = recordedVolume;

      // 둘 다 처음부터 재생
      forkedVideo.currentTime = 0;
      recordedVideo.currentTime = 0;

      try {
        await Promise.all([
          forkedVideo.play(),
          recordedVideo.play()
        ]);
        console.log("두 비디오 모두 재생 시작됨");
      } catch (error) {
        if (error instanceof Error) {
          setError(`동시 재생 실패: ${error.message}`);
        } else {
          setError("동시 재생에 실패했습니다.");
        }
        console.error("비디오 재생 중 에러 발생:", error);
      }
    } catch (err) {
      console.error("재생 에러:", err);
      setError("동시 재생에 실패했습니다.");
    }
  };

  const pauseBothVideos = () => {
    const forkedVideo = forkedVideoRef.current;
    const recordedVideo = recordedVideoRef.current;

    if (forkedVideo && !forkedVideo.paused) {
      forkedVideo.pause();
    }
    if (recordedVideo && !recordedVideo.paused) {
      recordedVideo.pause();
    }
  };

  const handleForkedVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setForkedVolume(volume);
    if (forkedVideoRef.current) {
      forkedVideoRef.current.volume = volume;
    }
  };

  const handleRecordedVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setRecordedVolume(volume);
    if (recordedVideoRef.current) {
      recordedVideoRef.current.volume = volume;
    }
  };

  const handleComplete = async () => {
    try {
      setIsUploading(true);

      // URL에서 Blob 가져오기
      const response = await fetch(recordedVideoURL);
      const recordedBlob = await response.blob();

      // Blob을 File로 변환
      const recordedFile = new File(
        [recordedBlob],
        'recorded-video.webm',
        {
          type: 'video/webm',
          lastModified: Date.now()
        }
      );

      console.log("File size:", recordedFile.size);

      // API 호출
      const result = await uploadBlendedVideo(forkedVideoUrl, recordedFile);
      console.log(result);

      setUrl(result);

      // 페이지 전환
      navigate("/project/forkupload");
    } catch (err) {
      console.error("프로젝트 포크 에러:", err);
      setError("프로젝트 포크에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col bg-black min-h-screen items-center p-4">
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-semibold">편집된 영상을 저장하는 중...</p>
            <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
          </div>
        </div>
      )}
      <Searchbar />
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-white">영상 편집</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-white">포크한 영상</p>
            <div className="aspect-video bg-black rounded overflow-hidden">
              <video
                ref={forkedVideoRef}
                className="w-full h-full object-contain"
                playsInline
              />
            </div>
            <div className="flex items-center space-x-2 text-white">
              <span>볼륨:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={forkedVolume}
                onChange={handleForkedVolumeChange}
                className="w-full"
              />
              <span>{Math.round(forkedVolume * 100)}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold text-white">녹화된 영상</p>
            <div className="aspect-video bg-black rounded overflow-hidden">
              <video
                ref={recordedVideoRef}
                className="w-full h-full object-contain"
                playsInline
              />
            </div>
            <div className="flex items-center space-x-2 text-white">
              <span>볼륨:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={recordedVolume}
                onChange={handleRecordedVolumeChange}
                className="w-full"
              />
              <span>{Math.round(recordedVolume * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={playBothVideos}
            disabled={!videosLoaded}
            className={`px-6 py-2 rounded-lg font-semibold text-white ${
              videosLoaded ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"
            }`}
          >
            동시 재생
          </button>
          <button
            onClick={pauseBothVideos}
            disabled={!videosLoaded}
            className={`px-6 py-2 rounded-lg font-semibold text-white ${
              videosLoaded ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-400"
            }`}
          >
            일시 정지
          </button>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleComplete}
            className="px-6 py-3 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white"
          >
            편집 완료
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg font-semibold bg-gray-500 hover:bg-gray-600 text-white"
          >
            다시 촬영하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForkedEdit;