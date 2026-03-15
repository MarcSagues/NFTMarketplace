import { useState, useEffect } from "react";

const useVideoPlayer = (videoId) => {
  const [duration, setDuration] = useState();
  const [curTime, setCurTime] = useState();
  const [isMuted, setIsMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isFullScreen, setIsFullscreen] = useState();
  const [clickedTime, setClickedTime] = useState();

  const endedVideo = () => {
    setPlaying(false);
    setCurTime(0);
    setClickedTime(0);
  };

  useEffect(() => {
    const video = document.getElementById(videoId);
    // state setters wrappers
    const setAudioData = () => {
      setDuration(video.duration);
      setCurTime(video.currentTime);
    };

    const setAudioTime = () => setCurTime(video.currentTime);

    const setFullScreen = () => {
      if (document.fullscreenElement) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    };

    // DOM listeners: update React state on DOM events
    video.addEventListener("loadeddata", setAudioData);

    video.addEventListener("timeupdate", setAudioTime);

    video.addEventListener("ended", endedVideo);

    video.addEventListener("fullscreenchange", setFullScreen);
    video.addEventListener("webkitfullscreenchange", setFullScreen);

    video.addEventListener(
      "contextmenu",
      function (e) {
        e.preventDefault();
      },
      false
    );
    // React state listeners: update DOM on React state changes
    playing ? video.play() : video.pause();

    isMuted ? (video.muted = true) : (video.muted = false);

    if (clickedTime && clickedTime !== curTime) {
      video.currentTime = clickedTime;
      setClickedTime(null);
    }

    // effect cleanup
    return () => {
      video.removeEventListener("loadeddata", setAudioData);
      video.removeEventListener("timeupdate", setAudioTime);
      video.removeEventListener("fullscreenchange", setFullScreen);
      video.removeEventListener("ended", endedVideo);
      video.removeEventListener("webkitfullscreenchange", setFullScreen);
      video.removeEventListener(
        "contextmenu",
        function (e) {
          e.preventDefault();
        },
        false
      );
    };
  }, [clickedTime, curTime, isMuted, playing, videoId, isFullScreen]);

  return {
    curTime,
    duration,
    playing,
    isMuted,
    isFullScreen,
    setPlaying,
    setIsMuted,
    setClickedTime,
  };
};

export default useVideoPlayer;
