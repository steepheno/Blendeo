import { LucideIcon } from "lucide-react";

interface InteractionButtonProps {
  icon: LucideIcon;
  count?: string;
  label?: string;
  isActive?: boolean;
  size?: number;
  iconColor? : string;
  fill? : string;
  disabled?: boolean;
  onClick: () => void;
}

function InteractionButton({
  icon: Icon,
  count,
  label,
  isActive,
  onClick,
  iconColor,
  fill = 'none',
  size = 6,  // 기본값 설정
}: InteractionButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center p-1">
        <button
          className={`pt-2 pb-1 rounded-full transition-colors ${
            isActive ? "bg-purple-100" : "hover:bg-gray-100"
          }`}
          onClick={onClick}
          type="button"
        >
          <Icon
            size={size * 4}  // Lucide 아이콘은 픽셀 단위를 사용하므로 4를 곱해 적절한 크기로 조정
            className={isActive ? "text-purple-600" : "text-gray-600"}
            color={iconColor}
            fill={fill}
          />
        </button>
        {count && <span className="text-sm text-gray-600">{count}</span>}
        {label && <span className="text-xs text-gray-500">{label}</span>}
      </div>
    </div>
  );
}

export default InteractionButton;