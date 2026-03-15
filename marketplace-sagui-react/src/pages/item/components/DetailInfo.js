import React from "react";
import DropDown from "../../../components/DropDown";
import { truncateWallet } from "../../../utils/wallet";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../../context/StateProvider";
export default function DetailInfo({ properties, chainInfo, loading }) {
  const navigate = useNavigate();
  const [{ literals }] = useStateContext();
  const redirectToCollecion = () => {
    let collectionURL = "";
    if (properties.collection.customURL) {
      collectionURL = properties.collection.customURL;
    } else {
      collectionURL = properties.collection.contractAddress;
    }

    if (isMobile) {
      navigate(`/collection/${collectionURL}`);
    } else {
      window.open(`/collection/${collectionURL}`);
    }
  };

  return (
    <div className="col-span-1 flex flex-col rounded-md border-2 dark:bg-dark-2 ">
      <DropDown icon="bxs:info-square" title={literals.itemPage.chainData}>
        {loading ? (
          <div className="w-full h-full animate-pulse bg-gray-300"></div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div>
                <b>{literals.detailNFT.collection}</b>
              </div>
              <p
                onClick={() =>
                  isMobile
                    ? navigate(
                        `https://testnet.ftmscan.com/address/${chainInfo?.collection}`
                      )
                    : window.open(
                        `https://testnet.ftmscan.com/address/${chainInfo?.collection}`,
                        "_blank"
                      )
                }
                className="text-primary-2 underline cursor-pointer"
              >
                {chainInfo?.collection && truncateWallet(chainInfo?.collection)}
              </p>
            </div>
            <div className="flex justify-between">
              <div>
                <b>{literals.detailNFT.chain}</b>
              </div>
              <div>{chainInfo?.network}</div>
            </div>
            <div className="flex justify-between">
              <div>
                <b>{literals.detailNFT.idchain}</b>
              </div>
              <div>{chainInfo?.chainId}</div>
            </div>
            <div className="flex justify-between">
              <div>
                <b>{literals.detailNFT.idtoken}</b>
              </div>
              <div>
                {chainInfo?.tokenId} / {properties?.totalItems}
              </div>
            </div>
          </div>
        )}
      </DropDown>

      <DropDown icon="dashicons:tag" title={literals.itemPage.properties}>
        {loading ? (
          <div className="w-full h-full animate-pulse bg-gray-300"></div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div>
                <b>{literals.detailNFT.royalties}</b>
              </div>
              <div>{properties?.royalty}%</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <b>{literals.detailNFT.recipient}</b>
              </div>
              <div className="flex gap-3 items-center">
                <img
                  src={properties?.recipient?.profileImg}
                  alt="recipient-img"
                  className="rounded-full"
                  width={32}
                />
                <div
                  onClick={() =>
                    isMobile
                      ? navigate(`/account/${properties?.recipient?.wallet}`)
                      : window.open(`/profile/${properties?.recipient?.wallet}`)
                  }
                  className="text-primary-2 underline cursor-pointer"
                >
                  {properties?.recipient?.username}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <b>{literals.detailNFT.collection}</b>
              </div>
              <div className="flex gap-3 items-center">
                <img
                  src={properties?.collection?.logoImage}
                  alt="recipient-img"
                  className="rounded-full"
                  width={32}
                />
                <div
                  onClick={redirectToCollecion}
                  className="text-primary-2 underline cursor-pointer"
                >
                  {properties?.collection?.name}
                </div>
              </div>
            </div>
          </div>
        )}
      </DropDown>
    </div>
  );
}
