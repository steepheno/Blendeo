import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Square } from 'lucide-react';
import useForkVideoStore from '@/stores/forkVideoStore';
import { RecordingTimer } from "@/components/record/RecordingTimer";
import { RecordingController } from "@/components/record/RecordingController"

type Orientation = 'portrait' | 'landscape';

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

const ForkVideoRecorder: React.FC<ForkVideoRecorderProps> = ({ videoUrl, repeatCount }) => {
  const navigate = useNavigate();
  const { setRecordedData } = useForkVideoStore();
  const [isRecording, setIsRecording] = useState(false);
  const [currentLoop, setCurrentLoop] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalOrientation, setOriginalOrientation] = useState<Orientation>('portrait');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const previewRef = useRef<HTMLVideoElement>(null);

  const [timer, setTimer] = useState(0)


  // 원본 비디오의 방향 감지
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleMetadata = () => {
        const orientation = video.videoWidth > video.videoHeight ? 'landscape' : 'portrait';
        setOriginalOrientation(orientation);
      };

      video.addEventListener('loadedmetadata', handleMetadata);
      return () => video.removeEventListener('loadedmetadata', handleMetadata);
    }
  }, []);

  // 비디오 녹화 설정
  const setupRecording = useCallback ( async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: DIMENSIONS[originalOrientation].width },
          height: { ideal: DIMENSIONS[originalOrientation].height }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      streamRef.current = stream;
      if (previewRef.current) {
        previewRef.current.srcObject = stream;
      }
      
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2'
      });

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { 
          type: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2' 
        });

        const file = new File([blob], "recorded-video.mp4", { type: blob.type });
        const blobUrl = URL.createObjectURL(file);

        const video = document.createElement('video');
        video.src = blobUrl;
        video.load();

        const duration = await new Promise<number>((resolve) => {
          video.addEventListener('loadedmetadata', () => {
            if (video.duration === Infinity) {
              video.currentTime = Number.MAX_SAFE_INTEGER;
              video.addEventListener('seeked', () => {
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
          duration
        });

        navigate('/fork/edit');
      };

      mediaRecorderRef.current = mediaRecorder;
      setError(null);
    } catch (err) {
      setError('카메라를 시작할 수 없습니다. 카메라 권한을 확인해주세요.');
      console.error('카메라 접근 에러:', err);
    }
  },  [originalOrientation, navigate, setRecordedData]);

  // 컴포넌트 마운트 시 설정
  useEffect(() => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setError('이 브라우저는 비디오 녹화를 지원하지 않습니다.');
      return;
    }
  
    void setupRecording();
  
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [setupRecording]); // originalOrientation이 변경되면 녹화 설정을 다시 함

  // 비디오 재생 종료 처리
  const handleVideoEnd = () => {
    if (currentLoop < repeatCount - 1) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        void videoRef.current.play();
      }
      setCurrentLoop(prev => prev + 1);
    } else {
      setIsPlaying(false);
      setCurrentLoop(0);
      if (isRecording) {
        stopRecording();
      }
    }
  };


  // 동기화된 재생 및 녹화 시작
  const startSyncedRecording = () => {
    if (!isPlaying && videoRef.current) {
      setIsPlaying(true);
      setIsRecording(true);
      videoRef.current.currentTime = 0;
      
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.start(1000);
      }
      
      void videoRef.current.play();
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
      height: dimensions.height
    };
  };

  return (
    <div className={`flex gap-2 items-start justify-center p-4 ${originalOrientation === 'landscape' ? 'flex-row' : 'flex-row'}`}>
      {/* 원본 비디오 플레이어 */}
      <div className="flex flex-col items-center space-y-4 relative">
        <div 
          className="bg-black overflow-hidden"
          style={getVideoContainerStyle()}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            onEnded={handleVideoEnd}
            preload="auto"
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="absolute top-0 left-0 w-full h-full"> {/* 오버레이 컨테이너 추가 */}
            <RecordingTimer 
              isRecording={isRecording} 
              timer={timer} 
            />
            <RecordingController 
              isRecording={isRecording} 
              onTimerChange={setTimer} 
            />
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          현재 {currentLoop + 1}번째 재생 중 / 총 {repeatCount}회
        </div>
        
      </div>

      {/* 녹화 미리보기 */}
      <div className="flex flex-col items-center space-y-4">
        {error && (
          <div className="w-full p-4 mb-4 text-red-700 bg-red-100 rounded-sm">
            {error}
          </div>
        )}

        <div 
          className="bg-black overflow-hidden"
          style={getVideoContainerStyle()}
        >
          <video
            ref={previewRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        <button
          onClick={startSyncedRecording}
          disabled={isRecording || isPlaying}
          className="flex items-center gap-2 px-4 py-2 bg-main_100 text-white rounded-lg hover:bg-main_200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRecording ? (
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