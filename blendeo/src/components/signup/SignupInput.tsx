import * as React from "react";
import { SignupInputProps } from "../../types/types";

const SignupInput: React.FC<SignupInputProps> = ({
  type,
  placeholder,
  className,
  id,
  "aria-label": ariaLabel,
  value,
  onChange
}) => (
  <>
    <label htmlFor={id} className="sr-only">
      {ariaLabel}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className={className}
      id={id}
      aria-label={ariaLabel}
      value={value}
      onChange={onChange}
    />
  </>
);

export default SignupInput;