import React from "react";
import { AudioPlayer } from "../AudioPlayer";
import { VideoPlayer } from "../VideoPlayer";
import { BigModal } from "./BigModal";

export default function SeeImageInDetailModal({
  showModal,
  image,
  handleCloseModal,
  contentType,
  tokenInfo,
}) {
  return (
    <BigModal showModal={showModal} handleCloseModal={handleCloseModal}>
      <div className="my-2 h-80vh mx-3 md:mx-8 flex flex-col gap-10">
        {contentType === "VIDEO" && (
          <VideoPlayer video={tokenInfo.video} videoId="Large-video" />
        )}
        {contentType === "AUDIO" && (
          <div className="flex flex-col gap-2">
            <img src={image} className="w-full object-contain" alt="extended" />
            <AudioPlayer audio={tokenInfo.audio} audioId="Large-audio" />
          </div>
        )}
        {contentType === "IMG" && (
          <img src={image} className="w-full object-contain" alt="extended" />
        )}
      </div>
    </BigModal>
  );
}
