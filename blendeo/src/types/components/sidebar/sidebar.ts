// src/types/components/sidebar/sidebar.ts
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
