import * as React from 'react';
import { SocialLoginButtonProps } from '../../types/types';

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  icon,
  text,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col justify-center px-36 py-4 w-full text-sm font-medium tracking-wide rounded-md border border-gray-200 border-solid max-md:px-5 max-md:max-w-full"
    >
      <div className="flex gap-4 items-center">
        <img
          loading="lazy"
          src={icon}
          alt=""
          className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
        />
        <span className="self-stretch my-auto">{text}</span>
      </div>
    </button>
  );
};