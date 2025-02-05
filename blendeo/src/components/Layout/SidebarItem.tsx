import * as React from "react";
import { SidebarItemProps } from "@/types/components/sidebar/sidebar";
import { useNavigate } from "react-router-dom";

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label }) => {
  const navigate = useNavigate();

  const routing = () => {
    switch (label) {
      case "홈":
        navigate("/");
        break;
      
      case "촬영":
        navigate("/project/record");
        break;

      case "채팅":
        navigate("/chat");
        break;

      case "내 정보":
        navigate("/mypage");
        break;
    }
  };

  return (
    // 홈, 탐색, ..., 내 정보 버튼
    <div
      onClick={routing}
      className={`flex gap-3 items-center px-3 py-2 w-full hover:bg-gray-100 cursor-pointer hover:rounded-3xl`}
    >
      <div className="flex flex-col self-stretch my-auto w-6">
        <img
          loading="lazy"
          src={icon}
          alt=""
          className="object-contain flex-1 w-6 aspect-square"
        />
      </div>
      <div className="self-stretch my-auto text-sm font-medium whitespace-nowrap text-neutral-900">
        {label}
      </div>
    </div>
  );
};

export default SidebarItem;
