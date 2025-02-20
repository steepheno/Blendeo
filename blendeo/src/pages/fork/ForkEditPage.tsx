import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';
import useForkVideoStore from '@/stores/forkVideoStore';


const ForkEditor = () => {
  const navigate = useNavigate();
  const { recordedData, originalProjectData, loopCnt, uploadVideo, setCreatedUrl } = useForkVideoStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLoop, setCurrentLoop] = useState(0);

  const originalVideoRef = useRef<HTMLVideoElement>(null);
  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const originalDuration = originalProjectData?.duration || 0;
  const totalDuration = originalDuration * loopCnt;

  const [isUploading, setIsUploading] = useState(false);

  // 비디오 시간 업데이트 처리
  useEffect(() => {
    const videoElement = recordedVideoRef.current;

    const handleTimeUpdate = () => {
      if (videoElement) {
        setCurrentTime(videoElement.currentTime);
      }
    };

    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, []);

  useEffect(() => {
    const videoElement = originalVideoRef.current;

    const handleOriginalEnd = () => {
      console.log('Original video ended', { currentLoop, loopCnt });

      // currentLoop가 0부터 시작하므로, currentLoop + 1이 실제 재생 횟수입니다.
      // 따라서 currentLoop가 loopCnt보다 작을 때만 다음 재생을 시작합니다.
      if (currentLoop + 1 < loopCnt && isPlaying) {
        setCurrentLoop(prev => prev + 1);
        if (videoElement) {
          videoElement.currentTime = 0;
          void videoElement.play();
        }
      }
    };

    if (videoElement) {
      videoElement.addEventListener('ended', handleOriginalEnd);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', handleOriginalEnd);
      }
    };
  }, [currentLoop, loopCnt, isPlaying]);

  if (!recordedData) {
    return null;
  }

  const { blobUrl, orientation } = recordedData;

  const handleRecordedEnd = () => {
    console.log('Recorded video ended');
    setIsPlaying(false);
    setCurrentLoop(0);
    setCurrentTime(0);
    if (originalVideoRef.current && recordedVideoRef.current) {
      originalVideoRef.current.currentTime = 0;
      recordedVideoRef.current.currentTime = 0;
    }
  };

  const togglePlay = () => {
    if (originalVideoRef.current && recordedVideoRef.current) {
      if (isPlaying) {
        originalVideoRef.current.pause();
        recordedVideoRef.current.pause();
      } else {
        const adjustedTime = currentTime % originalDuration;
        originalVideoRef.current.currentTime = adjustedTime;
        recordedVideoRef.current.currentTime = currentTime;

        void originalVideoRef.current.play();
        void recordedVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    if (originalVideoRef.current && recordedVideoRef.current) {
      originalVideoRef.current.currentTime = 0;
      recordedVideoRef.current.currentTime = 0;
      setCurrentTime(0);
      setCurrentLoop(0);
      if (isPlaying) {
        void originalVideoRef.current.play();
        void recordedVideoRef.current.play();
      }
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && originalVideoRef.current && recordedVideoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * totalDuration;
      const newLoop = Math.floor(newTime / originalDuration);
      const adjustedTime = newTime % originalDuration;

      console.log('Progress bar clicked:', {
        pos,
        newTime,
        newLoop,
        adjustedTime
      });

      setCurrentLoop(newLoop);
      originalVideoRef.current.currentTime = adjustedTime;
      recordedVideoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getVideoContainerStyle = () => {
    const aspectRatio = orientation === 'portrait' ? 1 / 1.414 : 1.414 / 1;
    return {
      aspectRatio,
      maxHeight: orientation === 'portrait' ? '70vh' : '50vh'
    };
  };

  const handleUpload = async () => {
    if (isUploading) return;

    if (!originalProjectData?.videoUrl) {
      console.error('원본 영상을 찾을 수 없습니다.');
      return;
    }

    try {
      const response = await fetch(blobUrl);
      const blobData = await response.blob();

      const file = new File([blobData], `recorded-video-${Date.now()}.mp4`, {
        type: 'video/mp4',
        lastModified: Date.now()
      });

      const videoUrl = await uploadVideo({ originalUrl: originalProjectData?.videoUrl, loopCnt: loopCnt, videoFile: file })
      console.log(videoUrl);
      
      setCreatedUrl(videoUrl);
      navigate('/fork/upload');
    } catch (error) {
      console.error('파일 변환 중 오류 발생:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center p-4 max-w-7xl mx-auto">
      <div className="w-full flex justify-between mb-4">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          다시 촬영하기
        </button>
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          {isUploading ? '업로드 중...' : '다음'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-4 justify-center w-full mb-4">
        {/* 원본 비디오 */}
        <div className="flex-1 max-w-xl">
          <div
            className="rounded-sm overflow-hidden"
            style={getVideoContainerStyle()}
          >
            <video
              ref={originalVideoRef}
              className="w-full h-full object-cover"
              playsInline
              preload="auto"
              loop={false}
            >
              <source src={originalProjectData?.videoUrl} type="video/mp4" />
            </video>
          </div>
          <div className="mt-2 text-center text-sm text-gray-600">원본 영상</div>
        </div>

        {/* 녹화된 비디오 */}
        <div className="flex-1 max-w-xl">
          <div
            className="rounded-sm overflow-hidden"
            style={getVideoContainerStyle()}
          >
            <video
              ref={recordedVideoRef}
              className="w-full h-full object-cover"
              onEnded={handleRecordedEnd}
              playsInline
              loop={false}
            >
              <source src={blobUrl} type="video/mp4" />
            </video>
          </div>
          <div className="mt-2 text-center text-sm text-gray-600">녹화된 영상</div>
        </div>
      </div>

      {/* 컨트롤 패널 */}
      <div className="w-full max-w-3xl">
        {/* 프로그레스 바 */}
        <div
          ref={progressBarRef}
          className="w-full h-2 bg-gray-200 rounded-full cursor-pointer mb-4"
          onClick={handleProgressBarClick}
        >
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${(currentTime / totalDuration) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {currentLoop + 1}회차 / 총 {loopCnt}회
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>

            <button
              onClick={togglePlay}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
          </div>

          <div className="text-sm text-gray-600">
            {Math.floor(currentTime)}초 / {Math.floor(totalDuration)}초
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForkEditor;