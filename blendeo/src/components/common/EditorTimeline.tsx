import React, { useState } from 'react';

const EditorTimeline = () => {
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = Math.max(0, Math.min(x, rect.width));
    setCursorPosition(position);
  };

  const generateTimeMarkers = () => {
    const markers = [];
    for (let i = 0; i <= 90; i += 10) {
      const currentPosition = (i/90)*100;
      const nextPosition = ((i+10)/90)*100;
      const interval = (nextPosition - currentPosition) / 10;
      
      markers.push(
        <React.Fragment key={i}>
          <div className="absolute flex flex-col items-center" style={{ left: `${currentPosition}%` }}>
            <div className="h-5 w-px bg-white mt-2"></div>
          </div>
          {i < 90 && Array.from({length: 9}).map((_, index) => (
            <div 
              key={`marker-${i}-${index}`} 
              className="absolute flex flex-col items-center" 
              style={{ left: `${currentPosition + interval * (index + 1)}%` }}
            >
              {(index + 1) === 5 ? (
                <div className="h-3 w-px bg-white mt-3.5" />
              ) : (
                <div className="h-2 w-px bg-white mt-4" />
              )}
            </div>
          ))}
        </React.Fragment>
      );
    }
    return markers;
  };

  return (
    <div className="w-full h-16 bg-black relative" onMouseMove={handleMouseMove}>
      <div className="w-full h-full relative">
        {generateTimeMarkers()}
        <div 
          className="absolute top-0 bottom-0 w-px bg-[#6A02FA]" 
          style={{ left: `${cursorPosition}px` }}
        />
      </div>
    </div>
  );
};

export default EditorTimeline;