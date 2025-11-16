import React, { useState, useRef, useEffect } from 'react';
import { FiVolume2, FiVolumeX } from "react-icons/fi";

const VideoPlayer = ({ media }) => {
  const videoRef = useRef(null);
  const [mute, setMute] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = mute;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => console.warn("Autoplay blocked:", err));
      }
    }
  }, [mute]);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

   useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const video = videoRef.current;
          if (video) {
            if (entry.isIntersecting) {
              video.play();
              setIsPlaying(true);
            } else {
              video.pause();
              setIsPlaying(false);
            }
          }
        },
        { threshold: 0.6 }
      );
  
      if (videoRef.current) observer.observe(videoRef.current);
  
      return () => {
        if (videoRef.current) observer.unobserve(videoRef.current);
      };
    }, []);

  const toggleMute = (e) => {
    e.stopPropagation(); // prevent pausing when clicking mute icon
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMute(video.muted);
  };

  return (
    <div className="h-full relative cursor-pointer max-w-full rounded-2xl overflow-hidden">
      <video
        ref={videoRef}
        src={media}
        autoPlay
        loop
        muted={mute}
        playsInline
        className="h-full w-full object-cover rounded-2xl"
        onClick={handleVideoClick}
      />

      <div
        className="absolute bottom-[10px] right-[10px] bg-black/50 p-2 rounded-full hover:bg-black/70 transition-all"
        onClick={toggleMute}
      >
        {mute ? (
          <FiVolumeX className="w-[20px] h-[20px] text-white" />
        ) : (
          <FiVolume2 className="w-[20px] h-[20px] text-white" />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
