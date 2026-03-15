import React, { useEffect, useState } from "react";
import useAccount from "../../hooks/useAccount";
import ActionButton from "../../components/ActionButton";
import { useStateContext } from "../../context/StateProvider";
import { useApi } from "../../api";
import { addImgToIpfs } from "../../utils/ipfs";
import { useNavigate, useParams } from "react-router-dom";
import { TextInput } from "../../components/inputs/TextInput";
import { TextArea } from "../../components/inputs/TextArea";
import { NumberInput } from "../../components/inputs/NumberInput";
import { PageWithLoading } from "../../components/basic/PageWithLoading";
import { NotVerified } from "../../components/basic/NotVerified";
import { Icon } from "@iconify/react";
import FreezeMetadataModal from "../../components/modals/FreezeMetadataModal";
import { ImageInput } from "../../components/inputs/ImageInput";
import { NotOwner } from "../../components/basic/NotOwner";
import { useCollections } from "../../contracts/collection";
import { MultipleSelect } from "../../components/inputs/MultipleSelect";
import { AudioInput } from "../../components/inputs/AudioInput";
import { VideoInput } from "../../components/inputs/VideoInput";
import { IPFS_BASE_URL } from "../../constants/ipfs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const validateName = (name) => {
  if (name.length > 4 && name.length < 30) return true;
  else return false;
};

const validateDesc = (desc) => {
  if (desc.length > 25 && desc.length < 500) return true;
  else return false;
};
export default function EditContainer() {
  const navigate = useNavigate();
  let { collection, tokenId } = useParams();

  const { checkFreezedMetadata } = useCollections();
  const {
    uploadToCDN,
    getNftInfo,
    editNftData,
    getCollectionInfo,
    getAllCategories,
    uploadJSONMetadata,
  } = useApi();
  const [ipfsImageUrl, setIpfsImageUrl] = useState("");
  const [ipfsMetadata, setIpfsMetadata] = useState("");

  const [sanityImgUrl, setSanityImgUrl] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [coverSelected, setCoverSelected] = useState(null);

  const [name, setName] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [desc, setDesc] = useState("");
  const [royalty, setRoyalty] = useState("");
  const { connectToWallet, wallet } = useAccount();
  const [{ lang, verifiedAddress, literals }] = useStateContext();

  const [loading, setLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showHiddenContent, setShowHiddenContent] = useState(false);
  const [hiddenContent, setHiddenContent] = useState("");

  const [nftInfo, setNftInfo] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [hasMetadataFreezed, setHasMetadataFreezed] = useState(false);
  const [contentType, setContentType] = useState("IMG");
  const [imageError, setImageError] = useState(false);
  const [imageMessageError, setImageMessageError] = useState("");
  const [audioError, setAudioError] = useState(false);
  const [audioMessageError, setAudioMessageError] = useState("");

  const [nameError, setNameError] = useState(false);
  const [descError, setDescError] = useState(false);
  const [royaltyError, setRoyaltyError] = useState(false);

  const [collectionSelected, setCollectionSelected] = useState(null);
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [categoriesAvailable, setCategoriesAvailable] = useState([]);

  const [freezeMetadata, setFreezedMetadata] = useState(false);
  const [showFreeze, setShowFreeze] = useState(false);

  const [mediaEdited, setMediaEdited] = useState(false);

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

  const getItemDetails = async () => {
    const { nftData } = await getNftInfo(collection, tokenId);
    setNftInfo(nftData);
    setName(nftData.name);
    setDesc(nftData.description);
    setRoyalty(nftData.royalty);
    setIpfsImageUrl(nftData.ipfsImage);
    setIpfsMetadata(nftData.ipfsMetadata);
    setSanityImgUrl(nftData.image);
    setExternalLink(nftData.externalLink);
    setContentType(nftData.contentType);

    const collectionInfo = await getCollectionInfo(collection);
    setIsOwner(collectionInfo.creator === wallet);
    setCollectionSelected(collectionInfo);

    let isFreezed = await checkFreezedMetadata(
      collectionInfo.contractAddress,
      tokenId
    );
    setHasMetadataFreezed(isFreezed);

    let coverTesponse = await fetch(nftData.image);
    let coverData = await coverTesponse.blob();
    let coverMetadata = {
      type: "image/png",
    };
    let coverFile = new File([coverData], nftData.name, coverMetadata);

    if (nftData.contentType === "AUDIO") {
      let response = await fetch(nftData.audio);
      let data = await response.blob();
      let metadata = {
        type: "audio/mp3",
      };
      let audioFile = new File([data], nftData.name, metadata);
      setSelectedFile({
        file: audioFile,
        preview: URL.createObjectURL(audioFile),
      });

      setCoverSelected({
        file: coverFile,
        preview: URL.createObjectURL(coverFile),
      });
    }
    if (nftData.contentType === "VIDEO") {
      let response = await fetch(nftData.video);
      let data = await response.blob();
      let metadata = {
        type: "video/mp4",
      };
      let videoFile = new File([data], nftData.name, metadata);
      setSelectedFile({
        file: videoFile,
        preview: URL.createObjectURL(videoFile),
      });
      setCoverSelected({
        file: coverFile,
        preview: URL.createObjectURL(coverFile),
      });
    }
    if (nftData.contentType === "IMG") {
      setSelectedFile({
        file: coverFile,
        preview: URL.createObjectURL(coverFile),
      });
    }

    if (nftData.additionalContent) {
      setShowHiddenContent(true);
      setHiddenContent(nftData.additionalContent);
    }

    const cats = await getAllCategories();
    setCategoriesAvailable(cats);

    const selected = [];
    const itemCats = nftData.categories;
    await Promise.all(
      cats.map((cat) => {
        itemCats.forEach((itemCat) => {
          if (itemCat === cat.identifier) {
            selected.push({
              ...cat,
              name: lang === "eng" ? cat.name.eng : cat.name.esp,
            });
          }
        });
      })
    );

    setCategoriesSelected(selected);
    await sleep(2000);
  };

  const onFileSelected = (e) => {
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
        setMediaEdited(true);
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

  const selectContentType = (type) => {
    setSelectedFile(null);
    setImageError(false);
    setAudioError(false);
    setContentType(type);
  };

  const onFrameSelectedVideo = async (dataUri) => {
    let response = await fetch(dataUri);
    let data = await response.blob();
    let metadata = {
      type: "image/jpeg",
    };
    let file = new File([data], "cover.jpg", metadata);
    setCoverSelected({ file: file, preview: URL.createObjectURL(file) });
    setMediaEdited(true);
  };

  const onCoverSelected = async (e) => {
    const file = e.target.files[0];
    if (file.type.includes("image")) {
      setCoverSelected({ file: file, preview: URL.createObjectURL(file) });
      setMediaEdited(true);
    } else {
      setImageError(true);
      setImageMessageError(literals.createItem.selectImageError);
    }
  };

  const handleEdit = async () => {
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
      if (contentType === "AUDIO") {
        let sanityAudioUrl = nftInfo.audio;
        let sanityCoverUrl = nftInfo.image;
        let ipfsCoverUrl = nftInfo.ipfsImage;
        let ipfsMetadataUrl = nftInfo.ipfsMetadata;

        if (mediaEdited) {
          const audioResponse = await uploadToCDN(
            selectedFile.file,
            contentType,
            true,
            false
          );
          sanityAudioUrl = audioResponse.sanity;
          const audioIpfs = audioResponse.ipfs;
          const audioError = audioResponse.error;

          if (audioError) {
            throw Error(audioError);
          }

          const audioIpfsURL = `${IPFS_BASE_URL}/${audioIpfs}`;

          const coverResponse = await uploadToCDN(
            coverSelected.file,
            "IMG",
            true,
            false
          );

          sanityCoverUrl = coverResponse.sanity;
          const coverIpfs = coverResponse.ipfs;
          const coverError = coverResponse.error;

          if (coverError) {
            throw Error(coverError);
          }
          ipfsCoverUrl = `${IPFS_BASE_URL}/${coverIpfs}`;

          const ipfsCID = await uploadJSONMetadata(
            name,
            desc,
            ipfsCoverUrl,
            externalLink,
            contentType,
            audioIpfsURL
          );

          ipfsMetadataUrl = `${IPFS_BASE_URL}/${ipfsCID}`;
        }
        await editNftData(
          name,
          desc,
          wallet,
          tokenId,
          royalty,
          ipfsCoverUrl,
          sanityCoverUrl,
          ipfsMetadataUrl,
          collectionSelected.contractAddress,
          externalLink,
          hiddenContent,
          categoriesSelected.map((cat) => {
            return cat.identifier;
          }),
          contentType,
          sanityAudioUrl
        );
      } else if (contentType === "VIDEO") {
        let sanityVideoUrl = nftInfo.video;
        let sanityCoverUrl = nftInfo.image;
        let ipfsCoverUrl = nftInfo.ipfsImage;
        let ipfsMetadataUrl = nftInfo.ipfsMetadata;

        if (mediaEdited) {
          const { sanity, ipfs, error } = await uploadToCDN(
            selectedFile.file,
            contentType,
            true,
            false
          );
          if (error) {
            throw Error(error);
          }
          const videoIpfsURL = `${IPFS_BASE_URL}/${ipfs}`;

          const coverResponse = await uploadToCDN(
            coverSelected.file,
            "IMG",
            true,
            false
          );

          sanityVideoUrl = sanity;
          sanityCoverUrl = coverResponse.sanity;
          ipfsCoverUrl = coverResponse.ipfs;
          const coverError = coverResponse.error;

          if (coverError) {
            throw Error(coverError);
          }
          const coverIpfsURL = `${IPFS_BASE_URL}/${ipfsCoverUrl}`;

          const ipfsCID = await uploadJSONMetadata(
            name,
            desc,
            coverIpfsURL,
            externalLink,
            contentType,
            videoIpfsURL
          );

          ipfsMetadataUrl = `${IPFS_BASE_URL}/${ipfsCID}`;
        }
        await editNftData(
          name,
          desc,
          wallet,
          tokenId,
          royalty ? royalty : 0,
          ipfsCoverUrl,
          sanityCoverUrl,
          ipfsMetadataUrl,
          collectionSelected.contractAddress,
          externalLink,
          hiddenContent,
          categoriesSelected.map((cat) => {
            return cat.identifier;
          }),
          contentType,
          sanityVideoUrl
        );
      } else {
        let sanityUrl = nftInfo.image;
        let ipfsFileUrl = nftInfo.ipfsMetadata;
        let ipfsImageUrl = nftInfo.ipfsImage;

        if (mediaEdited) {
          const { sanity, ipfs, error } = await uploadToCDN(
            selectedFile.file,
            contentType,
            true,
            false
          );
          if (error) {
            throw Error(error);
          }
          const ipfsURL = `${IPFS_BASE_URL}/${ipfs}`;

          const ipfsCID = await uploadJSONMetadata(
            name,
            desc,
            ipfsURL,
            externalLink,
            contentType
          );

          sanityUrl = sanity;
          ipfsImageUrl = ipfsURL;
          ipfsFileUrl = `${IPFS_BASE_URL}/${ipfsCID}`;
        }

        await editNftData(
          name,
          desc,
          wallet,
          tokenId,
          royalty,
          sanityUrl,
          ipfsImageUrl,
          ipfsFileUrl,
          collectionSelected.contractAddress,
          externalLink,
          hiddenContent,
          categoriesSelected.map((cat) => {
            return cat.identifier;
          }),
          contentType
        );
      }

      if (freezeMetadata) {
        setShowFreeze(true);
      } else {
        navigate(`/explore/${collection}/${tokenId}`);
      }
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

  useEffect(() => {
    const fetchData = async () => {
      await connectToWallet();
      getItemDetails().then(() => {
        setLoading(false);
      });
    };
    fetchData();
    return () => {};
  }, [wallet, collection, tokenId]);
  return (
    <PageWithLoading loading={loading}>
      {isOwner && !hasMetadataFreezed ? (
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
                      type="text"
                      disabled={true}
                      value={collectionSelected?.name}
                      placeholder={literals.createItem.colection}
                      id="collectionInput"
                      className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 
              bg-white bg-clip-padding border border-solid border-black rounded transition ease-in-out m-0
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    >
                      <option value={1}>{collectionSelected?.name}</option>
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
                    errorMessage={
                      literals.createCollection.descriptionCharacters
                    }
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
                    placeholder="https://tuweb.com"
                    onChange={(e) => handleChangeLink(e.target.value)}
                  />
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
                      <label className="">
                        <input
                          type="checkbox"
                          className=""
                          checked={showHiddenContent}
                          onChange={() =>
                            setShowHiddenContent(!showHiddenContent)
                          }
                        />
                        <span className="font-bold text-lg text-gray-700 dark:text-gray-400 border-gray-300 p-3">
                          {literals.createItem.additionalContent}
                        </span>
                      </label>
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

                  <div className="flex flex-col gap-3 pt-5 w-full">
                    <div className="flex flex-row gap-2">
                      <div
                        onClick={() => setFreezedMetadata(!freezeMetadata)}
                        className={` cursor-pointer flex items-center gap-5`}
                      >
                        {!freezeMetadata ? (
                          <div className="flex p-2 items-center justify-start w-[64px] h-[32px] bg-gray-400 dark:bg-gray-300 rounded-xl ">
                            <Icon
                              width={28}
                              icon="emojione-monotone:prohibited"
                              className="text-gray-700"
                            />
                          </div>
                        ) : (
                          <div className="flex p-2 items-center justify-end w-[64px] h-[32px] bg-primary-3  rounded-xl ">
                            <Icon
                              width={28}
                              icon="subway:tick"
                              className="text-gray-700"
                            />
                          </div>
                        )}
                        <span className="font-bold text-lg text-gray-700 dark:text-gray-400 border-gray-300 p-3 flex-row ">
                          {literals.createItem.freezeMedatadata}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center mt-10 w-full lg:p-0 pb-20 gap-5 ">
                <ActionButton
                  variant={"contained"}
                  size="large"
                  text={literals.actions.editNFT}
                  buttonAction={handleEdit}
                />
              </div>
              <FreezeMetadataModal
                wallet={wallet}
                showModal={showFreeze}
                tokenId={tokenId}
                handleCloseModal={() => setShowFreeze(false)}
                collectionInfo={collectionSelected}
                itemData={{
                  image: sanityImgUrl,
                  name: name,
                  description: desc,
                  royalty: royalty,
                  hiddenContent: hiddenContent,
                  ipfsImage: ipfsImageUrl,
                  ipfsMetadata: ipfsMetadata,
                  externalLink: externalLink,
                }}
              />
            </div>
          ) : (
            <NotVerified text={literals.modals.artistNotVerified2} />
          )}
        </>
      ) : (
        <>
          {!isOwner ? (
            <NotOwner text={literals.createItem.notOwnerEdit} />
          ) : (
            <NotOwner
              text={
                hasMetadataFreezed
                  ? literals.createItem.isFreezed
                  : literals.createItem.notOwnerEdit2
              }
            />
          )}
        </>
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
          : "bg-gray-200 dark:bg-dark-1"
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
