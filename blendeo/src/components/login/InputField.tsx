import * as React from 'react';
import { InputFieldProps } from '../../types/types';

const InputField: React.FC<InputFieldProps> = ({
  id,
  type,
  placeholder,
  value,
  onChange
}) => {
  return (
    <div className="flex shrink-0 mt-4 rounded-md border border-gray-200 border-solid h-[72px] max-md:max-w-full">
      <label htmlFor={id} className="sr-only">{placeholder}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-full px-4 rounded-md"
        aria-label={placeholder}
      />
    </div>
  );
};

export default InputField;