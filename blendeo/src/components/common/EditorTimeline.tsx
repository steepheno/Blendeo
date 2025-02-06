import React, { useState } from 'react';

// 비디오/오디오 편집을 위한 타임라인 컴포넌트
const EditorTimeline = () => {
  const [cursorPosition, setCursorPosition] = useState(0);  // 현재 커서 위치 픽셀 단위로 저장하는 state
  
  // 마우스 이동 시 커서 위치를 업데이트하는 핸들러
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();  // 타임라인 요소의 위치, 크기 정보 가져오기
    const x = e.clientX - rect.left;  // 마우스의 x좌표 - 왼쪽 여백 = 상대적 위치
    const position = Math.max(0, Math.min(x, rect.width));  // 타임라인 영역 벗어나지 않도록 위치 제한
    setCursorPosition(position);
  };

  // 타임라인의 시간 표시 눈금 생성함수
  const timeMarkers = () => {
    const markers = [];
    // 0 ~ 180까지 10단위로 반복 (총 21개의 주요 마커 생성)
    for (let i = 0; i <= 180; i += 10) {
      const currentPosition = (i / 180) * 100;  // 현재 마커의 상대적 위치(퍼센트) 계산
      const nextPosition = ((i + 10) / 180) * 100;  // 다음 마커의 상대적 위치(퍼센트) 계산 
      const interval = (nextPosition - currentPosition) / 10;  // 작은 마커들 사이 간격 계산
      
      markers.push(
        <React.Fragment key={i}>
          {/* 10초 마커 (큰 눈금) */}
          <div className="absolute flex flex-col items-center" style={{ left: `${currentPosition}%` }}>
            <div className="h-5 w-px bg-white mt-2"></div>
          </div>
  
          {/* 1초 마커 (10초 마커 사이의 작은 눈금들) */}
          {i < 180 && Array.from({length: 9}).map((_, index) => (
            <div 
              key={`marker-${i}-${index}`} 
              className="absolute flex flex-col items-center" 
              style={{ left: `${currentPosition + interval * (index + 1)}%` }}
            >
              {/* 5초 마커(5번째)는 조금 더 길게 표시 */}
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
    // 전체 타임라인 컨테이너
    <div className="w-full h-16 bg-black relative" onMouseMove={handleMouseMove}>
      <div className="w-full h-full relative">
        {/* 시간 마커들 렌더링 */}
        {timeMarkers()}
        
        {/* 현재 커서 위치 표시선 */}
        <div 
          className="absolute top-0 bottom-0 w-px bg-[#6A02FA]" 
          style={{ left: `${cursorPosition}px` }}
        />
      </div>
    </div>
  );
};

export default EditorTimeline;