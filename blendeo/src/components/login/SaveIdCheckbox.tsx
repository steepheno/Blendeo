import { useState } from "react";

interface SaveIdCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function SaveIdCheckbox({ checked = false, onChange }: SaveIdCheckboxProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.(newChecked);
  };

  return (
    <div className="flex gap-2.5 justify-center items-center my-auto">
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          id="saveIdCheckbox"
          checked={isChecked}
          onChange={handleToggle}
          className="absolute opacity-0 w-0 h-0"
        />
        <div className="flex flex-col justify-center items-center my-auto w-[26px]">
          <img
            loading="lazy"
            src={"https://cdn.builder.io/api/v1/image/assets/TEMP/4c9db61ee51e75840e759d1d73afcc14f2ec2e871a0fc4fa1e9411a6af5c0081"}
            alt="checkbox"
            className="object-contain aspect-square rounded-[100px] w-[18px]"
          />
        </div>
        <span className="self-stretch my-auto text-lg text-gray-500">
          아이디 저장
        </span>
      </label>
    </div>
  );
}

export default SaveIdCheckbox;