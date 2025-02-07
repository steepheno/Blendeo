import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause, Settings, Video, Image, Lock, Eye, Music, Mic, Speaker, ChevronDown, RotateCcw } from 'lucide-react';

interface Track {
  id: string;
  type: 'video' | 'audio';
  clips: Array<{
    id: string;
    start: number;
    duration: number;
  }>;
}

interface TrackToolsProps {
  type: 'video' | 'audio';
}

const TrackTools: React.FC<TrackToolsProps> = ({ type }) => {
  const videoTools = [
    { icon: <Video size={16} />, tooltip: 'Video' },
    { icon: <Image size={16} />, tooltip: 'Preview' },
    { icon: <Lock size={16} />, tooltip: 'Lock' },
    { icon: <Eye size={16} />, tooltip: 'Visibility' }
  ];

  const audioTools = [
    { icon: <Music size={16} />, tooltip: 'Audio' },
    { icon: <Volume2 size={16} />, tooltip: 'Volume' },
    { icon: <Mic size={16} />, tooltip: 'Record' },
    { icon: <Speaker size={16} />, tooltip: 'Output' }
  ];

  const tools = type === 'video' ? videoTools : audioTools;

  if(type === 'video'){
  return (
    <div className="flex gap-1 items-center bg-slate-1000 p-2 rounded-l w-32">
      {tools.map((tool, index) => (
        <button
          key={index}
          className="p-1 hover:bg-slate-700 rounded transition-colors"
          title={tool.tooltip}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
  }
  else {
    return (
      <div className="flex gap-1 items-center bg-slate-1000 p-2 rounded-l w-32">
        {tools.map((tool, index) => (
          <button
            key={index}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
            title={tool.tooltip}
          >
            {tool.icon}
          </button>
        ))}
      </div>
    );
  }
};

const TimelineTools: React.FC = () => {
  return (
    <div className="flex flex-col gap-7 mt-16 ml-4">
      <TrackTools type="video" />
      <TrackTools type="video" />
      <TrackTools type="audio" />
      <TrackTools type="audio" />
    </div>
  );
};

const ForkEditPage: React.FC = () => {
  const [videosLoaded, setVideosLoaded] = useState(0);
  const [volume, setVolume] = useState(100);
  const [speed, setSpeed] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [leftThumbnails, setLeftThumbnails] = useState<string[]>([]);
  const [rightThumbnails, setRightThumbnails] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const sourceVideoRef = useRef<HTMLVideoElement>(null);
  const targetVideoRef = useRef<HTMLVideoElement>(null);

  const videoUrl = "https://blendeo-s3-bucket.s3.ap-northeast-2.amazonaws.com/videos/merged_f827a2af-5e89-4970-909d-92db5f0be589.mp4";

  // ... (generateThumbnail 함수와 나머지 useEffect는 동일하게 유지)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const bounds = e.currentTarget.getBoundingClientRect();
    const position = (e.clientX - bounds.left) / bounds.width;
    const newTime = duration * Math.max(0, Math.min(1, position));
    
    if (sourceVideoRef.current && targetVideoRef.current) {
      sourceVideoRef.current.currentTime = newTime;
      targetVideoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const generateThumbnail = async (video: HTMLVideoElement, time: number): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const tempVideo = document.createElement('video');
        tempVideo.crossOrigin = "anonymous";
        tempVideo.src = videoUrl;
        
        tempVideo.onloadeddata = () => {
          tempVideo.currentTime = time;
        };
  
        tempVideo.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = 120;
            canvas.height = 67;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL();
            tempVideo.remove();
            resolve(dataUrl);
          } catch (error) {
            console.error("Canvas error:", error);
            reject(error);
          }
        };
  
        tempVideo.onerror = (e) => {
          console.error("Video error:", e);
          reject(e);
        };
  
        tempVideo.load();
      } catch (error) {
        console.error("Thumbnail error:", error);
        reject(error);
      }
    });
  };

  useEffect(() => {
    if (videosLoaded === 2 && duration > 0) {
      const generateThumbnails = async () => {
        
        const thumbnailCount = 12;
        const interval = duration / thumbnailCount;
        
        try {
          const leftThumbPromises = await Promise.all(
            Array.from({ length: thumbnailCount }, (_, i) => 
              generateThumbnail(sourceVideoRef.current!, i * interval)
            )
          );
          
          setLeftThumbnails(leftThumbPromises.filter(thumb => thumb !== ''));
          
          const rightThumbPromises = await Promise.all(
            Array.from({ length: thumbnailCount }, (_, i) => 
              generateThumbnail(targetVideoRef.current!, i * interval)
            )
          );
          
          setRightThumbnails(rightThumbPromises.filter(thumb => thumb !== ''));
        } catch (error) {
          console.error("Error:", error);
        }
      };

      generateThumbnails();
    }
  }, [videosLoaded, duration]);

  const handlePlayPause = () => {
    if (!sourceVideoRef.current || !targetVideoRef.current) return;

    if (isPlaying) {
      sourceVideoRef.current.pause();
      targetVideoRef.current.pause();
    } else {
      sourceVideoRef.current.play();
      targetVideoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    setCurrentTime(video.currentTime);
    
    if (Math.abs((sourceVideoRef.current?.currentTime || 0) - (targetVideoRef.current?.currentTime || 0)) > 0.1) {
      if (sourceVideoRef.current && targetVideoRef.current) {
        targetVideoRef.current.currentTime = sourceVideoRef.current.currentTime;
      }
    }
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    setDuration(video.duration);
  };

  const playheadPosition = `${(currentTime / duration) * 99}%`;

  const VolumeSpeedControl: React.FC<{
    label: string;
    value: number;
    max: number;
    onChange: (value: number) => void;
    onReset: () => void;
   }> = ({ label, value, max, onChange, onReset }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-1">
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            className="accent-purple-600" 
            defaultChecked 
            style={{ transform: "scale(1)" }}
          />
          <span className="text-sm text-slate-300">{label}</span>
        </label>
        <button onClick={onReset} className="p-1 hover:bg-slate-700 rounded-full">
          <RotateCcw size={14} className="text-slate-400" />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <input 
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full custom-range"
        />
        <div className="flex items-center gap-1">
          <span className="text-sm text-slate-300">{value}%</span>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
    </div>
   );

  return (
    <div className="flex flex-col h-screen bg-custom-dark text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-2.5 border-b border-slate-700">
        <div className="flex items-center space-x-4">
          <button onClick={handlePlayPause}>
            {isPlaying ? <Pause className="w-6 h-4" /> : <Play className="w-6 h-4" />}
          </button>
          <span>jjanggu project</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-3 py-1.5 bg-purple-600 rounded-2xl">Export</button>
          <Settings className="w-6 h-6" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col h-full">
        {/* Top Section with Controls and Video */}
        <div className="flex" style={{ height: "23rem" }}>
          {/* Center Video Preview */}
          <div className="flex-1">
            <div className="p-3">
              <div className="grid grid-cols-2 gap-4">
                {/* Source Video */}
                <div className="bg-slate-950 rounded-lg p-2">
                  <video 
                    ref={sourceVideoRef}
                    className="w-full aspect-video rounded"
                    src={videoUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onLoadedData={() => setVideosLoaded(prev => prev + 1)}
                  />
                </div>
                {/* Target Video */}
                <div className="bg-slate-950 rounded-lg p-2">
                  <video 
                    ref={targetVideoRef}
                    className="w-full aspect-video rounded"
                    src={videoUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onLoadedData={() => setVideosLoaded(prev => prev + 1)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="w-72 border-l border-slate-900 p-4">
          <VolumeSpeedControl 
            label="Volume"
            value={volume}
            max={100}
            onChange={setVolume}
            onReset={() => setVolume(100)}
          />
          <VolumeSpeedControl 
            label="Speed"
            value={speed}
            max={200}
            onChange={(newSpeed) => {
              setSpeed(newSpeed);
              if (sourceVideoRef.current && targetVideoRef.current) {
                sourceVideoRef.current.playbackRate = newSpeed / 100;
                targetVideoRef.current.playbackRate = newSpeed / 100;
              }
            }}
            onReset={() => setSpeed(100)}
          />
          </div>
        </div>

        {/* Timeline Section */}
        <div className="flex">
          <TimelineTools />
          <div className="flex-1 p-4 relative cursor-pointer"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            >
            <div 
              className="absolute top-0 bottom-0 z-10 p-4"
              style={{ 
                left: playheadPosition,
                pointerEvents: 'none'
              }}
            >
              <div className="w-0.5 h-full bg-purple-600"></div>
              <div className="absolute -top-0 -ml-1 bg-purple-600 p-1.5 transform rotate-0"></div>
            </div>

            <div 
              className="absolute top-0 bottom-0 left-0 right-0"
            />
            
            <div className="relative h-full">
              <div className="relative mb-2">
                <div className="flex justify-between text-sm text-slate-400">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const seconds = (i * duration / 10) || 0;
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = Math.floor(seconds % 60);
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div className="h-3 w-px bg-slate-600 mb-1"></div>
                        <span>
                          {`${minutes}:${remainingSeconds.toString().padStart(2, '0')}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="absolute top-0 w-full flex justify-between">
                  {Array.from({ length: 200 }).map((_, i) => (
                    <div key={i} className="h-1.5 w-px bg-slate-700"></div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {/* Video Tracks */}
                <div className="h-16 bg-slate-950 rounded relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-full flex">
                    {leftThumbnails.map((thumbnail, index) => (
                      <div
                        key={index}
                        className="h-full flex-1"
                        style={{
                          backgroundImage: `url(${thumbnail})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="h-16 bg-slate-950 rounded relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-full flex">
                    {rightThumbnails.map((thumbnail, index) => (
                      <div
                        key={index}
                        className="h-full flex-1"
                        style={{
                          backgroundImage: `url(${thumbnail})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Audio Tracks */}
                <div className="h-12 bg-slate-950 rounded relative">
                  <div className="absolute left-0 top-0 h-full w-full flex items-center px-4">
                    <div className="h-12 w-full bg-slate-950 rounded">
                      <div className="h-full w-full flex items-center">
                        {Array.from({ length: 320 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-8 w-0.5 bg-purple-600 mx-px rounded-full"
                            style={{ height: `${Math.random() * 100}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-12 bg-slate-950 rounded relative">
                  <div className="absolute left-0 top-0 h-full w-full flex items-center px-4">
                    <div className="h-12 w-full bg-purple-1000 rounded">
                      <div className="h-full w-full flex items-center">
                        {Array.from({ length: 320 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-8 w-0.5 bg-purple-600 mx-px rounded-full"
                            style={{ height: `${Math.random() * 100}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForkEditPage;