import { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Searchbar from "@/components/layout/Searchbar";
import { useProjectStore, useEditStore } from '@/stores/projectStore';
import { uploadBlendedVideo } from "@/api/project";

interface LocationState {
  recordedVideoURL: string;
  recordedBlob: Blob;
  cropDimensions: {
    isHorizontal: boolean;
    targetWidth: number;
    targetHeight: number;
  };
}

const RecordedEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recordedVideoURL, recordedBlob, cropDimensions } = location.state as LocationState;

  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const [recordedVolume, setRecordedVolume] = useState(1);
  const [error, setError] = useState<string>("");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { setUrl } = useEditStore();

  useEffect(() => {
    let isMounted = true;

    const initializeVideo = async () => {
      try {
        console.log("VideoEditPage 초기화 시작");

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

          if (isMounted) {
            setVideoLoaded(true);
            console.log("비디오 초기화 완료, videoLoaded 설정됨");
          }
        }
      } catch (error) {
        console.error("비디오 초기화 에러: ", error);
        if (isMounted) {
          setError("비디오를 불러오는데 실패했습니다.");
        }
      }
    };

    initializeVideo();

    return () => {
      isMounted = false;
      URL.revokeObjectURL(recordedVideoURL);
    };
  }, [recordedVideoURL]);

  const playVideo = async () => {
    try {
      if (!videoLoaded) {
        setError("비디오가 아직 로딩 중입니다.");
        return;
      }

      const recordedVideo = recordedVideoRef.current;

      if (!recordedVideo) {
        console.error("비디오 요소를 찾을 수 없습니다.");
        return;
      }

      recordedVideo.volume = recordedVolume;
      recordedVideo.currentTime = 0;

      try {
        await recordedVideo.play();
        console.log("비디오 재생 시작됨");
      } catch (error) {
        if (error instanceof Error) {
          setError(`재생 실패: ${error.message}`);
        } else {
          setError("재생에 실패했습니다.");
        }
        console.error("비디오 재생 중 에러 발생:", error);
      }
    } catch (err) {
      console.error("재생 에러:", err);
      setError("재생에 실패했습니다.");
    }
  };

  const pauseVideo = () => {
    const recordedVideo = recordedVideoRef.current;
    if (recordedVideo && !recordedVideo.paused) {
      recordedVideo.pause();
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

      const recordedFile = new File(
        [recordedBlob],
        'recorded-video.webm',
        {
          type: 'video/webm',
          lastModified: Date.now()
        }
      );

      console.log("File size:", recordedFile.size);
      console.log("Crop dimensions:", cropDimensions);

      // 포크된 비디오가 없는 경우이므로 ""을 전달
      const result = await uploadBlendedVideo("", recordedFile, cropDimensions);
      console.log(result);

      setUrl(result);
      navigate("/first/upload");
    } catch (err) {
      console.error("업로드 에러:", err);
      setError("영상 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  const getVideoContainerStyle = () => {
    return {
      width: cropDimensions.isHorizontal ? '676px' : '480px',
      height: cropDimensions.isHorizontal ? '480px' : '676px',
      overflow: 'hidden'
    };
  };

  const getVideoStyle = () => {
    return {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
      objectPosition: 'center',
      aspectRatio: cropDimensions.isHorizontal ? '676/480' : '480/676'
    };
  };

  return (
    <div className="flex flex-col bg-black min-h-screen items-center p-4">
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-semibold">영상을 저장하는 중...</p>
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

        <div className="flex justify-center mb-4">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-white">녹화된 영상</p>
            <div style={getVideoContainerStyle()}>
              <video
                ref={recordedVideoRef}
                style={getVideoStyle()}
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
            onClick={playVideo}
            disabled={!videoLoaded}
            className={`px-6 py-2 rounded-lg font-semibold text-white ${
              videoLoaded ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"
            }`}
          >
            재생
          </button>
          <button
            onClick={pauseVideo}
            disabled={!videoLoaded}
            className={`px-6 py-2 rounded-lg font-semibold text-white ${
              videoLoaded ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-400"
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

export default RecordedEdit;