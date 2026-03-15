import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../api";
import { ActionModal } from "./ActionModal";
import { useFactory } from "../../contracts/factory";
import { ethers } from "ethers";
import { useStateContext } from "../../context/StateProvider";

export const ConfirmCreateCollection = ({
  showModal,
  handleCloseModal,
  collectionData,
  wallet,
}) => {
  const { saveCollectionDetails, uploadToCDN } = useApi();
  const [address, setAddress] = useState("");

  const navigate = useNavigate();
  const [{ literals }] = useStateContext();
  const createCollection = async (e) => {
    const {
      logoImage,
      mainImage,
      bannerImage,
      name,
      description,
      url,
      websiteURL,
      discordURL,
      telegramURL,
      instagramURL,
      explicitContent,
    } = collectionData;
    const customURL = url.split("https://fibbo-market.web.app/collection/")[1];

    //UPLOAD TO SANITY
    const logoResponse = await uploadToCDN(logoImage.file, "IMG", false, false);
    const logoSanity = logoResponse.sanity;
    console.log(logoSanity);

    let mainSanity = null;
    if (mainImage.file) {
      const mainResponse = await uploadToCDN(
        mainImage.file,
        "IMG",
        false,
        false
      );

      mainSanity = mainResponse.sanity;
    }

    console.log(mainSanity);

    let bannerSanity = null;

    if (bannerImage.file) {
      const bannerResponse = await uploadToCDN(
        collectionData.bannerImage.file,
        "IMG",
        false,
        false
      );

      bannerSanity = bannerResponse.sanity;
    }

    console.log(bannerSanity);
    try {
      const response = await saveCollectionDetails(
        wallet,
        name,
        description,
        logoSanity,
        mainSanity ? mainSanity : logoSanity,
        bannerSanity ?? "",
        customURL,
        websiteURL,
        discordURL,
        telegramURL,
        instagramURL,
        explicitContent
      );

      if (response.status !== 200) {
        return "ERROR";
      }
      setAddress(response.data);
      return "OK";
    } catch (e) {
      return "ERROR";
    }
  };

  const seeResult = async () => {
    const customURL = collectionData.url.split(
      "https://fibbo-market.web.app/collection/"
    )[1];

    if (customURL) {
      navigate(`/collection/${customURL}`);
    } else {
      navigate(`/collection/${address}`);
    }
  };

  return (
    <ActionModal
      size="large"
      title={literals.modals.confirmCreation}
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      onSubmit={() => createCollection()}
      submitLabel={literals.actions.createCollection}
      completedText={literals.confirmCreateCollection.collectionCreated}
      completedLabel={literals.confirmCreateCollection.viewCollection}
      completedAction={seeResult}
    >
      <div className="flex flex-col gap-10  items-center mb-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mt-10">
          <div className="w-[225px] lg:w-[300px] object-contain">
            <img
              src={collectionData.logoImage.preview}
              alt={`item-${collectionData.name}`}
              width={300}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col gap-3 w-60">
            <div className="flex gap-2">
              <b>{literals.createCollection.collectionName2}</b>
              <p>{collectionData.name}</p>
            </div>
            <div className="flex flex-col gap-2">
              <b>{literals.createCollection.description2}</b>
              <p className="text-sm ">{collectionData.description}</p>
            </div>
            {collectionData.url.split(
              "https://fibbo-market.web.app/collection/"
            )[1] && (
              <div className="flex  items-center gap-2">
                <b>{literals.confirmCreateCollection.customURL}</b>
                <p className="text-sm ">
                  /
                  {
                    collectionData.url.split(
                      "https://fibbo-market.web.app/collection/"
                    )[1]
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ActionModal>
  );
};
