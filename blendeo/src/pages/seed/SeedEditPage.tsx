import { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEditStore } from '@/stores/projectStore';
import { uploadBlendedVideo } from "@/api/project";

import Searchbar from "@/components/layout/Searchbar";
import EditorTimeline from "@/components/common/EditorTimeline";
import AudioControl from "@/components/common/AudioControl";

interface LocationState {
  recordedVideoURL: string;
  forkedVideo: string;
  forkedEndTime: number;
}

const SeedEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recordedVideoURL, forkedVideo: forkedVideoUrl, forkedEndTime } = location.state as LocationState;

  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const [recordedVolume, setRecordedVolume] = useState(0.5);  // 중간 지점이 100% (현재 크기)
  const [error, setError] = useState<string>("");
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
              if (isMounted) {
                setVideosLoaded(true);  // 비디오 로드 완료 시 상태 업데이트
              }
              resolve(true);
            };
            recordedVideo.onerror = () => {
              console.error("녹화된 비디오 로드 실패");
              resolve(false);
            };
          });
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

  const playVideo = async () => {
    try {
      if (!videosLoaded) {
        setError("비디오가 아직 로딩 중입니다.");
        return;
      }

      const recordedVideo = recordedVideoRef.current;

      if (!recordedVideo) {
        console.error("비디오 요소를 찾을 수 없습니다.");
        return;
      }

      // 볼륨 설정
      recordedVideo.volume = recordedVolume * 2;  // 소리 n배 키우기

      // 처음부터 재생
      recordedVideo.currentTime = 0;

      try {
        await Promise.all([
          recordedVideo.play()
        ]);
        console.log("촬영한 비디오 재생 시작");
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

  const pauseBothVideos = () => {
    const recordedVideo = recordedVideoRef.current;

    if (recordedVideo && !recordedVideo.paused) {
      recordedVideo.pause();
    }
  };

  const handleRecordedVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setRecordedVolume(volume);
    if (recordedVideoRef.current) {
      recordedVideoRef.current.volume = volume * 2;  // n배로 키우기 설정
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
      navigate("/project/upload");
    } catch (err) {
      console.error("프로젝트 편집 에러:", err);
      setError("프로젝트 편집에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAudioControlChange = (id: string, value: number | string) => {
    if (id === 'volume') {
      setRecordedVolume(value as number);
      if (recordedVideoRef.current) {
        recordedVideoRef.current.volume = (value as number) * 2;  // 2배 증폭 유지
      }
    }
  }

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
      <div>
      </div>
      <div className="w-full max-w-6xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-4 gap-20">
          <div className="space-y-2 w-full max-w-4xl">
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
                step="0.05"
                value={recordedVolume}
                onChange={handleRecordedVolumeChange}
                className="w-full"
              />
              <span>
                {Math.round(recordedVolume * 200)}%
                {recordedVolume > 0.5 ? `(${((recordedVolume - 0.5) * 2 + 1).toFixed(1)}배 증폭)` : ''}
              </span>
            </div>
          </div>
          <AudioControl
            onAudioControlChange={handleAudioControlChange}
            initialVolume={recordedVolume}
          />
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={playVideo}
            disabled={!videosLoaded}
            className={`px-6 py-2 rounded-lg font-semibold text-white ${
              videosLoaded ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"
            }`}
          >
            재생
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
        <EditorTimeline />
      </div>
    </div>
  );
};

export default SeedEditPage;