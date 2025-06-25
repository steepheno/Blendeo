// src/hooks/useMediaPermissions.ts
import { useState, useEffect } from "react";

export const useMediaPermissions = () => {
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        setHasPermissions(true);
      } catch {
        setHasPermissions(false);
      }
    };

    checkPermissions();
  }, []);

  return hasPermissions;
};
