// src/components/videoCall/CallControl.tsx
import React from "react";
import {
  Camera,
  Mic,
  MonitorUp,
  MoreVertical,
  MessageSquare,
  PhoneOff,
} from "lucide-react";

interface CallControlProps {
  type: "audio" | "video" | "screen" | "more" | "chat" | "end";
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const CallControl: React.FC<CallControlProps> = ({
  type,
  isActive = false,
  onClick,
  disabled = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case "audio":
        return <Mic className="w-6 h-6" />;
      case "video":
        return <Camera className="w-6 h-6" />;
      case "screen":
        return <MonitorUp className="w-6 h-6" />;
      case "more":
        return <MoreVertical className="w-6 h-6" />;
      case "chat":
        return <MessageSquare className="w-6 h-6" />;
      case "end":
        return <PhoneOff className="w-6 h-6" />;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex justify-center items-center w-12 h-12 rounded-full transition-colors
        ${type === "end" ? "bg-red-500 hover:bg-red-600" : "bg-gray-200 hover:bg-gray-300"}
        ${isActive ? "bg-opacity-50" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {getIcon()}
    </button>
  );
};
