// Interaction Button Component
import { InteractionButtonProps } from "@/types/components/video/videoDetail";

const InteractionButton: React.FC<InteractionButtonProps> = ({
  icon: Icon,
  count,
  label,
  isActive,
  onClick,
}) => {
  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        className={`p-3 rounded-full transition-colors ${
          isActive ? "bg-purple-100" : "hover:bg-gray-100"
        }`}
        onClick={onClick}
        type="button"
      >
        <Icon
          className={`w-6 h-6 ${
            isActive ? "text-purple-600" : "text-gray-600"
          }`}
        />
      </button>
      <span className="text-sm text-gray-600">{count}</span>
      {label && <span className="text-xs text-gray-500">{label}</span>}
    </div>
  );
};

export default InteractionButton;
