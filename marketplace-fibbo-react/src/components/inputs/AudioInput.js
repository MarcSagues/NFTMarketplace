import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/StateProvider";
import fibboLogo from "../../assets/logoNavbarSmall.png";
import { AudioPlayer } from "../AudioPlayer";

export const AudioInput = ({
  fileSelected,
  required,
  info,
  label,
  inputId,
  imageError,
  imageMessageError,
  onFileSelected,
  backgroundImage,
  className,
  icon,
  setFileSelected,
}) => {
  const [loadingImage, setLoadingImage] = useState(false);

  const selectAudio = () => {
    setFileSelected(null);
    const inputRef = document.getElementById(inputId);
    inputRef.click();
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
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col gap-3 justify-center items-center  mb-4">
        <div className="font-bold text-lg flex ">
          {label} {required && <div className="text-red-700">*</div>}
        </div>
        {info && <div className="text-md  mb-4">{info}</div>}
        <div
          id={`div-${inputId}`}
          tabIndex="0"
          bis_skin_checked="1"
          onClick={() => !fileSelected && selectAudio()}
          className={`outline-dashed dark:bg-dark-1 ${
            imageError && "outline-red-400"
          }  items-center justify-center flex cursor-pointer ${className}`}
        >
          <input
            id={inputId}
            onChange={(e) => handleOnFileSelected(e)}
            accept="audio/*"
            name="uploadImage"
            type="file"
            autoComplete="off"
            className="hidden"
          />

          {!imageError && fileSelected ? (
            <div className="w-full mx-4">
              <AudioPlayer
                audioId="previewInput"
                audio={fileSelected.preview}
              />
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
                                {literals.createCollection.audioInput} <br></br>
                                {literals.createCollection.audioTypes}
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
        <div
          onClick={selectAudio}
          className="cursor-pointer flex px-4 py-3 border rounded-lg bg-gray-300 dark:bg-dark-1"
        >
          Select another audio
        </div>
      )}
    </div>
  );
};
