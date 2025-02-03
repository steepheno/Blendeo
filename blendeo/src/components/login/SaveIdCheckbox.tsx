// src/components/login/SaveIdCheckbox.tsx
import { useState, useEffect } from "react";

interface SaveIdCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function SaveIdCheckbox({ checked = false, onChange }: SaveIdCheckboxProps) {
  const [isChecked, setIsChecked] = useState(checked);

  // 컴포넌트 마운트 시 localStorage에서 저장된 상태 확인
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setIsChecked(true);
      onChange(true);
    }
  }, [onChange]);

  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);

    // 체크박스 상태에 따라 localStorage 업데이트
    if (!newChecked) {
      localStorage.removeItem("savedEmail");
    }

    onChange?.(newChecked);
  };

  return (
    <div className="flex gap-2.5 justify-center items-center my-auto">
      <label className="flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          id="saveIdCheckbox"
          checked={isChecked}
          onChange={handleToggle}
          className="absolute opacity-0 w-0 h-0"
        />
        <div
          className={`
          flex justify-center items-center
          w-[18px] h-[18px] mr-2
          border-2 rounded
          transition-colors duration-200
          ${
            isChecked
              ? "bg-violet-700 border-violet-700"
              : "bg-white border-gray-300"
          }
        `}
        >
          {/* 체크 마크 */}
          {isChecked && (
            <svg
              className="w-3 h-3 text-white"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span className="text-base text-gray-600">아이디 저장</span>
      </label>
    </div>
  );
}

export default SaveIdCheckbox;
