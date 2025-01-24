/* Navigation 바 */
export interface NavigationItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
}

/* 사이드바 */
export interface SidebarItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
}

export interface SubscriptionItemProps {
  imageUrl: string;
  title: string;
  timeAgo: string;
  views: string;
}

/* 메인 */
export interface GenreTagProps {
  label: string;
  width: string;
}

export interface MusicCardProps {
  imageUrl: string;
  title: string;
  timeAgo: string;
  views: string;
}

/* 채팅 */
export interface UserProps {
  name: string;
  message?: string;
  isOnline?: boolean;
  imageUrl: string;
}

export interface ChatSearchBarProps {
  placeholder: string;
  iconSrc: string;
}

/* 로그인 */
export interface SocialLoginButtonProps {
  icon: string;
  text: string;
  onClick?: () => void;
}

export interface InputFieldProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/* 촬영 */
export interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

export interface PlaybackControlProps {
  currentTime: string;
  duration: string;
  progress: number;
}

export interface ControlButtonProps {
  src: string;
  alt: string;
  onClick: () => void;
}