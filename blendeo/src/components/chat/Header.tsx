import * as React from 'react';
import { ChatHeaderProps } from '../../types/types';
import { ChevronLeft, Video, MoreVertical } from 'lucide-react';

interface ExtendedChatHeaderProps extends ChatHeaderProps {
  avatar?: string;
  isOnline?: boolean;
}

export const Header: React.FC<ExtendedChatHeaderProps> = ({
    title,
    avatar,
    isOnline,
    onBack,
    onVideo,
    onMenu
  }) => {
    return (
      <header className="flex justify-between items-center p-4 w-full border-b border-solid border-b-gray-100 border-b-opacity-50 max-sm:p-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center text-gray-700 hover:bg-gray-100 p-2 rounded-full w-10 h-10"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          {avatar && (
            <div className="relative">
              <img 
                src={avatar} 
                alt={`${title}'s avatar`}
                className="w-10 h-10 rounded-full object-cover"
              />
              {isOnline !== undefined && (
                <div 
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white
                    ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
                />
              )}
            </div>
          )}
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
  
        <div className="flex gap-3 items-center">
          <button 
            onClick={onVideo} 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-700 w-10 h-10 flex items-center justify-center"
            aria-label="Start video call"
          >
            <Video className="w-5 h-5" />
          </button>
          <button 
            onClick={onMenu} 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-700 w-10 h-10 flex items-center justify-center"
            aria-label="Open menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>
    );
  };