import { Icon } from "@iconify/react";
import React, { useContext, useState } from "react";
import moment from "moment";
import useVideoPlayer from "../hooks/useVideoPlayer";
import momentDurationFormatSetup from "moment-duration-format";
import { ThemeContext } from "../context/ThemeContext";

import { isMobile, isTablet } from "react-device-detect";

export const VideoPlayer = ({
  videoId,
  video,
  caption,
  isInput,
  onClickVideo,
}) => {
  const {
    curTime,
    duration,
    playing,
    isMuted,
    isFullScreen,
    setPlaying,
    setIsMuted,
    setClickedTime,
  } = useVideoPlayer(videoId);

  const { theme } = useContext(ThemeContext);

  const curPercentage = (curTime / duration) * 100;

  const [displayControl, setDisplayControl] = useState(true);

  function calcClickedTime(e) {
    const clickPositionInPage = e.pageX;
    const bar = document.getElementById(videoId);
    const barStart = bar.getBoundingClientRect().left + window.scrollX;
    const barWidth = bar.offsetWidth;
    const clickPositionInBar = clickPositionInPage - barStart;
    const timePerPixel = duration / barWidth;
    return timePerPixel * clickPositionInBar;
  }

  function handleTimeDrag(e) {
    setClickedTime(calcClickedTime(e));

    const updateTimeOnMove = (eMove) => {
      setClickedTime(calcClickedTime(eMove));
    };

    document.addEventListener("mousemove", updateTimeOnMove);

    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", updateTimeOnMove);
    });
  }

  function formatDuration(duration) {
    return moment.duration(duration, "seconds").format("mm:ss", {
      trim: false,
    });
  }

  const setFullScreen = () => {
    const el = document.getElementById(videoId);
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  };

  const handleClickVideo = () => {
    onClickVideo();
  };

  const handleOnTouch = () => {
    if (isMobile || isTablet) {
      setDisplayControl(!displayControl);
    }
  };

  return (
    <>
      <div
        className="flex flex-col gap-4 h-full justify-evenly "
        onMouseLeave={() => playing && setDisplayControl(false)}
        onMouseEnter={() => setDisplayControl(true)}
      >
        <div className="" onClick={() => onClickVideo && handleClickVideo()}>
          {caption && (
            <img
              src={caption}
              className={`${
                playing || curTime > 0 ? "hidden" : "flex"
              } w-[450px] max-h-[400px]  object-contain`}
            />
          )}
          <video
            onContextMenu={() => false}
            controlsList="nodownload"
            id={videoId}
            controls={isFullScreen}
            onPlay={(e) => isFullScreen && setPlaying(true)}
            //onPause={(e) => isFullScreen && setPlaying(false)}
            height="200"
            width="450"
            className={`video-js vjs-big-play-centered ${
              !caption || playing || curTime > 0 ? "flex" : "hidden"
            } w-[450px] max-h-[400px]  object-contain`}
          >
            <source src={video} />
            Your browser does not support the <code>video</code> element
          </video>
        </div>
        <div
          className={`flex justify-center w-[275px] h-[200px]  md:w-[375px]   gap-4 absolute`}
          onClick={handleOnTouch}
        >
          <div
            className={`m-auto ${displayControl ? "opacity-100" : "opacity-0"}`}
          >
            {playing ? (
              <button onClick={() => setPlaying(false)}>
                <Icon width={64} icon="carbon:pause-outline-filled" />
              </button>
            ) : (
              <button onClick={() => setPlaying(true)}>
                <Icon width={64} icon="carbon:play-filled" />
              </button>
            )}
          </div>
          <button
            className={`absolute bottom-0 right-7 ${
              displayControl ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setFullScreen(true)}
          >
            <Icon width={20} icon="mingcute:fullscreen-2-line" />
          </button>
        </div>
      </div>
    </>
  );
};
