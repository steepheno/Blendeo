import * as React from "react";
import { SignupInputProps } from "../../types/types";

const SignupInput: React.FC<SignupInputProps> = ({
  type,
  placeholder,
  className,
  id,
  "aria-label": ariaLabel
}) => (
  <>
    <label htmlFor={id} className="sr-only">
      {ariaLabel}
    </label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className={className}
      aria-label={ariaLabel}
    />
  </>
);

export default SignupInput;