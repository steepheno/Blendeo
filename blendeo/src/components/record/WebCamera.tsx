import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const WebCamera = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capturePhoto = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const retakePhoto = () => {
    setImgSrc(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {imgSrc ? (
        <img 
          src={imgSrc} 
          alt="webcam" 
          className="max-w-full h-[540px] object-cover rounded-xl"
        />
      ) : (
        <Webcam
          height={540}
          width={307}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 307,
            height: 540,
            facingMode: "user"
          }}
          className="rounded-xl"
        />
      )}
      <div className="mt-4">
        {imgSrc ? (
          <button 
            onClick={retakePhoto}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            다시 찍기
          </button>
        ) : (
          <button 
            onClick={capturePhoto}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            사진 찍기
          </button>
        )}
      </div>
    </div>
  );
};

export default WebCamera;