import { LucideIcon } from 'lucide-react';

export type TabType = 'comments' | 'contributors' | 'showTree' | null;

export interface Comment {
  id: number;
  author: string;
  content: string;
  timeAgo: string;
  avatarUrl: string;
}

export interface Contributor {
  id: number;
  name: string;
  role: string;
  collaborations: number;
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
  activeTab: TabType;
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