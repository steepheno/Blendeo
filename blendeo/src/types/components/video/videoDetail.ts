import { LucideIcon } from 'lucide-react';

export type TabType = SidePanelTabType | 'showTree' | null;
export type SidePanelTabType = 'comments' | 'contributors' | "settings" ;

export interface Comment {
  id: number;
  author: string;
  content: string;
  timeAgo: string;
  avatarUrl: string;
}

export interface InteractionButtonProps {
  icon: LucideIcon;
  count: string;
  label?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export interface SidePanelProps {
  activeTab: SidePanelTabType | null;
  content: React.ReactNode;
}

export interface VideoMetadata {
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    profileImage: string;
  };
  viewCnt : number;
}

export interface VideoPlayerProps {
  videoUrl: string;
  metadata: VideoMetadata;
  isPortrait?: boolean;
}