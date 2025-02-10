import React from 'react';

interface VideoGridProps {
  type: string;
  children: React.ReactNode;
}

const VideoGrid: React.FC<VideoGridProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-6">
      {children}
    </div>
  );
};

export default VideoGrid;