import { useState, useRef, useEffect } from 'react';

const VideoEditBar = () => {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef(null);
  const containerRef = useRef(null);

  const calculatePosition = (clientX) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const barWidth = rect.width;
      const offsetX = clientX - rect.left;
      
      // 위치를 0과 1 사이의 값으로 정규화
      let newPosition = Math.max(0, Math.min(1, offsetX / barWidth));
      return newPosition;
    }
    return 0;
  };

  const handleClick = (e) => {
    const newPosition = calculatePosition(e.clientX);
    setPosition(newPosition);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const newPosition = calculatePosition(e.clientX);
    setPosition(newPosition);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newPosition = calculatePosition(e.clientX);
      setPosition(newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div ref={containerRef} className="flex flex-1 my-auto relative w-full">
      <div
        ref={progressBarRef}
        className="flex-1 my-auto border-2 border-purple-500 border-solid h-3 cursor-pointer relative overflow-hidden"
        onClick={handleClick}
      >
        {/* 진행률 표시 막대 */}
        <div 
          className="absolute top-0 left-0 h-full bg-purple-500"
          style={{ width: `${position * 100}%` }}
        />
      </div>
      <div
        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full cursor-pointer"
        style={{ left: `${position * 100}%` }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default VideoEditBar;