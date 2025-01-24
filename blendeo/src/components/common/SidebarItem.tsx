import * as React from 'react';
import { SidebarItemProps } from '../../types/types';

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive }) => {
  return (
    // 홈, 탐색, ... 버튼
    <div className={`flex gap-3 items-center px-3 py-2 w-full ${isActive ? 'bg-gray-100 rounded-3xl' : ''}`}>
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