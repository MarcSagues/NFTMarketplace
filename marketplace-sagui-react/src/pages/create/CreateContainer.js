import React, { useEffect, useState } from "react";
import useAccount from "../../hooks/useAccount";
import ActionButton from "../../components/ActionButton";
import { useStateContext } from "../../context/StateProvider";
import { useApi } from "../../api";
import { ConfirmCreateModal } from "../../components/modals/ConfirmCreateModal";
import { useParams } from "react-router-dom";
import { TextInput } from "../../components/inputs/TextInput";
import { TextArea } from "../../components/inputs/TextArea";
import { NumberInput } from "../../components/inputs/NumberInput";
import { PageWithLoading } from "../../components/basic/PageWithLoading";
import { NotVerified } from "../../components/basic/NotVerified";
import { ImageInput } from "../../components/inputs/ImageInput";
import { NotOwner } from "../../components/basic/NotOwner";
import { MultipleSelect } from "../../components/inputs/MultipleSelect";
import { Icon } from "@iconify/react";
import { VideoInput } from "../../components/inputs/VideoInput";
import { AudioInput } from "../../components/inputs/AudioInput";
import captureVideoFrame from "capture-video-frame";

const validateName = (name) => {
  if (name.length > 4 && name.length < 30) return true;
  else return false;
};

const validateDesc = (desc) => {
  if (desc.length > 25 && desc.length < 500) return true;
  else return false;
};
export default function CreateContainer() {
  const { collection } = useParams();
  const { uploadImgToCDN, getCollectionsAvailable, getAllCategories } =
    useApi();
  const [ipfsImageUrl, setIpfsImageUrl] = useState("");
  const [sanityImgUrl, setSanityImgUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [coverSelected, setCoverSelected] = useState(null);

  const [name, setName] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [desc, setDesc] = useState("");
  const [royalty, setRoyalty] = useState("");
  const { connectToWallet, wallet } = useAccount();
  const [{ lang, verifiedAddress, literals }] = useStateContext();
  const [collectionsAvailable, setCollectionsAvailable] = useState([]);
  const [categoriesAvailable, setCategoriesAvailable] = useState([]);

  const [collectionSelected, setCollectionsSelected] = useState(null);
  const [categoriesSelected, setCategoriesSelected] = useState([]);

  const [contentType, setContentType] = useState("IMG");
  const [isOwner, setIsOwner] = useState(false);

  const [loading, setLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showHiddenContent, setShowHiddenContent] = useState(false);
  const [hiddenContent, setHiddenContent] = useState("");

  const [imageError, setImageError] = useState(false);
  const [imageMessageError, setImageMessageError] = useState("");

  const [audioError, setAudioError] = useState(false);
  const [audioMessageError, setAudioMessageError] = useState("");

  const [nameError, setNameError] = useState(false);
  const [descError, setDescError] = useState(false);
  const [royaltyError, setRoyaltyError] = useState(false);

  const selectContentType = (type) => {
    setSelectedFile(null);
    setImageError(false);
    setAudioError(false);
    setContentType(type);
  };
  const selectCategory = (cat) => {
    const isSelected = categoriesSelected.find(
      (c) => c.identifier === cat.identifier
    );
    if (!isSelected) {
      setCategoriesSelected([...categoriesSelected, cat]);
    }
  };
  const removeCategory = (cat) => {
    const isSelected = categoriesSelected.find(
      (c) => c.identifier === cat.identifier
    );
    if (isSelected) {
      setCategoriesSelected(
        categoriesSelected.filter((c) => c.identifier !== cat.identifier)
      );
    }
  };
  const onFileSelected = (e) => {
    setAudioError(false);
    setImageError(false);
    const file = e.target.files[0];
    if (
      (contentType === "IMG" && file.type.includes("image")) ||
      (contentType === "VIDEO" && file.type.includes("video")) ||
      (contentType === "AUDIO" && file.type.includes("audio"))
    ) {
      const sizeInMB = file.size / 1000000;
      if (sizeInMB > 50) {
        setAudioError(true);
        setImageError(true);
        setImageMessageError(literals.createItem.sizeError);
      } else {
        setSelectedFile({ file: file, preview: URL.createObjectURL(file) });
      }
    } else {
      if (contentType === "AUDIO") {
        setAudioError(true);
        setAudioMessageError(literals.createItem.selectAudioError);
      }
      if (contentType === "VIDEO") {
        setImageError(true);
        setImageMessageError(literals.createItem.selectVideoError);
      }
      if (contentType === "IMG") {
        setImageError(true);
        setImageMessageError(literals.createItem.selectImageError);
      }
    }
  };

  const onFrameSelectedVideo = async (dataUri) => {
    let response = await fetch(dataUri);
    let data = await response.blob();
    let metadata = {
      type: "image/jpeg",
    };
    let file = new File([data], "cover.jpg", metadata);
    setCoverSelected({ file: file, preview: URL.createObjectURL(file) });
  };

  const onCoverSelected = async (e) => {
    const file = e.target.files[0];
    if (file.type.includes("image")) {
      setCoverSelected({ file: file, preview: URL.createObjectURL(file) });
    } else {
      setImageError(true);
      setImageMessageError(literals.createItem.selectImageError);
    }
  };

  const handleShowConfirmModal = () => {
    setNameError(false);
    setDescError(false);
    setRoyaltyError(false);

    let error = false;
    if (!selectedFile) {
      if (!imageError) {
        if (contentType === "AUDIO") {
          setAudioError(true);
          setAudioMessageError(literals.createItem.selectAudioError);
          if (!coverSelected) {
            setImageError(true);
            setImageMessageError(literals.createItem.selectImageError);
          }
        }
        if (contentType === "VIDEO") {
          setImageError(true);
          setImageMessageError(literals.createItem.selectVideoError);
        }
        if (contentType === "IMG") {
          setImageError(true);
          setImageMessageError(literals.createItem.selectImageError);
        }
      }
      error = true;
    }
    if (!validateName(name)) {
      setNameError(true);
      error = true;
    }
    if (!validateDesc(desc)) {
      setDescError(true);
      error = true;
    }
    if (royalty < 0 || royalty > 50) {
      setRoyaltyError(true);
      error = true;
    }

    if (!error) {
      setShowConfirmationModal(true);
    }
  };

  const handleChangeName = (value) => {
    setNameError(false);
    setName(value);
  };

  const handleChangeLink = (value) => {
    setExternalLink(value);
  };

  const handleChangeDescription = (value) => {
    setDescError(false);
    setDesc(value);
  };

  const handleChangeRoyalty = (value) => {
    setRoyaltyError(false);
    setRoyalty(value);
  };

  const handleSelectCollection = (value) => {
    const selected = collectionsAvailable.find((item) => item.name === value);

    setCollectionsSelected(selected);
  };

  useEffect(() => {
    const fetchData = async () => {
      await connectToWallet();
      const collections = await getCollectionsAvailable(wallet);
      setCollectionsAvailable(collections);
      let _collection;
      if (collection.startsWith("0x")) {
        _collection = collections.find(
          (item) => item.contractAddress === collection
        );
        setCollectionsSelected(_collection);
      } else {
        _collection = collections.find((item) => item.customURL === collection);
        setCollectionsSelected(_collection);
      }

      const cats = await getAllCategories();
      setCategoriesAvailable(cats);

      if (!_collection) setIsOwner(false);
      else setIsOwner(_collection.creator === wallet);
    };
    fetchData().then(() => setLoading(false));
  }, [wallet, connectToWallet]);

  return (
    <PageWithLoading loading={loading}>
      {isOwner ? (
        <>
          {verifiedAddress ? (
            <div className="h-full flex-col w-full lg:h-screen justify-center items-center dark:bg-dark-1">
              <div className="flex lg:flex-row flex-col gap-10 p-8 justify-center items-center md:items-start">
                <div className="flex flex-col gap-20">
                  {contentType === "VIDEO" ? (
                    <VideoInput
                      frameSelected={coverSelected}
                      setFrameSelected={onFrameSelectedVideo}
                      fileSelected={selectedFile}
                      videoURL={sanityImgUrl}
                      setVideoURL={setSanityImgUrl}
                      inputId="inputNFT"
                      onFileSelected={(e) => onFileSelected(e)}
                      setFileSelected={setSelectedFile}
                      imageError={imageError}
                      icon={false}
                      imageMessageError={imageMessageError}
                      className="rounded-md w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
                    />
                  ) : contentType === "IMG" ? (
                    <ImageInput
                      fileSelected={selectedFile}
                      inputId="inputNFT"
                      onFileSelected={onFileSelected}
                      imageError={imageError}
                      icon={false}
                      imageMessageError={imageMessageError}
                      className="rounded-md w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
                    />
                  ) : (
                    <div>
                      <ImageInput
                        fileSelected={coverSelected}
                        inputId="inputNFT"
                        onFileSelected={onCoverSelected}
                        imageError={imageError}
                        icon={false}
                        imageMessageError={imageMessageError}
                        className="rounded-md w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
                      />
                      <AudioInput
                        fileSelected={selectedFile}
                        inputId="audioNFT"
                        onFileSelected={onFileSelected}
                        setFileSelected={setSelectedFile}
                        imageError={audioError}
                        icon={false}
                        imageMessageError={audioMessageError}
                        className="rounded-md w-[300px] h-[100px] md:w-[400px]  lg:w-[500px]"
                      />
                    </div>
                  )}

                  <div className="flex justify-evenly">
                    <ContentTypeSelector
                      contentType="IMG"
                      selectedContent={contentType}
                      text={literals.createItem.image}
                      icon="bi:file-image"
                      selectedIcon="bi:file-image-fill"
                      onClick={() => selectContentType("IMG")}
                    />
                    <ContentTypeSelector
                      contentType="VIDEO"
                      selectedContent={contentType}
                      text={literals.createItem.video}
                      icon="bi:camera-video"
                      selectedIcon="bi:camera-video-fill"
                      onClick={() => selectContentType("VIDEO")}
                    />
                    <ContentTypeSelector
                      contentType="AUDIO"
                      selectedContent={contentType}
                      text={literals.createItem.audio}
                      icon="bi:file-music"
                      selectedIcon="bi:file-music-fill"
                      onClick={() => selectContentType("AUDIO")}
                    />
                  </div>
                </div>

                <div className="">
                  <div className="form-group mb-6 flex flex-col gap-3">
                    <div className="font-bold text-lg">
                      {literals.createItem.colection}
                    </div>
                    <select
                      disabled
                      value={collectionSelected?.name}
                      onChange={(e) => handleSelectCollection(e.target.value)}
                      placeholder={literals.createItem.colection}
                      id="collectionInput"
                      className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 
              bg-white bg-clip-padding border border-solid border-black rounded transition ease-in-out m-0
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    >
                      {collectionsAvailable?.map((col) => {
                        return (
                          <option
                            key={col.collectionAddress}
                            value={col.collectionAddress}
                          >
                            {col.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="flex flex-col gap-3  mb-4">
                    <TextInput
                      label={literals.createItem.name}
                      required
                      value={name}
                      error={nameError}
                      onChange={(e) => handleChangeName(e.target.value)}
                      errorMessage={literals.createCollection.nameCharacters}
                    />

                    {nameError && <div className="text-xs text-red-400 "></div>}
                  </div>
                  <TextArea
                    label={literals.createItem.description}
                    required
                    info={literals.createItem.descriptionDesc}
                    error={descError}
                    value={desc}
                    errorMessage={literals.createItem.descriptionError}
                    onChange={(e) => handleChangeDescription(e.target.value)}
                  />
                  <MultipleSelect
                    label={literals.filters.categories}
                    buttonLabel={literals.actions.addCategory}
                    options={categoriesAvailable.map((col) => {
                      return {
                        ...col,
                        name: lang === "eng" ? col.name.eng : col.name.esp,
                      };
                    })}
                    selectOption={selectCategory}
                    optionsSelected={categoriesSelected}
                    removeOption={removeCategory}
                  />
                  <TextInput
                    label={literals.createItem.externalLink}
                    info={literals.createItem.externalLinkDesc}
                    value={externalLink}
                    placeholder="https://yourweb.com"
                    onChange={(e) => handleChangeLink(e.target.value)}
                  />

                  {nameError && <div className="text-xs text-red-400 "></div>}

                  <NumberInput
                    label={literals.createItem.royalties}
                    placeholder="ej. 2.5%"
                    value={royalty}
                    onChange={(e) => handleChangeRoyalty(e.target.value)}
                    error={royaltyError}
                    errorMessage={literals.createItem.royaltiesError}
                    info={literals.createItem.royaltiesDesc}
                  />
                  {/** Contenido adicional */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          className=""
                          value=""
                          onChange={() =>
                            setShowHiddenContent(!showHiddenContent)
                          }
                        />
                        <span className="font-bold text-lg text-gray-700 dark:text-gray-400 border-gray-300 p-3">
                          {literals.createItem.additionalContent}
                        </span>
                      </div>

                      {showHiddenContent && (
                        <TextArea
                          placeholder={
                            literals.createItem.additionalContentPlaceholder
                          }
                          info={literals.createItem.additionalContentDesc}
                          value={hiddenContent}
                          onChange={(e) => setHiddenContent(e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center mt-10 w-full lg:p-0 pb-20 gap-5 ">
                <ActionButton
                  variant={"contained"}
                  size="large"
                  text={literals.actions.createNFT}
                  buttonAction={(e) => handleShowConfirmModal(e)}
                />
              </div>
              {showConfirmationModal && (
                <ConfirmCreateModal
                  showModal={showConfirmationModal}
                  handleCloseModal={(e) => setShowConfirmationModal(false)}
                  collection={collectionSelected}
                  itemData={{
                    fileSelected: selectedFile,
                    name: name,
                    description: desc,
                    royalty: royalty,
                    hiddenContent: hiddenContent,
                    externalLink: externalLink,
                    categories: categoriesSelected,
                    isExplicit: collectionSelected.isExplicit,
                    coverSelected: coverSelected ?? null,
                    contentType: contentType,
                  }}
                  wallet={wallet}
                />
              )}
            </div>
          ) : (
            <NotVerified text={literals.modals.artistNotVerified2} />
          )}
        </>
      ) : (
        <NotOwner text={literals.createItem.notOwner} />
      )}
    </PageWithLoading>
  );
}

const ContentTypeSelector = ({
  text,
  icon,
  selectedIcon,
  contentType,
  selectedContent,
  onClick,
}) => {
  return (
    <div
      className={`cursor-pointer rounded-lg flex flex-col items-center gap-2 border ${
        selectedContent === contentType
          ? "bg-gray-400 dark:bg-dark-4 "
          : "bg-gray-400 dark:bg-dark-1"
      } px-7 py-5`}
      onClick={onClick}
    >
      <Icon
        icon={selectedContent === contentType ? selectedIcon : icon}
        width={32}
      />
      {text}
    </div>
  );
};
