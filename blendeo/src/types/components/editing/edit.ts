export interface SliderControlProps {
  label: string;
  sublabel?: string;
  value: number;
  onChange: (value: number) => void;
}

export interface PresetControlProps {
  label: string;
  sublabel: string;
  value: string;
  options?: string[];
  onChange: (value: string) => void;
}

export interface AudioControlData {
  id: string;
  type: 'slider' | 'preset';
  label: string;
  sublabel?: string;
  value: number | string;
  options?: string[];
}