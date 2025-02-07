import * as React from 'react';
import { SliderControl } from './SliderControl';
import PresetControl from './PresetControl';
import { AudioControlData } from '../../types/components/editing/edit';

const audioControl: AudioControlData[] = [
  {
    id: 'volume',
    type: 'slider',
    label: 'Volume',
    sublabel: '',
    value: 100
  },
  {
    id: 'speed',
    type: 'slider',
    label: 'Speed',
    sublabel: '',
    value: 100
  },
  {
    id: 'loop',
    type: 'preset',
    label: 'Loop',
    sublabel: '',
    value: 'Variable'
  },
];

const Checkbox: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <div 
    className={`flex items-center justify-center w-4 h-4 border border-purple-500 rounded cursor-pointer ${
      checked ? 'bg-purple-500' : ''
    }`}
    onClick={onChange}
  >
    {checked && (
      // Unicode 체크 표시 사용
      <span className="text-xs text-black">✓</span>      
    )}
  </div>
);

interface AudioControlProps {
  onAudioControlChange?: (id: string, value: number | string) => void;
  initialVolume?: number;
}

const AudioControl: React.FC<AudioControlProps> = ({ onAudioControlChange, initialVolume = 0.5 }) => {
  const [controls, setControls] = React.useState<AudioControlData[]>([
    {
      id: 'volume',
      type: 'slider',
      label: 'Volume',
      sublabel: '',
      value: initialVolume * 200  // 0-1 값을 0-200으로 변환
    },
    {
      id: 'speed',
      type: 'slider',
      label: 'Speed',
      sublabel: '',
      value: 100
    },
    {
      id: 'loop',
      type: 'preset',
      label: 'Loop',
      sublabel: '',
      value: 'Variable'
    },
  ]);
  
  const [checkedStates, setCheckedStates] = React.useState<{ [key: string]: boolean }>({
    volume: true,
    speed: true,
    loop: true,
    noiseCancellation: true
  });

  const handleChange = (id: string, value: number | string) => {
    setControls(prevControls =>
      prevControls.map(control =>
        control.id === id ? {...control, value} : control
      )
    );

    if (onAudioControlChange) {
      if (id === 'volume') {
        onAudioControlChange(id, Number(value) / 200);
      } else {
        onAudioControlChange(id, value);
      }
    }
  };

  const handleCheckboxChange = (id: string) => {
    setCheckedStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderControl = (control: AudioControlData) => {
    const isSlider = control.type === "slider";
    const needsCheckbox = control.id === "volume" || control.id === "speed" || control.id === "loop";
  
    return (
      <div key={control.id} className="mt-6">
        <div className="flex gap-10 justify-between items-start w-full text-lg font-medium tracking-tight text-white max-w-[452px] min-h-[20px]">
          <div className="flex flex-col gap-1.5 self-stretch min-w-[240px]">
            {needsCheckbox && (
              <div 
                className="flex flex-col items-start gap-1 cursor-pointer" 
                onClick={() => handleCheckboxChange(control.id)}
              >
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={checkedStates[control.id]} 
                    onChange={() => handleCheckboxChange(control.id)}
                  />
                  <span>{control.label}</span>
                </div>
                <span className="text-sm text-gray-400">{control.sublabel}</span>
              </div>
            )}
            {isSlider ? (
              <SliderControl
                label={needsCheckbox ? '' : control.label}
                sublabel={needsCheckbox ? '' : control.sublabel}
                value={control.value as number}
                onChange={(value) => handleChange(control.id, value)}
              />
            ) : (
              <PresetControl
                label={control.label ? '' : control.label}
                sublabel={control.sublabel}
                value={control.value as string}
                onChange={(value) => handleChange(control.id, value)}
              />
            )}
          </div>
          <div className="flex shrink-0 self-stretch my-auto h-[18px] w-[18px]" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex overflow-hidden flex-wrap gap-4 px-5 pt-12 pb-3.5 rounded-xl bg-stone-950 max-md:px-5 w-[400px]">
      <div className="flex z-10 flex-col mt-0 w-full max-md:max-w-full">
        {audioControl.map(renderControl)}
        <div className="flex gap-10 justify-between items-center mt-6 w-full text-lg font-medium tracking-tight text-white max-w-[452px] min-h-[20px]">
          <div className="flex gap-1.5 items-center self-stretch my-auto min-w-[240px]">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleCheckboxChange("noiseCancellation")}
            >
              <Checkbox 
                checked={checkedStates.noiseCancellation}
                onChange={() => handleCheckboxChange('noiseCancellation')}
              />
              <div className="self-stretch my-auto w-[263px]">Noise Cancellation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioControl;