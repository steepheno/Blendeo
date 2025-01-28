import * as React from "react";
import SaveIdCheckbox from "./SaveIdCheckbox";
import ForgotPassword from "./ForgotPassword";

export function LoginOptions() {
  const [saveId, setSaveId] = React.useState(false);

  const handleForgotPassword = () => {
    // Handle forgot password click
  };

  return (
    <div className="flex flex-wrap gap-10 justify-between items-center mt-2.5 w-full max-md:max-w-full">
      <SaveIdCheckbox checked={saveId} onChange={setSaveId} />
      <ForgotPassword onClick={handleForgotPassword} />
    </div>
  );
}