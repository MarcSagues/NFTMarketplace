import React, { useContext } from "react";
import moment from "moment";
import useAudioPlayer from "../hooks/useAudioPlayer";
import { Icon } from "@iconify/react";
import momentDurationFormatSetup from "moment-duration-format";
import { ThemeContext } from "../context/ThemeContext";

export const AudioPlayer = ({ audioId, audio, imagePreview, openPreview }) => {
  const { curTime, duration, playing, setPlaying, setClickedTime } =
    useAudioPlayer(audioId);

  const { theme } = useContext(ThemeContext);

  const curPercentage = (curTime / duration) * 100;

  function calcClickedTime(e) {
    const clickPositionInPage = e.pageX;
    const bar = document.getElementById("bar__progress");
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

  const clickPreview = () => {
    setPlaying(false);
  };

  return (
    <>
      <div onClick={clickPreview}>{imagePreview}</div>
      <div className="w-full flex-col gap-4">
        <audio loop={false} id={audioId}>
          <source src={audio} />
          Your browser does not support the <code>audio</code> element.
        </audio>
        <div
          style={{
            background:
              theme === "dark"
                ? "rgba(255, 255, 255, 0.25)"
                : "rgba(91, 91, 91, 0.25)",
          }}
          className="flex items-center space-evenly py-3 gap-2 px-4 shadow-lg drop-shadow-xl backdrop-blur-lg rounded-lg"
        >
          <div className="flex w-full gap-2">
            {playing ? (
              <Icon
                width={32}
                icon="carbon:pause-outline-filled"
                onClick={() => setPlaying(false)}
              />
            ) : (
              <Icon
                width={32}
                icon="carbon:play-filled"
                onClick={() => setPlaying(true)}
              />
            )}
            <div className="flex items-center w-full gap-2">
              <div
                id="bar__progress"
                className="flex-1 h-[10px] bg-white flex items-center rounded-lg"
                style={{
                  background: `linear-gradient(to right, var(--primary) ${curPercentage}%, var(--progress) 0)`,
                }}
                onMouseDown={(e) => handleTimeDrag(e)}
              >
                <span
                  className="relative h-[16px] w-[16px] rounded-full border-[1.5px] border-white"
                  style={{
                    left: `${curPercentage - 1}%`,
                    backgroundColor: "var(--primary)",
                  }}
                ></span>
              </div>

              <span className="bar__time">
                {playing || curTime > 0
                  ? formatDuration(curTime)
                  : formatDuration(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
