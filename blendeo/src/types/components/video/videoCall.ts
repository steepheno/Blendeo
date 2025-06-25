export interface ParticipantData {
    id: string;
    name: string;
    imageUrl: string;
  }
  
  export interface CallControlProps {
    icon: string;
    alt: string;
    isActive?: boolean;
    onClick?: () => void;
  }