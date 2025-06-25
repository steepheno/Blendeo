// src/types/components/main/musicCard.ts
export interface MusicCardProps {
  imageUrl: string;
  title: string;
  timeAgo: string;
  views: string;
  onClick?: () => void;
}
