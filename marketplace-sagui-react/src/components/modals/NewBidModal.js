import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/StateProvider";
import { formatEther } from "ethers/lib/utils";
import { useWFTMContract } from "../../contracts/wftm";
import { isMobile } from "react-device-detect";
import { Erc20AmountInput } from "../inputs/Erc20AmountInput";
import { ActionModal } from "./ActionModal";
import { formatLiteral } from "../../utils/language";

export default function MakeBidModal({
  collection,
  showModal,
  handleCloseModal,
  tokenId,
  wallet,
  tokenInfo,
  highestBid,
  auctionInfo,
  onMakeBid,
}) {
  const navigate = useNavigate();
  const [{ literals }] = useStateContext();
  const [bidAmmount, setBidAmmount] = useState(0);
  const [wftmBalance, setWftmBalance] = useState(0);
  const [payTokenSelected, setPayTokenSelected] = useState(null);
  const [{ updatedWFTM }] = useStateContext();

  const { getTotalFTMBalance } = useWFTMContract();

  const handleMakeBid = async () => {
    try {
      await onMakeBid(bidAmmount, payTokenSelected);
      return "OK";
    } catch (e) {
      return "ERROR";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (wallet) {
        const walletBalanceWFTM = await getTotalFTMBalance(wallet);
        setWftmBalance(walletBalanceWFTM);
        if (highestBid) {
          setBidAmmount(highestBid ? parseFloat(highestBid.bid) + 1 : 0);
        } else {
          if (auctionInfo?.minBid === auctionInfo?.reservePrice) {
            setBidAmmount(auctionInfo?.reservePrice);
          }
        }
      }
    };
    fetchData();
  }, [wallet]);

  useEffect(() => {
    const fetchData = async () => {
      if (wallet) {
        const walletBalanceFTM = await getTotalFTMBalance(wallet);
        setWftmBalance(walletBalanceFTM);
      }
    };
    fetchData();
  }, [updatedWFTM]);
  return (
    <ActionModal
      title={literals.newBidModal.makeBid}
      size="large"
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      onSubmit={() => handleMakeBid()}
      submitLabel={literals.newBidModal.makeBid}
      completedText={formatLiteral(literals.modals.bidPlaced, [
        bidAmmount,
        payTokenSelected?.name,
      ])}
      completedLabel={literals.newBidModal.viewBid}
      completedAction={handleCloseModal}
      submitDisabled={
        highestBid
          ? bidAmmount < parseFloat(highestBid.bid) + 1 ||
            (highestBid && bidAmmount < highestBid.bid) ||
            parseFloat(bidAmmount) > parseFloat(wftmBalance)
          : parseFloat(bidAmmount) > parseFloat(wftmBalance)
      }
    >
      <div className="my-10 mx-8 flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-3 ">
              <p>{literals.newBidModal.reservedPrice}</p>
              <img
                width={32}
                src={auctionInfo?.payToken.image}
                alt="Fantom coin"
              />
              <p>
                {auctionInfo?.reservePrice} {auctionInfo?.payToken.name}{" "}
              </p>
            </div>
            <div className="flex flex-row gap-6">
              <div>{literals.newBidModal.highestBid} </div>
              <div>
                {highestBid ? (
                  <div className="flex gap-2 items-center">
                    <img
                      width={32}
                      src={auctionInfo?.payToken.image}
                      alt="Fantom coin"
                    />
                    <p>
                      {highestBid?.bid} {auctionInfo?.payToken.name}
                    </p>
                  </div>
                ) : (
                  "-"
                )}
              </div>
            </div>
            {highestBid && (
              <div className="flex flex-row gap-6">
                <div>{literals.newBidModal.doneBy}</div>
                <div className="flex gap-2 items-center">
                  <img
                    className="rounded-full"
                    width={32}
                    src={highestBid.bidder.profileImg}
                    alt={`from-${highestBid.bidder._id}-img`}
                  />
                  <p
                    className="text-primary-2 underline cursor-pointer"
                    onClick={() =>
                      isMobile
                        ? navigate(`/account/${highestBid.bidder.wallet}`)
                        : window.open(
                            `/account/${highestBid.bidder.wallet}`,
                            "_blank"
                          )
                    }
                  >
                    {highestBid.bidder.username}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <Erc20AmountInput
              label={literals.newBidModal.bidPrice}
              value={bidAmmount}
              onChange={setBidAmmount}
              error={
                highestBid
                  ? bidAmmount < parseFloat(highestBid.bid) + 1 ||
                    (highestBid && bidAmmount < highestBid.bid) ||
                    parseFloat(bidAmmount) > parseFloat(wftmBalance)
                  : parseFloat(bidAmmount) > parseFloat(wftmBalance)
              }
              errorMessage={`${
                highestBid
                  ? parseFloat(bidAmmount) < parseFloat(highestBid.bid)
                    ? literals.newBidModal.biggerBid
                    : bidAmmount < parseFloat(highestBid.bid) + 1
                    ? literals.newBidModal.text1
                    : literals.newBidModal.notWFTM
                  : parseFloat(auctionInfo?.minBid) > parseFloat(bidAmmount)
                  ? literals.newBidModal.text2
                  : literals.newBidModal.notWFTM
              }`}
              selectedToken={payTokenSelected}
              setSelectedToken={setPayTokenSelected}
              showBalance={true}
            />
          </div>
        </div>
      </div>
    </ActionModal>
  );
}
