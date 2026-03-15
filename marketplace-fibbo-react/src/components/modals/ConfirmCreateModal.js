import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../api";
import ActionButton from "../ActionButton";
import { Check } from "../lottie/Check";
import { BasicModal } from "./BasicModal";
import { useTokens } from "../../contracts/token";
import { useStateContext } from "../../context/StateProvider";
import { IPFS_BASE_URL } from "../../constants/ipfs";
import { AudioPlayer } from "../AudioPlayer";
import { VideoPlayer } from "../VideoPlayer";
export const ConfirmCreateModal = ({
  showModal,
  handleCloseModal,
  itemData,
  collection,
  wallet,
}) => {
  const [{ literals }] = useStateContext();
  const { mintGassless } = useTokens();
  const { saveMintedItem, uploadJSONMetadata, uploadToCDN } = useApi();
  const [newTokenId, setNewTokenId] = useState(0);
  const [address, setAddress] = useState("");
  const [completedAction, setCompletedAction] = useState(false);

  const navigate = useNavigate();

  const createNFT = async (e) => {
    try {
      if (itemData.contentType === "AUDIO") {
        const audioResponse = await uploadToCDN(
          itemData.fileSelected.file,
          itemData.contentType,
          true,
          itemData.isExplicit
        );
        const audioSanity = audioResponse.sanity;
        const audioIpfs = audioResponse.ipfs;
        const audioError = audioResponse.error;

        if (audioError) {
          throw Error(audioError);
        }

        const audioIpfsURL = `${IPFS_BASE_URL}/${audioIpfs}`;

        const coverResponse = await uploadToCDN(
          itemData.coverSelected.file,
          "IMG",
          true,
          itemData.isExplicit
        );

        const coverSanity = coverResponse.sanity;
        const coverIpfs = coverResponse.ipfs;
        const coverError = coverResponse.error;

        if (coverError) {
          throw Error(coverError);
        }
        const coverIpfsURL = `${IPFS_BASE_URL}/${coverIpfs}`;

        const ipfsCID = await uploadJSONMetadata(
          itemData.name,
          itemData.description,
          coverIpfsURL,
          itemData.externalLink,
          itemData.contentType,
          audioIpfsURL
        );

        const ipfsFileURL = `${IPFS_BASE_URL}/${ipfsCID}`;
        //await mintGassless(collection.contractAddress, wallet, ipfsFileURL);
        let newTokenId = collection.numberOfItems + 1;
        //Si todo va bien, crear a sanity
        await saveMintedItem(
          itemData.name,
          itemData.description,
          wallet,
          newTokenId,
          itemData.royalty ? itemData.royalty : 0,
          coverSanity,
          itemData.ipfsImage,
          ipfsFileURL,
          collection.contractAddress,
          itemData.externalLink,
          itemData.hiddenContent,
          itemData.categories.map((cat) => {
            return cat.identifier;
          }),
          itemData.contentType,
          audioSanity
        );
        setNewTokenId(newTokenId);
        setAddress(address);
        setCompletedAction(true);
      } else if (itemData.contentType === "VIDEO") {
        const { sanity, ipfs, error } = await uploadToCDN(
          itemData.fileSelected.file,
          itemData.contentType,
          true,
          itemData.isExplicit
        );
        if (error) {
          throw Error(error);
        }
        const videoIpfsURL = `${IPFS_BASE_URL}/${ipfs}`;

        const coverResponse = await uploadToCDN(
          itemData.coverSelected.file,
          "IMG",
          true,
          itemData.isExplicit
        );

        const coverSanity = coverResponse.sanity;
        const coverIpfs = coverResponse.ipfs;
        const coverError = coverResponse.error;

        if (coverError) {
          throw Error(coverError);
        }
        const coverIpfsURL = `${IPFS_BASE_URL}/${coverIpfs}`;

        const ipfsCID = await uploadJSONMetadata(
          itemData.name,
          itemData.description,
          coverIpfsURL,
          itemData.externalLink,
          itemData.contentType,
          videoIpfsURL
        );

        const ipfsFileURL = `${IPFS_BASE_URL}/${ipfsCID}`;

        await mintGassless(collection.contractAddress, wallet, ipfsFileURL);
        let newTokenId = collection.numberOfItems + 1;
        //Si todo va bien, crear a sanity
        await saveMintedItem(
          itemData.name,
          itemData.description,
          wallet,
          newTokenId,
          itemData.royalty ? itemData.royalty : 0,
          coverSanity,
          itemData.ipfsImage,
          ipfsFileURL,
          collection.contractAddress,
          itemData.externalLink,
          itemData.hiddenContent,
          itemData.categories.map((cat) => {
            return cat.identifier;
          }),
          itemData.contentType,
          sanity
        );
        setNewTokenId(newTokenId);
        setAddress(address);
        setCompletedAction(true);
      } else {
        const { sanity, ipfs, error } = await uploadToCDN(
          itemData.fileSelected.file,
          itemData.contentType,
          true,
          itemData.isExplicit
        );
        if (error) {
          throw Error(error);
        }
        const ipfsURL = `${IPFS_BASE_URL}/${ipfs}`;

        const ipfsCID = await uploadJSONMetadata(
          itemData.name,
          itemData.description,
          ipfsURL,
          itemData.externalLink,
          itemData.contentType
        );

        const ipfsFileURL = `${IPFS_BASE_URL}/${ipfsCID}`;

        await mintGassless(collection.contractAddress, wallet, ipfsFileURL);
        let newTokenId = collection.numberOfItems + 1;
        //Si todo va bien, crear a sanity
        await saveMintedItem(
          itemData.name,
          itemData.description,
          wallet,
          newTokenId,
          itemData.royalty ? itemData.royalty : 0,
          sanity,
          itemData.ipfsImage,
          ipfsFileURL,
          collection.contractAddress,
          itemData.externalLink,
          itemData.hiddenContent,
          itemData.categories.map((cat) => {
            return cat.identifier;
          }),
          itemData.contentType
        );
        setNewTokenId(newTokenId);
        setAddress(address);
        setCompletedAction(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const seeResult = async () => {
    if (collection.customURL) {
      navigate(`/explore/${collection.customURL}/${newTokenId}`);
    } else {
      navigate(`/explore/${collection.contractAddress}/${newTokenId}`);
    }
  };

  return (
    <BasicModal
      size="large"
      title={literals.modals.confirmCreation}
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      createNFT
    >
      {!completedAction ? (
        <div className="flex flex-col gap-10  items-center">
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mt-10">
            <div className="w-[225px] lg:w-[300px] object-contain">
              {itemData.contentType === "VIDEO" ? (
                <VideoPlayer
                  videoId="previer-video"
                  video={itemData.fileSelected.preview}
                />
              ) : (
                <>
                  {itemData.contentType === "AUDIO" ? (
                    <>
                      <img
                        src={itemData.coverSelected?.preview}
                        alt={`item-${itemData.name}`}
                        width={300}
                        className="object-contain"
                      />
                      <AudioPlayer
                        audioId="preview"
                        audio={itemData.fileSelected?.preview}
                      />
                    </>
                  ) : (
                    <img
                      src={itemData.fileSelected?.preview}
                      alt={`item-${itemData.name}`}
                      width={300}
                      className="object-contain"
                    />
                  )}
                </>
              )}
            </div>
            <div className="flex flex-col gap-3 w-60">
              <div className="flex gap-2">
                <b>{literals.confirmCreateModal.collection}</b>
                <p>{collection?.name}</p>
              </div>
              <div className="flex gap-2">
                <b>{literals.confirmCreateModal.name}</b>
                <p>{itemData.name}</p>
              </div>
              <div className="flex flex-col gap-2">
                <b>{literals.confirmCreateModal.description}</b>
                <p className="text-sm">{itemData.description}</p>
              </div>
              <div className="flex gap-2">
                <b>{literals.confirmCreateModal.royalties}</b>
                <p>{itemData.royalty} %</p>
              </div>
              {itemData.hiddenContent && (
                <div className="flex gap-2 items-center">
                  <b>{literals.confirmCreateModal.aditionalContent} </b>
                  <input type="checkbox" checked={true} />
                </div>
              )}
            </div>
          </div>
          <ActionButton
            variant={"contained"}
            size="large"
            text={literals.confirmCreateModal.createNFT}
            buttonAction={createNFT}
          />
        </div>
      ) : (
        <div className="my-10 mx-8 flex flex-col gap-10 items-center">
          <div className="flex gap-5 items-center">
            <Check />
            <p>{literals.confirmCreateModal.itemCreated} </p>
          </div>
          <div className="w-full flex items-center justify-center">
            <ActionButton
              variant="contained"
              size="large"
              text={literals.confirmCreateModal.viewItem}
              buttonAction={(e) => seeResult()}
            />
          </div>
        </div>
      )}
    </BasicModal>
  );
};
