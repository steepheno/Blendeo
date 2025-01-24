export interface MusicCardProps {
  imageUrl: string;
  title: string;
  timeAgo: string;
  views: string;
}

export interface SidebarItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
}

export interface GenreTagProps {
  label: string;
  width: string;
}

export interface SubscriptionItemProps {
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

export interface NavigationItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
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