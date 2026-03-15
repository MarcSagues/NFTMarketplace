import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/StateProvider";
import fibboLogo from "../../assets/logoNavbarSmall.png";
import { VideoPlayer } from "../VideoPlayer";
import captureVideoFrame from "capture-video-frame";

export const VideoInput = ({
  fileSelected,
  frameSelected,
  setFrameSelected,
  required,
  info,
  label,
  inputId,
  imageError,
  imageMessageError,
  onFileSelected,
  backgroundImage,
  className,
  setFileSelected,
  icon,
  contentType,
}) => {
  const [loadingImage, setLoadingImage] = useState(false);
  const selectVideo = () => {
    setFileSelected(null);
    const inputRef = document.getElementById(inputId);
    inputRef.click();
  };

  const selectFrame = async () => {
    const frame = captureVideoFrame("inputVideo", "png");
    console.log(frame);
    await setFrameSelected(frame.dataUri);
  };

  const [{ literals }] = useStateContext();
  const handleOnFileSelected = async (e) => {
    setLoadingImage(true);
    await onFileSelected(e);
    setLoadingImage(false);
  };

  useEffect(() => {
    if (fileSelected) {
      let divText = document.getElementById(`divText-${inputId}`);
      if (divText) {
        divText.style.visibility = "hidden";
      }

      document.getElementById(`div-${inputId}`).style.padding = "0";
    }
  }, [inputId]);

  useEffect(() => {
    if (imageError) {
      document.getElementById(`divText-${inputId}`).style.visibility = "flex";
      document.getElementById(`div-${inputId}`).style.padding = "0";
    }
  }, [imageError]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex flex-col gap-3  mb-4">
        <div className="font-bold text-lg flex ">
          {label} {required && <div className="text-red-700">*</div>}
        </div>
        {info && <div className="text-md  mb-4">{info}</div>}
        <div
          id={`div-${inputId}`}
          tabIndex="0"
          bis_skin_checked="1"
          onClick={() => !fileSelected && selectVideo()}
          className={`outline-dashed dark:bg-dark-1 ${
            imageError && "outline-red-400"
          }  items-center justify-center cursor-pointer ${className}`}
        >
          <input
            id={inputId}
            onChange={(e) => handleOnFileSelected(e)}
            accept="video/*"
            name="uploadImage"
            type="file"
            autoComplete="off"
            className="hidden"
          />

          {!imageError && fileSelected ? (
            <div className="flex flex-col justify-center items-center h-full px-2">
              <VideoPlayer videoId="inputVideo" video={fileSelected.preview} />
            </div>
          ) : (
            <>
              {!icon ? (
                <>
                  <div
                    id={`divText-${inputId}`}
                    className={`flex h-full items-center justify-center text-center${
                      imageError && "text-red-400"
                    } `}
                  >
                    {loadingImage ? (
                      <img
                        src={fibboLogo}
                        className="w-[128px] animate-pulse"
                        alt={`loading-${inputId}`}
                      />
                    ) : (
                      <>
                        {!loadingImage && imageError ? (
                          <div className="text-red-600">
                            {imageMessageError}
                          </div>
                        ) : (
                          <div className="text-center">
                            {
                              <div>
                                {literals.createCollection.videoInput} <br></br>
                                {literals.createCollection.videoTypes}
                              </div>
                            }
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div
                  id={`divText-${inputId}`}
                  className={`flex h-full items-center justify-center text-center${
                    imageError && "text-red-400"
                  } `}
                >
                  {loadingImage ? (
                    <img
                      src={fibboLogo}
                      className="w-[128px] animate-pulse"
                      alt={`loading-${inputId}`}
                    />
                  ) : (
                    <>
                      {!loadingImage && imageError ? (
                        <div className="text-red-600">{imageMessageError}</div>
                      ) : (
                        <Icon icon="bi:image-fill" width={48} />
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {fileSelected && (
        <div className="flex flex-col gap-4 items-center">
          <div
            id={`div-${inputId}`}
            className={`outline-dashed dark:bg-dark-1 items-center justify-center h-[150px] w-[300px] cursor-pointer`}
          >
            {!imageError ? (
              <div className="flex flex-col justify-center items-center h-full px-2">
                {frameSelected ? (
                  <img
                    id="frameSelected"
                    src={frameSelected.preview}
                    className="h-[150px] w-[300px] object-contain"
                  />
                ) : (
                  <video
                    className="h-[150px] w-[300px] object-contain"
                    src={fileSelected.preview}
                  />
                )}
              </div>
            ) : (
              <>
                {!icon ? (
                  <>
                    <div
                      id={`divText-${inputId}`}
                      className={`flex h-full items-center justify-center text-center${
                        imageError && "text-red-400"
                      } `}
                    >
                      {loadingImage ? (
                        <img
                          src={fibboLogo}
                          className="w-[128px] animate-pulse"
                          alt={`loading-${inputId}`}
                        />
                      ) : (
                        <>
                          {!loadingImage && imageError ? (
                            <div className="text-red-600">
                              {imageMessageError}
                            </div>
                          ) : (
                            <div className="text-center">
                              {
                                <div>
                                  {literals.createCollection.videoInput}{" "}
                                  <br></br>
                                  {literals.createCollection.videoTypes}
                                </div>
                              }
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div
                    id={`divText-${inputId}`}
                    className={`flex h-full items-center justify-center text-center${
                      imageError && "text-red-400"
                    } `}
                  >
                    {loadingImage ? (
                      <img
                        src={fibboLogo}
                        className="w-[128px] animate-pulse"
                        alt={`loading-${inputId}`}
                      />
                    ) : (
                      <>
                        {!loadingImage && imageError ? (
                          <div className="text-red-600">
                            {imageMessageError}
                          </div>
                        ) : (
                          <Icon icon="bi:image-fill" width={48} />
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <div
              onClick={selectVideo}
              className="cursor-pointer flex px-4 py-3 border rounded-lg bg-gray-300 dark:bg-dark-1"
            >
              Select another video
            </div>
            <div
              onClick={selectFrame}
              className="cursor-pointer flex px-4 py-3 border rounded-lg bg-gray-300 dark:bg-dark-1"
            >
              Select caption
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
