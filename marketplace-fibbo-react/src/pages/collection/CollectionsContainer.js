import ActionButton from "../../components/ActionButton";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAccount from "../../hooks/useAccount";
import { useApi } from "../../api";
import { Icon } from "@iconify/react";
import { PageWithLoading } from "../../components/basic/PageWithLoading";
import { useStateContext } from "../../context/StateProvider";

export default function CollectionsContainer() {
  const navigate = useNavigate();
  const { getAllCollections } = useApi();
  const [{ literals }] = useStateContext();
  const { wallet, connectToWallet } = useAccount();
  const [loading, setLoading] = useState(true);
  const [queryText, setQueryText] = useState("");

  const [collections, setCollections] = useState([]);

  const [filteredCollections, setFilteredCollections] = useState([]);

  const [items, setItems] = useState([]);

  const redirectToColectionPage = (col) => {
    if (col.customURL) {
      navigate(`/collection/${col.customURL}`);
    } else {
      navigate(`/collection/${col.contractAddress}`);
    }
  };

  const searchItems = (value) => {
    setQueryText(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      await connectToWallet();

      const collections = await getAllCollections(wallet);
      setCollections(collections);

      setItems(collections);
      setFilteredCollections(collections);
      setLoading(false);
    };
    fetchData();
  }, [wallet, connectToWallet]);

  useEffect(() => {
    let finalFiltered = filteredCollections;
    if (queryText.length >= 1) {
      finalFiltered = finalFiltered.filter((item) => {
        if (item.name.toLowerCase().includes(queryText.toLowerCase())) {
          return item;
        }
      });

      setFilteredCollections(finalFiltered);
    } else {
      setFilteredCollections(collections);
    }
  }, [queryText]);
  return (
    <PageWithLoading
      loading={loading}
      className="flex flex-col mt-[79px] mb-[79px] w-screen content-center justify-center"
    >
      <div className="flex w-full py-[20px] content-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="w-80 flex border-2 rounded">
            <div className="flex items-center justify-center px-4 border-l">
              <Icon icon="ant-design:search-outlined" />
            </div>
            <input
              onChange={(e) => searchItems(e.target.value)}
              type="text"
              value={queryText}
              className={`px-4 py-2 outline-none dark:bg-dark-1`}
              placeholder={literals.collections.search}
            />
          </div>
          <div className="">
            <b className="text-xl">{filteredCollections.length}</b>{" "}
            {literals.collections.result}
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap px-10 md:px-0  gap-5 w-full content-center justify-center py-[20px]">
        {filteredCollections.length > 0 ? (
          <>
            {filteredCollections?.map((col) => {
              return (
                <div
                  key={col._id}
                  className="hover:-translate-y-1 rounded-lg cursor-pointer flex flex-col items-center gap-5 text-xl"
                >
                  <div className="flex gap-2 items-center font-bold">
                    {col.name}
                    {col.isWatchlisted && (
                      <Icon icon="uis:favorite" width={28} />
                    )}
                  </div>
                  <div
                    onClick={() => redirectToColectionPage(col)}
                    className=" flex w-[150px] h-full items-center justify-center"
                  >
                    <img
                      src={col.logoImage}
                      className="object-cover rounded-lg w-[150px] h-[150px]"
                      alt={`colection-${col._id}`}
                    />
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div>{literals.collections.notFound}</div>
        )}
      </div>
    </PageWithLoading>
  );
}
