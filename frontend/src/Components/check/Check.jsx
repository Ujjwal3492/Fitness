import { useRef, useEffect } from "react";

export const Check = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  return (
    <video ref={videoRef} autoPlay muted>
      <source src="/mainVideo.mp4" type="video/mp4" />
    </video>
  );
};
