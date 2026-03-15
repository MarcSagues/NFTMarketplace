import ActionButton from "../../components/ActionButton";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAccount from "../../hooks/useAccount";
import { useApi } from "../../api";
import { Icon } from "@iconify/react";
import { PageWithLoading } from "../../components/basic/PageWithLoading";
import { useStateContext } from "../../context/StateProvider";

export default function MyCollectionsContainer() {
  const navigate = useNavigate();
  const { getMyCollections } = useApi();
  const [{ verifiedAddress, literals }] = useStateContext();
  const { wallet, connectToWallet } = useAccount();
  const [loading, setLoading] = useState(true);

  const [myCollections, setMyCollections] = useState([]);

  const goToCreateCollection = () => {
    navigate(`/collection/create`);
  };

  const redirectToColectionPage = (col) => {
    if (col.customURL) {
      navigate(`/collection/${col.customURL}`);
    } else {
      navigate(`/collection/${col.contractAddress}`);
    }
  };

  const redirectToCreate = (col) => {
    if (col.customURL) {
      navigate(`/collection/${col.customURL}/create`);
    } else {
      navigate(`/collection/${col.contractAddress}/create`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await connectToWallet();

      const collections = await getMyCollections(wallet);

      setMyCollections(collections);
      setLoading(false);
    };
    fetchData();
  }, [wallet, connectToWallet]);

  return (
    <PageWithLoading
      loading={loading}
      className="flex flex-col mt-[79px] mb-[79px] w-screen content-center justify-center"
    >
      <div className="flex w-full p-[40px] content-center justify-center">
        <div className="text-2xl">
          <b>{literals.myCollections.mycollections}</b>
        </div>
      </div>
      <div className="flex w-full px-8 md:mx-0  justify-center">
        <div className="text-lg">{literals.myCollections.text}</div>
      </div>
      <div className="flex w-full content-center justify-center p-[40px]">
        {verifiedAddress && (
          <ActionButton
            text={literals.actions.createCollection}
            size="large"
            buttonAction={() => goToCreateCollection()}
          />
        )}
      </div>
      <div className="flex flex-row flex-wrap px-10 md:px-0  gap-20 w-full content-center justify-center p-[40px]">
        {myCollections?.map((col) => {
          return (
            <div
              key={col._id}
              className="hover:-translate-y-1 rounded-lg cursor-pointer flex flex-col  w-[350px] md:w-[400px] h-[300px] md:h-[300px]  bg-slate-300"
            >
              <div
                onClick={() => redirectToColectionPage(col)}
                style={{
                  backgroundImage: `url(${col.featuredImage})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center center",
                }}
                className="flex w-full h-[200px] items-center rounded-lg justify-center "
              ></div>
              <div className="flex gap-4 items-center w-full h-[100px] p-4">
                <div
                  onClick={() => redirectToColectionPage(col)}
                  className=" flex w-[100px] h-full items-center justify-center"
                >
                  <img
                    src={col.logoImage}
                    className="object-cover rounded-lg"
                    alt={`colection-${col._id}`}
                  />
                </div>
                <div
                  onClick={() => redirectToColectionPage(col)}
                  className="flex flex-col w-[300px] h-full items-center justify-evenly text-black "
                >
                  <b>{col.name}</b>
                </div>
                <div
                  onClick={() => redirectToCreate(col)}
                  className="flexflex-col font-bold items-center justify-center hover:-translate-y-1   "
                >
                  <Icon color="black" width="40px" icon="carbon:add-filled" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageWithLoading>
  );
}
